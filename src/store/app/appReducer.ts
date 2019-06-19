import {ActionTypes} from "../actionTypes";
import {AuthorizationType} from "./appTypes";
import {APP_AUTHORIZED, APP_RECEIVE_CONFIG, APP_REQUEST_CONFIG, APP_UNAUTHORIZED} from "./appActionTypes";

export interface AppState {
    apiUrl: string
    isFetchingConfig: boolean
    isConfigured: boolean
    isLoggedIn: boolean
    authorizationHeader: string | undefined
    authorizationType: AuthorizationType
}

const initialState: AppState = {
    apiUrl: 'http://localhost:8083',
    isFetchingConfig: false,
    isConfigured: false,
    isLoggedIn: false,
    authorizationType: AuthorizationType.NONE,
    authorizationHeader: undefined,
};

export function appReducer(
    state = initialState,
    action: ActionTypes,
): AppState {
    switch (action.type) {
        case APP_REQUEST_CONFIG:
            return {...state, isFetchingConfig: true};
        case APP_RECEIVE_CONFIG:
            return {
                ...state,
                isFetchingConfig: false,
                apiUrl: action.payload.apiUrl,
                authorizationType: action.payload.authorizationType,
                isConfigured: true,
            };
        case APP_UNAUTHORIZED:
            return {...state, isLoggedIn: false};
        case APP_AUTHORIZED:
            return {
                ...state, isLoggedIn: true, authorizationHeader: action.payload.authorizationHeader
            };
    }
    return state
}
