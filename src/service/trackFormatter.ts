import {RenderStyle, TrackGroup} from "../store/modelTypes";
import VectorSource from "ol/source/Vector";
import {getLocationUrl} from "./otRecorderClient";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import GeoJSON from "ol/format/GeoJSON";
import Heatmap from "ol/layer/Heatmap";
import {COLOR_GRADIENT} from "./colorService";
import {Circle} from "ol/style";
import Fill from "ol/style/Fill";


function trackLayersFromTrackGroup(trackGroup: TrackGroup): Array<VectorLayer> {
    return trackGroup.tracks
        .filter(track => track.active)
        .map(track => {
            return new VectorLayer({
                source: new VectorSource({
                    url: getLocationUrl(track.device, 'linestring', trackGroup.from, trackGroup.to),
                    format: new GeoJSON(),
                }),
                style: () => new Style({
                    stroke: new Stroke({
                        color: track.color,
                        width: 5,
                    }),
                }),
            })
        });
}

function pointLayersFromTrackGroup(trackGroup: TrackGroup): Array<VectorLayer> {
    return trackGroup.tracks
        .filter(track => track.active)
        .map(track => {
            return new VectorLayer({
                source: new VectorSource({
                    url: getLocationUrl(track.device, 'geojson', trackGroup.from, trackGroup.to),
                    format: new GeoJSON(),
                }),
                style: () => new Style({
                    image: new Circle({
                        radius: 4,
                        fill: new Fill({color: track.color}),
                        stroke: new Stroke({width: 1, color: '#FFFFFF'}),
                    }),
                }),
            })
        });
}

function heatmapLayerFromTrackGroup(trackGroup: TrackGroup): Array<VectorLayer> {
    return trackGroup.tracks
        .filter(track => track.active)
        .map(track => {
            return new Heatmap({
                source: new VectorSource({
                    url: getLocationUrl(track.device, 'geojson', trackGroup.from, trackGroup.to),
                    format: new GeoJSON(),
                }),
                opacity: 0.8,
                gradient: COLOR_GRADIENT,
            })
        });
}

export function layersFromTrackGroup(trackGroup: TrackGroup): Array<VectorLayer> {
    switch (trackGroup.renderStyle) {
        case RenderStyle.TRACK:
            return trackLayersFromTrackGroup(trackGroup);
        case RenderStyle.POINTS:
            return pointLayersFromTrackGroup(trackGroup);
        case RenderStyle.HEATMAP:
            return heatmapLayerFromTrackGroup(trackGroup);
    }
}

