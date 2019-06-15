import {State} from "../rootReducer";
import {MapLayer, TrackGroup} from "../modelTypes";


export const getMapViewTrackGroups = (state: State): Array<TrackGroup> => state.mapView.trackGroups;
export const getMapViewControlsVisible = (state: State): boolean => state.mapView.controlsVisible;
export const getMapViewMapLayer = (state: State): MapLayer => state.mapView.mapLayer;
