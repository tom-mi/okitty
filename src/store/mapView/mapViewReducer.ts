import {Device, deviceEquals, TrackLayer, Track} from "../modelTypes";
import {ActionTypes, DEVICES_RECEIVE_DEVICES, MAP_VIEW_CHANGE_DATE_RANGE} from "../actionTypes";
import moment from 'moment';
import {clampIsoDatetimeToLocalDateInterval, minFrom, maxTo} from "../../service/timeRangeService";

export interface MapViewState {
    trackLayers: Array<TrackLayer>
}

const defaultTrackLayer = (): TrackLayer => {
    const fromDate = moment().subtract(7, "day").format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');

    return {
        fromDate: fromDate,
        toDate: toDate,
        from: minFrom(fromDate),
        to: maxTo(toDate),
        tracks: [],
    }
};

const initialState: MapViewState = {
    trackLayers: [defaultTrackLayer()]
};

const defaultTrack = (device: Device, index: number): Track => {
    return {
        device: device,
    };
};

const updateViewsWithDevices = (oldViews: Array<TrackLayer>, devices: Array<Device>): Array<TrackLayer> => {
    return oldViews.map(oldView => ({
        ...oldView,
        tracks: devices.map((device, index) => (
            oldView.tracks.find(track => deviceEquals(track.device, device)) || defaultTrack(device, index)
        ))
    }));
};

const updateViewWithDateRange = (oldViews: Array<TrackLayer>, index: number, fromDate: string, toDate: string): Array<TrackLayer> => {
    return oldViews.map((oldView, oldViewIndex) => (oldViewIndex === index ? {
        ...oldView,
        fromDate: fromDate,
        toDate: toDate,
        from: minFrom(fromDate),
        to: maxTo(toDate),
    } : oldView));
};

export function mapViewReducer(
    state = initialState,
    action: ActionTypes,
): MapViewState {
    switch (action.type) {
        case DEVICES_RECEIVE_DEVICES:
            return {...state, trackLayers: updateViewsWithDevices(state.trackLayers, action.payload.devices)};
        case MAP_VIEW_CHANGE_DATE_RANGE:
            return {
                ...state,
                trackLayers: updateViewWithDateRange(state.trackLayers, action.payload.trackLayerIndex, action.payload.fromDate, action.payload.toDate)
            }
    }
    return state
}