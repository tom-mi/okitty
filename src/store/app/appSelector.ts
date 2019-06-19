import {State} from "../rootReducer";
import {AuthorizationType} from "./appTypes";


export const getApiUrl = (state: State): string => state.app.apiUrl;
export const getIsLoggedIn = (state: State): boolean => state.app.isLoggedIn;
export const getIsConfigured = (state: State): boolean => state.app.isConfigured;
export const getAuthorizationType = (state: State): AuthorizationType => state.app.authorizationType;
export const getAuthorizationHeader = (state: State): string | undefined => state.app.authorizationHeader;
