import {ThunkAction} from "redux-thunk";
import {State} from "./store/rootReducer";
import {Action} from "redux";
import {fetchDevices} from "./store/actions";


export const initialize = () : ThunkAction<void, State, void, Action<any>> => async (dispatch) => {
    return dispatch(fetchDevices())
};