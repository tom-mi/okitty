import {Device, deviceEquals, MapLayer, RenderStyle, Track, TrackGroup} from "../modelTypes";
import {
    ActionTypes,
    DEVICES_RECEIVE_DEVICES,
    MAP_VIEW_CHANGE_DATE_RANGE,
    MAP_VIEW_HIGHLIGHT_TRACK, MAP_VIEW_RECEIVE_GPX, MAP_VIEW_REQUEST_GPX,
    MAP_VIEW_SELECT_TRACK,
    MAP_VIEW_SET_CONTROLS_VISIBLE,
    MAP_VIEW_SET_MAP_LAYER,
    MAP_VIEW_SET_RENDER_STYLE,
    MAP_VIEW_SET_TRACK_ACTIVE,
    SetRenderStylePayload,
    SetTrackActivePayload,
    TrackIdentifierPayload
} from "../actionTypes";
import moment from 'moment';
import {maxTo, minFrom} from "../../service/timeRangeService";

export interface MapViewState {
    trackGroups: Array<TrackGroup>
    controlsVisible: boolean
    mapLayer: MapLayer
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
    controlsVisible: true,
    trackGroups: [defaultTrackGroup()],
    mapLayer: MapLayer.OSM,
});

const defaultTrack = (device: Device): Track => {
    return {
        active: true,
        selected: false,
        highlighted: false,
        device: device,
        isDownloadingGpx: false
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

const updateTracksWithDownloadingGpxState = (oldGroups: Array<TrackGroup>, payload: TrackIdentifierPayload, value: boolean) => {
    return oldGroups.map((oldGroup, oldGroupIndex) => (oldGroupIndex === payload.trackGroupIndex ? {
        ...oldGroup,
        tracks: oldGroup.tracks.map((oldTrack, oldTrackIndex) => (oldTrackIndex === payload.trackIndex ? {
            ...oldTrack,
            isDownloadingGpx: value,
        } : oldTrack))
    } : oldGroup));
};

const updateTrackGroupsWithSelectedTrack = (oldGroups: Array<TrackGroup>, payload: TrackIdentifierPayload) => {
    return oldGroups.map((oldGroup, oldGroupIndex) => ({
        ...oldGroup,
        tracks: oldGroup.tracks.map((oldTrack, oldTrackIndex) => ({
            ...oldTrack,
            selected: oldGroupIndex === payload.trackGroupIndex && oldTrackIndex === payload.trackIndex ?
                !oldTrack.selected : false,
        })),
    }));
};

const updateTrackGroupsWithHighlightedTrack = (oldGroups: Array<TrackGroup>, payload: TrackIdentifierPayload) => {
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
        case MAP_VIEW_SET_CONTROLS_VISIBLE:
            return {
                ...state,
                controlsVisible: action.payload.controlsVisible,
            };
        case MAP_VIEW_SET_MAP_LAYER:
            return {
                ...state,
                mapLayer: action.payload.mapLayer,
            };
        case MAP_VIEW_REQUEST_GPX:
            return {
                ...state,
                trackGroups: updateTracksWithDownloadingGpxState(state.trackGroups, action.payload, true),
            };
        case MAP_VIEW_RECEIVE_GPX:
            return {
                ...state,
                trackGroups: updateTracksWithDownloadingGpxState(state.trackGroups, action.payload, false),
            };
    }
    return state
}