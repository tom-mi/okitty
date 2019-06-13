import {Device, deviceEquals, RenderStyle, Track, TrackGroup} from "../modelTypes";
import {
    ActionTypes,
    DEVICES_RECEIVE_DEVICES,
    MAP_VIEW_CHANGE_DATE_RANGE,
    MAP_VIEW_SET_RENDER_STYLE,
    MAP_VIEW_SET_TRACK_ACTIVE,
    SetRenderStylePayload,
    SetTrackActivePayload
} from "../actionTypes";
import moment from 'moment';
import {maxTo, minFrom} from "../../service/timeRangeService";
import {getIndexedColor} from "../../service/colorService";

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

const defaultTrack = (device: Device, index: number): Track => {
    return {
        active: true,
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

const updateTrackGroupsWithActiveTrack = (oldGroups: Array<TrackGroup>, payload: SetTrackActivePayload) => {
    return oldGroups.map((oldGroup, oldgroupIndex) => (oldgroupIndex === payload.trackGroupIndex ? {
        ...oldGroup,
        tracks: oldGroup.tracks.map((oldTrack, oldTrackIndex) => (oldTrackIndex === payload.trackIndex ? {
            ...oldTrack,
            active: payload.active,
        } : oldTrack))
    } : oldGroup));
};

const deactivateAllTracksExceptFirst = (oldTracks: Array<Track>): Array<Track> => {
    let foundActiveTrack: boolean = false;
    return oldTracks.map((oldTrack) => {
        if (oldTrack.active && !foundActiveTrack) {
            foundActiveTrack = true;
            return oldTrack;
        } else {
            return {...oldTrack, active: false};
        }
    });
};

const activateAllTracks = (oldTracks: Array<Track>): Array<Track> =>
    oldTracks.map((oldTrack) => ({...oldTrack, active: true}));

const updateTrackGroupsWithRenderStyle = (oldGroups: Array<TrackGroup>, payload: SetRenderStylePayload) => {
    return oldGroups.map((oldGroup, oldgroupIndex) => (oldgroupIndex === payload.trackGroupIndex ? {
        ...oldGroup,
        renderStyle: payload.renderStyle,
        tracks: payload.renderStyle === RenderStyle.HEATMAP ?
            deactivateAllTracksExceptFirst(oldGroup.tracks) : activateAllTracks(oldGroup.tracks),
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
    }
    return state
}