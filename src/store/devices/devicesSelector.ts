import {State} from "../rootReducer";
import {Device} from "../modelTypes";


export const getDevicesIsFetching = (state: State) : boolean => state.devices.isFetching;
export const getDevicesDevices = (state: State) : Array<Device> => state.devices.devices;
