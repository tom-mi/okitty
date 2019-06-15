import {Device, deviceEquals, RenderStyle, Track, TrackGroup} from "../modelTypes";
import {
    ActionTypes,
    DEVICES_RECEIVE_DEVICES,
    HighlightTrackPayload,
    MAP_VIEW_CHANGE_DATE_RANGE,
    MAP_VIEW_HIGHLIGHT_TRACK,
    MAP_VIEW_SELECT_TRACK,
    MAP_VIEW_SET_RENDER_STYLE,
    MAP_VIEW_SET_TRACK_ACTIVE,
    SelectTrackPayload,
    SetRenderStylePayload,
    SetTrackActivePayload
} from "../actionTypes";
import moment from 'moment';
import {maxTo, minFrom} from "../../service/timeRangeService";

export interface MapViewState {
    trackGroups: Array<TrackGroup>
}

const defaultTrackGroup = (): TrackGroup => {
    const fromDate = moment().subtract(7, "day").format('YYYY-MM-DD');
    const toDate = moment().format('YYYY-MM-DD');

    return {
        renderStyle: RenderStyle.TRACK,
        fromDate: fromDate,
        toDate: toDate,
        from: minFrom(fromDate),
        to: maxTo(toDate),
        tracks: [],
    }
};

const initialState = (): MapViewState => ({
    trackGroups: [defaultTrackGroup()]
});

const defaultTrack = (device: Device): Track => {
    return {
        active: true,
        selected: false,
        highlighted: false,
        device: device,
    };
};

const updateViewsWithDevices = (oldViews: Array<TrackGroup>, devices: Array<Device>): Array<TrackGroup> => {
    return oldViews.map(oldView => ({
        ...oldView,
        tracks: devices.map((device) => (
            oldView.tracks.find(track => deviceEquals(track.device, device)) || defaultTrack(device)
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

const updateTrackGroupsWithActiveTrack = (oldGroups: Array<TrackGroup>, payload: SetTrackActivePayload) => {
    return oldGroups.map((oldGroup, oldGroupIndex) => (oldGroupIndex === payload.trackGroupIndex ? {
        ...oldGroup,
        tracks: oldGroup.tracks.map((oldTrack, oldTrackIndex) => (oldTrackIndex === payload.trackIndex ? {
            ...oldTrack,
            active: payload.active,
        } : oldTrack))
    } : oldGroup));
};

const updateTrackGroupsWithSelectedTrack = (oldGroups: Array<TrackGroup>, payload: SelectTrackPayload) => {
    return oldGroups.map((oldGroup, oldGroupIndex) => ({
        ...oldGroup,
        tracks: oldGroup.tracks.map((oldTrack, oldTrackIndex) => ({
            ...oldTrack,
            selected: oldGroupIndex === payload.trackGroupIndex && oldTrackIndex === payload.trackIndex,
        })),
    }));
};

const updateTrackGroupsWithHighlightedTrack = (oldGroups: Array<TrackGroup>, payload: HighlightTrackPayload) => {
    return oldGroups.map((oldGroup, oldGroupIndex) => ({
        ...oldGroup,
        tracks: oldGroup.tracks.map((oldTrack, oldTrackIndex) => ({
            ...oldTrack,
            highlighted: oldGroupIndex === payload.trackGroupIndex && oldTrackIndex === payload.trackIndex,
        })),
    }));
};

const updateTrackGroupsWithRenderStyle = (oldGroups: Array<TrackGroup>, payload: SetRenderStylePayload) => {
    return oldGroups.map((oldGroup, oldGroupIndex) => (oldGroupIndex === payload.trackGroupIndex ? {
        ...oldGroup,
        renderStyle: payload.renderStyle,
    } : oldGroup));
};

export function mapViewReducer(
    state: MapViewState = initialState(),
    action: ActionTypes,
): MapViewState {
    switch (action.type) {
        case DEVICES_RECEIVE_DEVICES:
            return {...state, trackGroups: updateViewsWithDevices(state.trackGroups, action.payload.devices)};
        case MAP_VIEW_CHANGE_DATE_RANGE:
            return {
                ...state,
                trackGroups: updateViewWithDateRange(state.trackGroups, action.payload.trackGroupIndex, action.payload.fromDate, action.payload.toDate),
            };
        case MAP_VIEW_SET_TRACK_ACTIVE:
            return {
                ...state,
                trackGroups: updateTrackGroupsWithActiveTrack(state.trackGroups, action.payload),
            };
        case MAP_VIEW_SET_RENDER_STYLE:
            return {
                ...state,
                trackGroups: updateTrackGroupsWithRenderStyle(state.trackGroups, action.payload),
            };
        case MAP_VIEW_SELECT_TRACK:
            return {
                ...state,
                trackGroups: updateTrackGroupsWithSelectedTrack(state.trackGroups, action.payload),
            };
        case MAP_VIEW_HIGHLIGHT_TRACK:
            return {
                ...state,
                trackGroups: updateTrackGroupsWithHighlightedTrack(state.trackGroups, action.payload),
            };
    }
    return state
}