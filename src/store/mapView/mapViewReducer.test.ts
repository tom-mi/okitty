import {mapViewReducer, MapViewState} from "./mapViewReducer";
import {Device, RenderStyle, Track, TrackGroup} from "../modelTypes";
import * as MockDate from 'mockdate';
import moment from 'moment';
import {
    DEVICES_RECEIVE_DEVICES,
    MAP_VIEW_CHANGE_DATE_RANGE,
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
    trackGroups: [defaultTrackGroup()],
});
const createTrack = (device: Device): Track => ({
    color: 'blue',
    active: true,
    device: device,
});
const DEVICE_1: Device = {device: 'phone', user: 'tommi'};
const DEVICE_2: Device = {device: 'tablet', user: 'john'};
const DEVICE_3: Device = {device: 'phone', user: 'john'};

const populatedState = (): MapViewState => ({
    trackGroups: [
        {...defaultTrackGroup(), tracks: [createTrack(DEVICE_1), createTrack(DEVICE_2)]},
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
        expect(newState.trackGroups[0].tracks[0].color).not.toEqual(newState.trackGroups[0].tracks[1].color);
    });

    it('changes the date range of the specified track group', () => {
        const oldState = {
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

    it('changes the acvite state of the specified track', () => {
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

        it('deactivates all tracks but one for HEATMAP', () => {
            const oldState = {
                ...defaultState(),
                renderStyle: RenderStyle.TRACK,
                trackGroups: [{
                    ...defaultTrackGroup(), tracks: [
                        {...createTrack(DEVICE_1), active: false},
                        {...createTrack(DEVICE_2), active: true},
                        {...createTrack(DEVICE_3), active: true},
                    ]
                }]
            };

            const newState = mapViewReducer(oldState, {
                type: MAP_VIEW_SET_RENDER_STYLE,
                payload: {
                    trackGroupIndex: 0,
                    renderStyle: RenderStyle.HEATMAP,
                },
            });

            expect(newState.trackGroups[0].renderStyle).toEqual(RenderStyle.HEATMAP);
            expect(newState.trackGroups[0].tracks[0].active).toBeFalsy();
            expect(newState.trackGroups[0].tracks[1].active).toBeTruthy();
            expect(newState.trackGroups[0].tracks[2].active).toBeFalsy();
        });

        [RenderStyle.TRACK, RenderStyle.POINTS].forEach(renderStyle => {
            it(`activate all tracks but one for ${renderStyle}`, () => {
                const oldState = {
                    ...defaultState(),
                    renderStyle: RenderStyle.TRACK,
                    trackGroups: [{
                        ...defaultTrackGroup(), tracks: [
                            {...createTrack(DEVICE_1), active: false},
                            {...createTrack(DEVICE_2), active: true},
                        ]
                    }]
                };

                const newState = mapViewReducer(oldState, {
                    type: MAP_VIEW_SET_RENDER_STYLE,
                    payload: {
                        trackGroupIndex: 0,
                        renderStyle: renderStyle,
                    },
                });

                expect(newState.trackGroups[0].renderStyle).toEqual(renderStyle);
                expect(newState.trackGroups[0].tracks[0].active).toBeTruthy();
                expect(newState.trackGroups[0].tracks[1].active).toBeTruthy();
            });
        });
    });
});
