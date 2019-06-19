import {RenderStyle, Track, TrackGroup} from "../store/modelTypes";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import GeoJSON from "ol/format/GeoJSON";
import Heatmap from "ol/layer/Heatmap";
import {COLOR_GRADIENT, PRIMARY_COLOR, SECONDARY_COLOR, SECONDARY_COLOR_OPAQUE} from "./colorService";
import {Circle} from "ol/style";
import Fill from "ol/style/Fill";
import otRecorderClient from "./otRecorderClient";
import Feature from "ol/Feature";
import {Extent} from "ol/extent";
import Projection from "ol/proj/Projection";


export type LayerByRenderStyle = {
    [key in RenderStyle]: VectorLayer
}

function vectorSource(trackGroup: TrackGroup, track: Track, format: string) {
    const source = new VectorSource({
        format: new GeoJSON(),
        loader: ((extent: Extent, resolution: number, projection: Projection) => {
            otRecorderClient.fetchLocation(track.device, format, trackGroup.from, trackGroup.to)
                .then(data => {
                    const features = source.getFormat().readFeatures(data, {
                        extent: extent,
                        featureProjection: projection,
                    }) as Feature[];
                    source.addFeatures(features);
                })
                .catch(err => {
                    console.log('Error loading vector layer', err);
                    source.removeLoadedExtent(extent);
                })
        }),
    });
    return source;
}

function trackLayersFromTrack(trackGroup: TrackGroup, track: Track): VectorLayer {
    return new VectorLayer({
        source: vectorSource(trackGroup, track, 'linestring'),
    });
}

function pointLayersFromTrack(trackGroup: TrackGroup, track: Track): VectorLayer {
    return new VectorLayer({
        source: vectorSource(trackGroup, track, 'geojson'),
    });
}

function heatmapLayerFromTrack(trackGroup: TrackGroup, track: Track): VectorLayer {
    return new Heatmap({
        source: vectorSource(trackGroup, track, 'geojson'),
        gradient: COLOR_GRADIENT,
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

export function layersFromTrackGroup(trackGroup: TrackGroup): Array<LayerByRenderStyle> {
    return trackGroup.tracks.map(track => ({
        [RenderStyle.TRACK]: trackLayersFromTrack(trackGroup, track),
        [RenderStyle.POINTS]: pointLayersFromTrack(trackGroup, track),
        [RenderStyle.HEATMAP]: heatmapLayerFromTrack(trackGroup, track),
    }));
}

