import {ThunkAction} from "redux-thunk";
import {
    ActionTypes,
    DEVICES_RECEIVE_DEVICES,
    DEVICES_REQUEST_DEVICES,
    MAP_VIEW_CHANGE_DATE_RANGE,
    MAP_VIEW_HIGHLIGHT_TRACK, MAP_VIEW_RECEIVE_GPX, MAP_VIEW_REQUEST_GPX,
    MAP_VIEW_SELECT_TRACK,
    MAP_VIEW_SET_CONTROLS_VISIBLE,
    MAP_VIEW_SET_MAP_LAYER,
    MAP_VIEW_SET_RENDER_STYLE,
    MAP_VIEW_SET_TRACK_ACTIVE
} from "./actionTypes";
import {Device, MapLayer, RenderStyle} from "./modelTypes";
import {State} from "./rootReducer";
import otRecorderClient from "../service/otRecorderClient";
import {getMapViewTrackGroups} from "./mapView/mapViewSelector";
import {getTrackFilename} from "../service/trackFilenameService";
import download from 'downloadjs';


function requestDevices(): ActionTypes {
    return {
        type: DEVICES_REQUEST_DEVICES,
    }
}

function receiveDevices(devices: Array<Device>): ActionTypes {
    return {
        type: DEVICES_RECEIVE_DEVICES,
        payload: {
            devices: devices,
        }
    }
}

export const fetchDevices = (): ThunkAction<void, State, void, ActionTypes> => async (dispatch) => {
    dispatch(requestDevices());
    const devices = await otRecorderClient.getDevices();
    return dispatch(receiveDevices(devices));
};

export const updateDateRange = (trackLayerIndex: number, fromDate: string, toDate: string): ActionTypes => {
    return {
        type: MAP_VIEW_CHANGE_DATE_RANGE,
        payload: {trackGroupIndex: trackLayerIndex, fromDate, toDate},
    };
};

export const setTrackActive = (trackGroupIndex: number, trackIndex: number, active: boolean): ActionTypes => {
    return {
        type: MAP_VIEW_SET_TRACK_ACTIVE,
        payload: {
            trackGroupIndex: trackGroupIndex,
            trackIndex: trackIndex,
            active: active,
        }
    };
};

export const setRenderStyle = (trackGroupIndex: number, renderStyle: RenderStyle): ActionTypes => {
    return {
        type: MAP_VIEW_SET_RENDER_STYLE,
        payload: {
            trackGroupIndex: trackGroupIndex,
            renderStyle: renderStyle,
        }
    };
};

export const selectTrack = (trackGroupIndex: number, trackIndex: number): ActionTypes => {
    return {
        type: MAP_VIEW_SELECT_TRACK,
        payload: {trackGroupIndex, trackIndex},
    }
};

export const highlightTrack = (trackGroupIndex: number, trackIndex: number): ActionTypes => {
    return {
        type: MAP_VIEW_HIGHLIGHT_TRACK,
        payload: {trackGroupIndex, trackIndex},
    }
};

export const setControlsVisible = (controlsVisible: boolean): ActionTypes => {
    return {
        type: MAP_VIEW_SET_CONTROLS_VISIBLE,
        payload: {controlsVisible},
    };
};

export const setMapLayer = (mapLayer: MapLayer): ActionTypes => {
    return {
        type: MAP_VIEW_SET_MAP_LAYER,
        payload: {mapLayer},
    };
};

function requestGpxTrack(trackGroupIndex: number, trackIndex: number): ActionTypes {
    return {
        type: MAP_VIEW_REQUEST_GPX,
        payload: {trackGroupIndex, trackIndex},
    };
}

function receiveGpxTrack(trackGroupIndex: number, trackIndex: number): ActionTypes {
    return {
        type: MAP_VIEW_RECEIVE_GPX,
        payload: {trackGroupIndex, trackIndex},
    };
}

export const downloadGpxTrack = (trackGroupIndex: number, trackIndex: number):
    ThunkAction<void, State, void, ActionTypes> => async (dispatch, getState) => {

    const trackGroup = getMapViewTrackGroups(getState())[trackGroupIndex];
    const track = trackGroup.tracks[trackIndex];
    await dispatch(requestGpxTrack(trackGroupIndex, trackIndex));
    try {
        const data = await otRecorderClient.fetchLocation(track.device, 'gpx', trackGroup.from, trackGroup.to);
        download(data, getTrackFilename(track.device, trackGroup.from, trackGroup.to, 'gpx'), 'application/gpx+xml');
    } finally {
        await dispatch(receiveGpxTrack(trackGroupIndex, trackIndex));
    }
};