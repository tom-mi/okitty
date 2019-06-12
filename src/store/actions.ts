import {ThunkAction} from "redux-thunk";
import {
   ActionTypes,
   DEVICES_RECEIVE_DEVICES,
   DEVICES_REQUEST_DEVICES,
   MAP_VIEW_CHANGE_DATE_RANGE,
   MAP_VIEW_SET_TRACK_ACTIVE
} from "./actionTypes";
import {Device} from "./modelTypes";
import {State} from "./rootReducer";
import {getDevices} from "../service/otRecorderClient";


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
   const devices = await getDevices();
   return dispatch(receiveDevices(devices))
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
   }
};