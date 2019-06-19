import {AuthorizationType} from "./appTypes";

export const APP_REQUEST_CONFIG = 'APP_REQUEST_CONFIG';
export const APP_RECEIVE_CONFIG = 'APP_RECEIVE_CONFIG';
export const APP_UNAUTHORIZED = 'APP_UNAUTHORIZED';
export const APP_AUTHORIZED = 'APP_AUTHORIZED';

export interface RequestConfigAction {
    type: typeof APP_REQUEST_CONFIG
}

export interface ReceiveConfigPayload {
    apiUrl: string
    authorizationType: AuthorizationType
}

export interface ReceiveConfigAction {
    type: typeof APP_RECEIVE_CONFIG
    payload: ReceiveConfigPayload
}

export interface UnauthorizedAction {
    type: typeof APP_UNAUTHORIZED
}

export interface AuthorizedAction {
    type: typeof APP_AUTHORIZED
    payload: {
        authorizationHeader: string
    }
}

export type AppActionTypes = RequestConfigAction | ReceiveConfigAction | UnauthorizedAction | AuthorizedAction