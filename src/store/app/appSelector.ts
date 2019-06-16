import {State} from "../rootReducer";


export const getApiUrl = (state: State): string => state.app.apiUrl;
