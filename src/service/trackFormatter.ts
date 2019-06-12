import {Track, TrackGroup} from "../store/modelTypes";
import VectorSource from "ol/source/Vector";
import {getLocationUrl} from "./otRecorderClient";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import GeoJSON from "ol/format/GeoJSON";


export function layerFromTrackFilter(trackLayer: TrackGroup, track: Track): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            url: getLocationUrl(track.device, 'linestring', trackLayer.from, trackLayer.to),
            format: new GeoJSON(),
        }),
        style: () => new Style({
            stroke: new Stroke({
                color: '#0000FF',
                width: 5,
            }),
        }),
    })
}

