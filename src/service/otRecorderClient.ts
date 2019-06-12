import {Device} from "../store/modelTypes";


export function getDevices(): Promise<Array<Device>> {
    const usersUrl = new URL(`${process.env.REACT_APP_API_URL}/list`);

    return fetch(usersUrl.toString())
        .then(response => response.json())
        .then(json => json['results'] as Array<string>)
        .then(users => {
            return Promise.all(users.map(user => {
                const devicesUrl = new URL(`${process.env.REACT_APP_API_URL}/list`);

                devicesUrl.searchParams.append('user', user);

                return fetch(devicesUrl.toString())
                    .then(response => response.json())
                    .then(json => json['results'] as Array<string>)
                    .then(devices => devices.map(device => ({user: user, device: device})));
            }));
        })
        .then(userResponses => {
            return userResponses.flat(1);
        });
}


export function getLocationUrl(device: Device, format: string, from: string, to: string): string {
    const url = new URL(`${process.env.REACT_APP_API_URL}/locations`);

    url.searchParams.append('format', format);
    url.searchParams.append('user', device.user);
    url.searchParams.append('device', device.device);
    url.searchParams.append('from', from);
    url.searchParams.append('to', to);

    return url.toString();
}