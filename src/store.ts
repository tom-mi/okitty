import {configureStore} from "redux-starter-kit";
import rootReducer, {State} from "./store/rootReducer";
import {ActionTypes} from "./store/actionTypes";

export const store = configureStore<State, ActionTypes>({
    reducer: rootReducer
});
