import {ActionTypes, APP_RECEIVE_CONFIG, APP_REQUEST_CONFIG} from "../actionTypes";

export interface AppState {
    apiUrl: string
    isFetchingConfig: boolean
    isConfigured: boolean
    isLoggedIn: boolean
}

const initialState: AppState = {
    apiUrl: 'http://localhost:8083',
    isFetchingConfig: false,
    isConfigured: false,
    isLoggedIn: false,
};

export function appReducer(
    state = initialState,
    action: ActionTypes,
): AppState {
    switch (action.type) {
        case APP_REQUEST_CONFIG:
            return {...state, isFetchingConfig: true};
        case APP_RECEIVE_CONFIG:
            return {...state, isFetchingConfig: false, apiUrl: action.payload.apiUrl, isConfigured: true};
    }
    return state
}
