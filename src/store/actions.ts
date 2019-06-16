import {ThunkAction} from "redux-thunk";
import {
    ActionTypes,
    APP_RECEIVE_CONFIG,
    APP_REQUEST_CONFIG,
    DEVICES_RECEIVE_DEVICES,
    DEVICES_REQUEST_DEVICES,
    MAP_VIEW_CHANGE_DATE_RANGE,
    MAP_VIEW_HIGHLIGHT_TRACK,
    MAP_VIEW_SELECT_TRACK,
    MAP_VIEW_SET_CONTROLS_VISIBLE,
    MAP_VIEW_SET_MAP_LAYER,
    MAP_VIEW_SET_RENDER_STYLE,
    MAP_VIEW_SET_TRACK_ACTIVE
} from "./actionTypes";
import {Device, MapLayer, RenderStyle} from "./modelTypes";
import {State} from "./rootReducer";
import {pushNotification} from "./notification/notificationActions";
import {NotificationType} from "./notification/notificationTypes";
import otRecorderClient from "../service/otRecorderClient";


function requestConfig(): ActionTypes {
    return {
        type: APP_REQUEST_CONFIG,
    };
}

function receiveConfig(apiUrl: string): ActionTypes {
    console.log('receiving config', apiUrl);
    return {
        type: APP_RECEIVE_CONFIG,
        payload: {apiUrl},
    };
}

export const fetchConfig = (): ThunkAction<void, State, void, ActionTypes> => async (dispatch) => {
    await dispatch(requestConfig());
    try {
        const config = await fetch(process.env.REACT_APP_CONFIG_URL || 'config.json')
            .then(it => it.json());
        return dispatch(receiveConfig(config['apiUrl']))
    } catch(err) {
        console.error(err);
        dispatch(pushNotification(NotificationType.ERROR, 'Could not fetch config'));
    }
};


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
    dispatch(pushNotification(NotificationType.SUCCESS, 'Fetched devices'));
    return dispatch(receiveDevices(devices));
};

export const updateDateRange = (trackLayerIndex: number, fromDate: string, toDate: string): ActionTypes => {
   return {
      type: MAP_VIEW_CHANGE_DATE_RANGE,
       payload: { trackGroupIndex: trackLayerIndex, fromDate, toDate },
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