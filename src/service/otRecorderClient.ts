import {Device} from "../store/modelTypes";
import {EnhancedStore} from "redux-starter-kit";
import {ActionTypes} from "../store/actionTypes";
import {State} from "../store/rootReducer";
import {getApiUrl} from "../store/app/appSelector";
import {NotificationType} from "../store/notification/notificationTypes";
import {pushNotification} from "../store/notification/notificationActions";
import {store} from "../store";


class OtRecorderClient {

    private store: EnhancedStore<State, ActionTypes>;

    constructor(store: EnhancedStore<State, ActionTypes>) {
        this.store = store;
    }

    private getApiUrl(): string {
        return getApiUrl(this.store.getState())
    }

    getDevices(): Promise<Array<Device>> {
        const usersUrl = new URL(`${this.getApiUrl()}/list`);
        console.debug('api url', this.getApiUrl());
        console.debug(usersUrl);

        return fetch(usersUrl.toString())
            .then(response => response.json())
            .then(json => json['results'] as Array<string>)
            .then(users => {
                return Promise.all(users.map(user => {
                    const devicesUrl = new URL(`${this.getApiUrl()}/list`);

                    devicesUrl.searchParams.append('user', user);

                    return fetch(devicesUrl.toString())
                        .then(response => response.json())
                        .then(json => json['results'] as Array<string>)
                        .then(devices => devices.map(device => ({user: user, device: device})));
                }));
            })
            .then(userResponses => {
                return userResponses.flat(1);
            })
            .catch((err) => {
                console.error(err);
                this.store.dispatch(pushNotification(NotificationType.ERROR, 'Could not fetch devices'));
                throw err;
            });
    }

    getLocationUrl(device: Device, format: string, from: string, to: string): string {
        const url = new URL(`${this.getApiUrl()}/locations`);

        url.searchParams.append('format', format);
        url.searchParams.append('user', device.user);
        url.searchParams.append('device', device.device);
        url.searchParams.append('from', from);
        url.searchParams.append('to', to);

        return url.toString();
    }
}

export default new OtRecorderClient(store);