import {Device} from "../modelTypes";
import {ActionTypes, DEVICES_RECEIVE_DEVICES, DEVICES_REQUEST_DEVICES} from "../actionTypes";

export interface DevicesState {
    devices: Array<Device>
    isFetching: boolean
}

const initialState: DevicesState = {
    devices: [],
    isFetching: false,
};

export function devicesReducer(
    state = initialState,
    action: ActionTypes,
): DevicesState {
    switch(action.type) {
        case DEVICES_REQUEST_DEVICES:
            return {...state, isFetching: true};
        case DEVICES_RECEIVE_DEVICES:
            return {...state, isFetching: false, devices: action.payload.devices};
    }
    return state
}