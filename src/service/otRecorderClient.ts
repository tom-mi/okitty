import {Device} from "../store/modelTypes";
import {EnhancedStore} from "redux-starter-kit";
import {ActionTypes} from "../store/actionTypes";
import {State} from "../store/rootReducer";
import {getApiUrl, getAuthorizationHeader} from "../store/app/appSelector";
import {NotificationType} from "../store/notification/notificationTypes";
import {pushNotification} from "../store/notification/notificationActions";
import {store} from "../store";
import {unauthorized} from "../store/app/appActions";


class OtRecorderClient {

    private store: EnhancedStore<State, ActionTypes>;

    constructor(store: EnhancedStore<State, ActionTypes>) {
        this.store = store;
    }

    private getApiUrl(): string {
        return getApiUrl(this.store.getState())
    }

    private getHeaders() {
        const headers: { [key: string]: string } = {};
        const authHeader = getAuthorizationHeader(this.store.getState());

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }
        return headers;
    }

    checkResponse(response: Response): Response {
        if (response.status === 200) {
            return response;
        } else {
            if (response.status === 401) {
                this.store.dispatch(unauthorized());
            }
            throw Error(`Request failed: ${response.status} ${response.statusText}`)
        }
    }

    getDevices(): Promise<Array<Device>> {
        const usersUrl = new URL(`${this.getApiUrl()}/list`);

        return fetch(usersUrl.toString(), {headers: this.getHeaders()})
            .then(response => this.checkResponse(response))
            .then(response => response.json())
            .then(json => json['results'] as Array<string>)
            .then(users => {
                return Promise.all(users.map(user => {
                    const devicesUrl = new URL(`${this.getApiUrl()}/list`);

                    devicesUrl.searchParams.append('user', user);

                    return fetch(devicesUrl.toString(), {headers: this.getHeaders()})
                        .then(response => this.checkResponse(response))
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

    fetchLocation(device: Device, format: string, from: string, to: string): Promise<string> {
        return fetch(this.getLocationUrl(device, format, from, to), {headers: this.getHeaders()})
            .then(response => this.checkResponse(response))
            .then(response => response.text())
            .catch((err) => {
                console.error(err);
                this.store.dispatch(pushNotification(NotificationType.ERROR, 'Could not fetch location data'));
                throw err;
            });
    }
}

export default new OtRecorderClient(store);