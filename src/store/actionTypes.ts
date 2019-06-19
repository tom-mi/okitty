import {Device, MapLayer, RenderStyle} from "./modelTypes";
import {NotificationActionTypes} from "./notification/notificationActionTypes";
import {AppActionTypes} from "./app/appActionTypes";

export const DEVICES_REQUEST_DEVICES = 'DEVICES_REQUEST_DEVICES';
export const DEVICES_RECEIVE_DEVICES = 'DEVICES_RECEIVE_DEVICES';

export const MAP_VIEW_CHANGE_DATE_RANGE = 'MAP_VIEW_CHANGE_DATE_RANGE';
export const MAP_VIEW_SET_TRACK_ACTIVE = 'MAP_VIEW_SET_TRACK_ACTIVE';
export const MAP_VIEW_SELECT_TRACK = 'MAP_VIEW_SELECT_TRACK';
export const MAP_VIEW_HIGHLIGHT_TRACK = 'MAP_VIEW_HIGHLIGHT_TRACK';
export const MAP_VIEW_SET_RENDER_STYLE = 'MAP_VIEW_SET_RENDER_STYLE';
export const MAP_VIEW_SET_CONTROLS_VISIBLE = 'MAP_VIEW_SET_CONTROLS_VISIBLE';
export const MAP_VIEW_SET_MAP_LAYER = 'MAP_VIEW_SET_MAP_LAYER';

export interface NoOp {
    type: undefined,
}

export interface RequestDevicesAction {
    type: typeof DEVICES_REQUEST_DEVICES
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

export interface SelectTrackPayload {
    trackGroupIndex: number,
    trackIndex: number,
}

export interface SelectTrackAction {
    type: typeof MAP_VIEW_SELECT_TRACK,
    payload: SelectTrackPayload,
}

export interface HighlightTrackPayload {
    trackGroupIndex: number,
    trackIndex: number,
}

export interface HighlightTrackAction {
    type: typeof MAP_VIEW_HIGHLIGHT_TRACK,
    payload: HighlightTrackPayload,
}

export interface SetControlsVisibleAction {
    type: typeof MAP_VIEW_SET_CONTROLS_VISIBLE,
    payload: { controlsVisible: boolean },
}

export interface SetMapLayerAction {
    type: typeof MAP_VIEW_SET_MAP_LAYER,
    payload: { mapLayer: MapLayer },
}

export type ActionTypes = NoOp
    | AppActionTypes
    | RequestDevicesAction
    | ReceiveDevicesAction
    | ChangeDateRangeAction
    | SetTrackActiveAction
    | SetRenderStyleAction
    | SelectTrackAction
    | HighlightTrackAction
    | SetControlsVisibleAction
    | SetMapLayerAction
    | NotificationActionTypes

