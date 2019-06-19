import {ThunkAction} from "redux-thunk";
import {State} from "./store/rootReducer";
import {Action} from "redux";
import {fetchDevices} from "./store/actions";
import {fetchConfig} from "./store/app/appActions";
import {getAuthorizationType} from "./store/app/appSelector";
import {AuthorizationType} from "./store/app/appTypes";


export const initialize = () : ThunkAction<void, State, void, Action<any>> => async (dispatch, getState) => {
    await dispatch(fetchConfig());
    if (getAuthorizationType(getState()) === AuthorizationType.NONE) {
        return dispatch(fetchDevices());
    }
};