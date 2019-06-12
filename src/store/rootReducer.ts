import {combineReducers} from 'redux'
import {devicesReducer} from "./devices/devicesReducer"
import {mapViewReducer} from "./mapView/mapViewReducer";

const rootReducer = combineReducers({
    devices: devicesReducer,
    mapView: mapViewReducer,
});

export default rootReducer

export type State = ReturnType<typeof rootReducer>