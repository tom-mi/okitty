import {Device, deviceEquals, TrackGroup, Track} from "../modelTypes";
import {ActionTypes, DEVICES_RECEIVE_DEVICES, MAP_VIEW_CHANGE_DATE_RANGE} from "../actionTypes";
import moment from 'moment';
import {minFrom, maxTo} from "../../service/timeRangeService";
import {getIndexedColor} from "../../service/colorService";

export interface MapViewState {
    trackGroups: Array<TrackGroup>
}

const defaultTrackGroup = (): TrackGroup => {
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
    trackGroups: [defaultTrackGroup()]
};

const defaultTrack = (device: Device, index: number): Track => {
    return {
        device: device,
        color: getIndexedColor(index),
    };
};

const updateViewsWithDevices = (oldViews: Array<TrackGroup>, devices: Array<Device>): Array<TrackGroup> => {
    return oldViews.map(oldView => ({
        ...oldView,
        tracks: devices.map((device, index) => (
            oldView.tracks.find(track => deviceEquals(track.device, device)) || defaultTrack(device, index)
        ))
    }));
};

const updateViewWithDateRange = (oldViews: Array<TrackGroup>, index: number, fromDate: string, toDate: string): Array<TrackGroup> => {
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
            return {...state, trackGroups: updateViewsWithDevices(state.trackGroups, action.payload.devices)};
        case MAP_VIEW_CHANGE_DATE_RANGE:
            return {
                ...state,
                trackGroups: updateViewWithDateRange(state.trackGroups, action.payload.trackGroupIndex, action.payload.fromDate, action.payload.toDate)
            }
    }
    return state
}