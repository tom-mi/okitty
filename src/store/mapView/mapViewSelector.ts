import {State} from "../rootReducer";
import {TrackLayer} from "../modelTypes";


export const getMapViewTrackLayers = (state: State) : Array<TrackLayer> => state.mapView.trackLayers
