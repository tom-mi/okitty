import {RenderStyle, Track, TrackGroup} from "../store/modelTypes";
import VectorSource from "ol/source/Vector";
import {getLocationUrl} from "./otRecorderClient";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import GeoJSON from "ol/format/GeoJSON";
import Heatmap from "ol/layer/Heatmap";
import {COLOR_GRADIENT, PRIMARY_COLOR, SECONDARY_COLOR, SECONDARY_COLOR_OPAQUE} from "./colorService";
import {Circle} from "ol/style";
import Fill from "ol/style/Fill";


export type LayerByRenderStyle = {
    [key in RenderStyle]: VectorLayer
}

function trackLayersFromTrack(trackGroup: TrackGroup, track: Track): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            url: getLocationUrl(track.device, 'linestring', trackGroup.from, trackGroup.to),
            format: new GeoJSON(),
        }),
    });
}

function pointLayersFromTrack(trackGroup: TrackGroup, track: Track): VectorLayer {
    return new VectorLayer({
        source: new VectorSource({
            url: getLocationUrl(track.device, 'geojson', trackGroup.from, trackGroup.to),
            format: new GeoJSON(),
        }),
    });
}

export function getTrackColor(track: Track): string {
    if (track.selected) {
        return PRIMARY_COLOR;
    } else if (track.highlighted) {
        return SECONDARY_COLOR;
    } else {
        return SECONDARY_COLOR_OPAQUE;
    }
}

export function trackLayerZIndex(track: Track): number {
    if (track.highlighted) {
        return 3;
    } else if (track.selected) {
        return 2;
    } else {
        return 1;
    }
}

export function trackLayerStyle(track: Track): Style {
    return new Style({
        stroke: new Stroke({
            color: getTrackColor(track),
            width: 5,
        }),
    });
}

export function pointLayerStyle(track: Track): Style {
    return new Style({
        image: new Circle({
            radius: 4,
            fill: new Fill({color: getTrackColor(track)}),
            stroke: new Stroke({width: 1, color: '#FFFFFF'}),
        }),
    })
}

function heatmapLayerFromTrack(trackGroup: TrackGroup, track: Track): VectorLayer {
    return new Heatmap({
        source: new VectorSource({
            url: getLocationUrl(track.device, 'geojson', trackGroup.from, trackGroup.to),
            format: new GeoJSON(),
        }),
        gradient: COLOR_GRADIENT,
    });
}

export function layersFromTrackGroup(trackGroup: TrackGroup): Array<LayerByRenderStyle> {
    return trackGroup.tracks.map(track => ({
        [RenderStyle.TRACK]: trackLayersFromTrack(trackGroup, track),
        [RenderStyle.POINTS]: pointLayersFromTrack(trackGroup, track),
        [RenderStyle.HEATMAP]: heatmapLayerFromTrack(trackGroup, track),
    }));
}

