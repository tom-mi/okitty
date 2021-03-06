import {mapViewReducer, MapViewState} from "./mapViewReducer";
import {Device, MapLayer, RenderStyle, Track, TrackGroup} from "../modelTypes";
import * as MockDate from 'mockdate';
import moment from 'moment';
import {
    DEVICES_RECEIVE_DEVICES,
    MAP_VIEW_CHANGE_DATE_RANGE,
    MAP_VIEW_HIGHLIGHT_TRACK, MAP_VIEW_RECEIVE_GPX, MAP_VIEW_REQUEST_GPX,
    MAP_VIEW_SELECT_TRACK,
    MAP_VIEW_SET_CONTROLS_VISIBLE,
    MAP_VIEW_SET_MAP_LAYER,
    MAP_VIEW_SET_RENDER_STYLE,
    MAP_VIEW_SET_TRACK_ACTIVE
} from "../actionTypes";


const defaultTrackGroup = (): TrackGroup => ({
    renderStyle: RenderStyle.TRACK,
    fromDate: '2019-06-07',
    toDate: '2019-06-14',
    from: '2019-06-06T22:00:00.000Z',
    to: '2019-06-14T21:59:59.999Z',
    tracks: [],
});
const defaultState = (): MapViewState => ({
    controlsVisible: true,
    trackGroups: [defaultTrackGroup()],
    mapLayer: MapLayer.OSM,
});
const createTrack = (device: Device): Track => ({
    active: true,
    selected: false,
    highlighted: false,
    device: device,
    isDownloadingGpx: false,
});
const DEVICE_1: Device = {device: 'phone', user: 'tommi'};
const DEVICE_2: Device = {device: 'tablet', user: 'john'};

const populatedState = (): MapViewState => ({
    controlsVisible: true,
    mapLayer: MapLayer.OSM,
    trackGroups: [
        {
            ...defaultTrackGroup(),
            tracks: [{...createTrack(DEVICE_1), selected: true, highlighted: true, isDownloadingGpx: true}, createTrack(DEVICE_2)]
        },
        {...defaultTrackGroup(), tracks: [createTrack(DEVICE_1), createTrack(DEVICE_2)]},
    ]
});

describe('the mapViewReducer', () => {
    beforeAll(() => {
        MockDate.set(moment('2019-06-14T04:24:00Z'), 120);
    });

    afterAll(() => {
        MockDate.reset();
    });

    it('returns the initial state', () => {
        const state = mapViewReducer(undefined, {type: undefined});

        expect(state).toEqual(defaultState());
    });

    it('inserts devices with default settings into track groups', () => {
        const newState = mapViewReducer(defaultState(), {
            type: DEVICES_RECEIVE_DEVICES,
            payload: {devices: [DEVICE_1, DEVICE_2]}
        });

        expect(newState.trackGroups[0].tracks.length).toEqual(2);
        expect(newState.trackGroups[0].tracks[0].device).toEqual(DEVICE_1);
        expect(newState.trackGroups[0].tracks[0].active).toBeTruthy();
        expect(newState.trackGroups[0].tracks[1].device).toEqual(DEVICE_2);
        expect(newState.trackGroups[0].tracks[1].active).toBeTruthy();
    });

    it('changes the date range of the specified track group', () => {
        const oldState = {
            ...defaultState(),
            trackGroups: [defaultTrackGroup(), defaultTrackGroup()],
        };

        const newState = mapViewReducer(oldState, {
            type: MAP_VIEW_CHANGE_DATE_RANGE,
            payload: {
                trackGroupIndex: 1,
                fromDate: '2017-06-07',
                toDate: '2017-06-08',
            },
        });

        expect(newState.trackGroups[0]).toEqual(defaultTrackGroup());
        expect(newState.trackGroups[1].fromDate).toEqual('2017-06-07');
        expect(newState.trackGroups[1].toDate).toEqual('2017-06-08');
        expect(newState.trackGroups[1].from).toEqual('2017-06-06T22:00:00.000Z');
        expect(newState.trackGroups[1].to).toEqual('2017-06-08T21:59:59.999Z');
    });

    it('changes the active state of the specified track', () => {
        const newState = mapViewReducer(populatedState(), {
            type: MAP_VIEW_SET_TRACK_ACTIVE,
            payload: {
                trackGroupIndex: 1,
                trackIndex: 0,
                active: false,
            },
        });

        expect(newState.trackGroups[0].tracks[0].active).toBeTruthy();
        expect(newState.trackGroups[0].tracks[1].active).toBeTruthy();
        expect(newState.trackGroups[1].tracks[0].active).toBeFalsy();
        expect(newState.trackGroups[1].tracks[1].active).toBeTruthy();
    });

    describe('the SetRenderStyleAction', () => {
        it('sets the render style', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_SET_RENDER_STYLE,
                payload: {
                    trackGroupIndex: 1,
                    renderStyle: RenderStyle.POINTS,
                },
            });

            expect(newState.trackGroups[0].renderStyle).toEqual(RenderStyle.TRACK);
            expect(newState.trackGroups[1].renderStyle).toEqual(RenderStyle.POINTS);
            expect(newState.trackGroups[1].tracks[0].active).toBeTruthy();
            expect(newState.trackGroups[1].tracks[1].active).toBeTruthy();
        });
    });

    describe('the SelectTrackAction', () => {
        it('selects a track', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_SELECT_TRACK,
                payload: {trackGroupIndex: 1, trackIndex: 0},
            });

            expect(newState.trackGroups[0].tracks[0].selected).toBeFalsy();
            expect(newState.trackGroups[0].tracks[1].selected).toBeFalsy();
            expect(newState.trackGroups[1].tracks[0].selected).toBeTruthy();
            expect(newState.trackGroups[1].tracks[1].selected).toBeFalsy();
        });

        it('unselects track', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_SELECT_TRACK,
                payload: {trackGroupIndex: 1, trackIndex: -1},
            });

            expect(newState.trackGroups[0].tracks[0].selected).toBeFalsy();
            expect(newState.trackGroups[0].tracks[1].selected).toBeFalsy();
            expect(newState.trackGroups[1].tracks[0].selected).toBeFalsy();
            expect(newState.trackGroups[1].tracks[1].selected).toBeFalsy();
        });

        it('unselects track if selecting again', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_SELECT_TRACK,
                payload: {trackGroupIndex: 0, trackIndex: 0},
            });

            expect(newState.trackGroups[0].tracks[0].selected).toBeFalsy();
            expect(newState.trackGroups[0].tracks[1].selected).toBeFalsy();
            expect(newState.trackGroups[1].tracks[0].selected).toBeFalsy();
            expect(newState.trackGroups[1].tracks[1].selected).toBeFalsy();
        });
    });

    describe('the HighlightTrackAction', () => {
        it('highligts a track', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_HIGHLIGHT_TRACK,
                payload: {trackGroupIndex: 1, trackIndex: 0},
            });

            expect(newState.trackGroups[0].tracks[0].highlighted).toBeFalsy();
            expect(newState.trackGroups[0].tracks[1].highlighted).toBeFalsy();
            expect(newState.trackGroups[1].tracks[0].highlighted).toBeTruthy();
            expect(newState.trackGroups[1].tracks[1].highlighted).toBeFalsy();
        });

        it('un-highlights track', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_HIGHLIGHT_TRACK,
                payload: {trackGroupIndex: 1, trackIndex: -1},
            });

            expect(newState.trackGroups[0].tracks[0].highlighted).toBeFalsy();
            expect(newState.trackGroups[0].tracks[1].highlighted).toBeFalsy();
            expect(newState.trackGroups[1].tracks[0].highlighted).toBeFalsy();
            expect(newState.trackGroups[1].tracks[1].highlighted).toBeFalsy();
        });
    });

    describe('the SetControlsVisibleAction', () => {
        it('hides the controls', () => {
            const newState = mapViewReducer({...defaultState(), controlsVisible: true}, {
                type: MAP_VIEW_SET_CONTROLS_VISIBLE,
                payload: {controlsVisible: false}
            });

            expect(newState.controlsVisible).toBeFalsy();
        });

        it('shows the controls', () => {
            const newState = mapViewReducer({...defaultState(), controlsVisible: false}, {
                type: MAP_VIEW_SET_CONTROLS_VISIBLE,
                payload: {controlsVisible: true}
            });

            expect(newState.controlsVisible).toBeTruthy();
        });
    });

    describe('the SetMapLayerAction', () => {
        it('sets the map layer', () => {
            const newState = mapViewReducer({...defaultState()}, {
                type: MAP_VIEW_SET_MAP_LAYER,
                payload: {mapLayer: MapLayer.DARK_MATTER}
            });

            expect(newState.mapLayer).toEqual(MapLayer.DARK_MATTER);
        });
    });

    describe('the RequestGpxAction', () => {
        it('sets downloading state', () => {
            const newState = mapViewReducer(populatedState(), {
                type: MAP_VIEW_REQUEST_GPX,
                payload: {trackGroupIndex: 1, trackIndex: 0}
            });

            expect(newState.trackGroups[0].tracks[0].isDownloadingGpx).toBeTruthy();
            expect(newState.trackGroups[0].tracks[1].isDownloadingGpx).toBeFalsy();
            expect(newState.trackGroups[1].tracks[0].isDownloadingGpx).toBeTruthy();
            expect(newState.trackGroups[1].tracks[1].isDownloadingGpx).toBeFalsy();
        });
    });

    describe('the ReceiveGpxAction', () => {
       it('removes downloading state', () => {
           const newState = mapViewReducer(populatedState(), {
               type: MAP_VIEW_RECEIVE_GPX,
               payload: {trackGroupIndex: 0, trackIndex: 0}
           });

           expect(newState.trackGroups[0].tracks[0].isDownloadingGpx).toBeFalsy();
           expect(newState.trackGroups[0].tracks[1].isDownloadingGpx).toBeFalsy();
           expect(newState.trackGroups[1].tracks[0].isDownloadingGpx).toBeFalsy();
           expect(newState.trackGroups[1].tracks[1].isDownloadingGpx).toBeFalsy();
       });
    });
});
