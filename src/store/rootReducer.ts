import {combineReducers} from 'redux'
import {devicesReducer} from "./devices/devicesReducer"
import {mapViewReducer} from "./mapView/mapViewReducer";
import {appReducer} from "./app/appReducer";
import {notificationReducer} from "./notification/notificationReducer";

const rootReducer = combineReducers({
    app: appReducer,
    devices: devicesReducer,
    mapView: mapViewReducer,
    notifications: notificationReducer,
});

export default rootReducer

export type State = ReturnType<typeof rootReducer>