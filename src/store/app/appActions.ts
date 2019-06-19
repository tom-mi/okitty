import {ActionTypes} from "../actionTypes";
import {APP_AUTHORIZED, APP_RECEIVE_CONFIG, APP_REQUEST_CONFIG, APP_UNAUTHORIZED} from "./appActionTypes";
import {ThunkAction} from "redux-thunk";
import {pushNotification} from "../notification/notificationActions";
import {NotificationType} from "../notification/notificationTypes";
import {State} from "../rootReducer";
import {AuthorizationType} from "./appTypes";
import {fetchDevices} from "../actions";

function requestConfig(): ActionTypes {
    return {
        type: APP_REQUEST_CONFIG,
    };
}

export const CONFIG_URL = process.env.REACT_APP_CONFIG_URL || `${process.env.PUBLIC_URL}/config.json`;

function receiveConfig(apiUrl: string, authorizationType: AuthorizationType): ActionTypes {
    console.log('receiving config', apiUrl);
    return {
        type: APP_RECEIVE_CONFIG,
        payload: {apiUrl, authorizationType},
    };
}

export const fetchConfig = (): ThunkAction<void, State, void, ActionTypes> => async (dispatch) => {
    await dispatch(requestConfig());
    try {
        const config = await fetch(CONFIG_URL)
            .then(it => it.json());
        return dispatch(receiveConfig(
            config['apiUrl'] || '',
            config['authorizationType'] || AuthorizationType.NONE,
        ))
    } catch (err) {
        console.error(err);
        dispatch(pushNotification(NotificationType.ERROR, 'Could not fetch config'));
    }
};

const authorized = (authorizationType: AuthorizationType, authorizationHeader: string): ActionTypes => ({
    type: APP_AUTHORIZED,
    payload: {authorizationHeader},
});

export const loginAndFetchDevices = (authorizationType: AuthorizationType, authorizationHeader: string):
    ThunkAction<void, State, void, ActionTypes> => async (dispatch) => {
    await dispatch(authorized(authorizationType, authorizationHeader));
    return dispatch(fetchDevices());
};

export const unauthorized = (): ActionTypes => ({
    type: APP_UNAUTHORIZED,
});

