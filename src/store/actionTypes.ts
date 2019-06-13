import {Device, RenderStyle} from "./modelTypes";

export const DEVICES_REQUEST_DEVICES = 'DEVICES_REQUEST_DEVICES';
export const DEVICES_RECEIVE_DEVICES = 'DEVICES_RECEIVE_DEVICES';

export const MAP_VIEW_CHANGE_DATE_RANGE = 'MAP_VIEW_CHANGE_DATE_RANGE';
export const MAP_VIEW_SET_TRACK_ACTIVE = 'MAP_VIEW_SET_TRACK_ACTIVE';
export const MAP_VIEW_SET_RENDER_STYLE = 'MAP_VIEW_SET_RENDER_STYLE';

export interface NoOp {
    type: undefined,
}

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
    trackGroupIndex: number,
    fromDate: string,
    toDate: string,
}

export interface ChangeDateRangeAction {
    type: typeof MAP_VIEW_CHANGE_DATE_RANGE,
    payload: ChangeDateRangePayload,
}

export interface SetTrackActivePayload {
    trackGroupIndex: number,
    trackIndex: number,
    active: boolean,
}

export interface SetTrackActiveAction {
    type: typeof MAP_VIEW_SET_TRACK_ACTIVE,
    payload: SetTrackActivePayload,
}

export interface SetRenderStylePayload {
    trackGroupIndex: number,
    renderStyle: RenderStyle,
}

export interface SetRenderStyleAction {
    type: typeof MAP_VIEW_SET_RENDER_STYLE,
    payload: SetRenderStylePayload,
}

export type ActionTypes = NoOp
    | RequestDevicesAction
    | ReceiveDevicesAction
    | ChangeDateRangeAction
    | SetTrackActiveAction
    | SetRenderStyleAction
