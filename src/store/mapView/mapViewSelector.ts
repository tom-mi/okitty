import {State} from "../rootReducer";
import {TrackGroup} from "../modelTypes";


export const getMapViewTrackGroups = (state: State) : Array<TrackGroup> => state.mapView.trackGroups;
