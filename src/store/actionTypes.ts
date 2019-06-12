import {Device} from "./modelTypes";

export const DEVICES_REQUEST_DEVICES = 'DEVICES_REQUEST_DEVICES';
export const DEVICES_RECEIVE_DEVICES = 'DEVICES_RECEIVE_DEVICES';

export const MAP_VIEW_CHANGE_DATE_RANGE = 'MAP_VIEW_CHANGE_DATE_RANGE';

export interface RequestDevicesAction {
    type: typeof DEVICES_REQUEST_DEVICES,
}

export interface ReceiveDevicesPayload {
    devices: Array<Device>
}

export interface ReceiveDevicesAction {
    type: typeof DEVICES_RECEIVE_DEVICES,
    payload: ReceiveDevicesPayload
}

export interface ChangeDateRangePayload {
    trackLayerIndex: number,
    fromDate: string,
    toDate: string,
}

export interface ChangeDateRangeAction {
    type: typeof MAP_VIEW_CHANGE_DATE_RANGE,
    payload: ChangeDateRangePayload,
}

export type ActionTypes = RequestDevicesAction | ReceiveDevicesAction | ChangeDateRangeAction
