import React, {Component} from 'react';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import OlMap from "ol/Map";
import View from "ol/View";
import {defaults as defaultControls} from 'ol/control';
import 'ol/ol.css';
import './MapComponent.css';
import Geolocation from "ol/Geolocation";
import {getMapViewTrackGroups} from "../store/mapView/mapViewSelector";
import {AllRenderStyles, deviceEquals, RenderStyle, TrackGroup} from "../store/modelTypes";
import {connect} from "react-redux";
import {State} from "../store/rootReducer";
import Layer from "ol/layer/Layer";
import LayerGroup from "ol/layer/Group";
import {
    LayerByRenderStyle,
    layersFromTrackGroup,
    pointLayerStyle,
    trackLayerStyle,
    trackLayerZIndex
} from "../service/trackFormatter";
import * as extent from 'ol/extent';
import {Extent} from 'ol/extent';
import SimpleMapControl from "./SimpleMapControl";


interface MapMappedProps {
    trackGroups: Array<TrackGroup>
}

type  MapProps = MapMappedProps

interface MapState {
    map: OlMap
    controls: {
        zoomToTracks: SimpleMapControl,
    }
    trackLayers: Array<Array<LayerByRenderStyle>>
    geolocation: Geolocation
    zoomSynchronized: boolean,
}


class MapView extends Component<MapProps, MapState> {
    private mapRef = React.createRef<HTMLDivElement>();
    private tileLayer = new TileLayer({source: new OSM()});

    componentDidMount(): void {
        const geolocation = new Geolocation({
            tracking: true,
        });
        const zoomToTracksControl = new SimpleMapControl('⛶', [0, 3], this.zoomToCurrentTracksAndSynchronizeZoom);
        const map = new OlMap({
            target: this.mapRef.current!,
            controls: defaultControls().extend([
                zoomToTracksControl,
            ]),
            layers: [
                this.tileLayer,
            ],
            view: new View({
                center: [0, 0],
                zoom: 4
            }),
        });

        map.on('pointerdrag', this.disableZoomSynchronization);  // TODO find a way to detect manual zoom also

        this.setState({
            map: map,
            geolocation: geolocation,
            trackLayers: [],
            controls: {
                zoomToTracks: zoomToTracksControl,
            },
            zoomSynchronized: true,
        });
    }

    hasTrackDataChanged(nextProps: Readonly<MapProps>): boolean {
        if (this.props.trackGroups.length !== nextProps.trackGroups.length) {
            return true;
        }
        let changed = false;

        this.props.trackGroups.forEach((trackGroup, trackGroupIndex) => {
            const newTrackGroup = nextProps.trackGroups[trackGroupIndex];
            if (trackGroup.from !== newTrackGroup.from || trackGroup.to !== newTrackGroup.to) {
                changed = true;
            }
            if (trackGroup.tracks.length !== newTrackGroup.tracks.length) {
                changed = true;
            }
            trackGroup.tracks.forEach((track, trackIndex) => {
                if (!deviceEquals(track.device, newTrackGroup.tracks[trackIndex].device)) {
                    changed = true;
                }
            });
        });
        return changed;
    }

    componentWillReceiveProps(nextProps: Readonly<MapProps>, nextContext: any): void {
        if (this.hasTrackDataChanged(nextProps)) {
            const layers: Array<Layer> = [this.tileLayer];
            const trackGroupLayers: Array<Array<LayerByRenderStyle>> =
                nextProps.trackGroups.map(trackGroup => layersFromTrackGroup(trackGroup));
            layers.push(...trackGroupLayers.flat().map(tl => Object.values(tl)).flat());
            trackGroupLayers.forEach(tgl => tgl.forEach(tl => Object.values(tl).forEach(l => {
                l.on('change', this.zoomToCurrentTracksIfSynchronized)
            })));

            this.state.map.setLayerGroup(new LayerGroup({layers: layers}));
            this.setState({trackLayers: trackGroupLayers});
        }
    }

    setVisibilityAndStyleOfTrackLayers() {
        this.props.trackGroups.forEach((trackGroup, trackGroupIndex) => {
            trackGroup.tracks.forEach((track, trackIndex) => {
                AllRenderStyles.forEach(renderStyle => {
                    const layer = this.state.trackLayers[trackGroupIndex][trackIndex][renderStyle];
                    if (renderStyle === RenderStyle.HEATMAP) {
                        layer.setVisible(renderStyle === trackGroup.renderStyle && track.selected);
                    } else {
                        layer.setVisible(renderStyle === trackGroup.renderStyle && (track.active || track.selected || track.highlighted));
                        layer.setZIndex(trackLayerZIndex(track));
                        if (renderStyle === RenderStyle.TRACK) {
                            layer.setStyle(trackLayerStyle(track));
                        } else if (renderStyle === RenderStyle.POINTS) {
                            layer.setStyle(pointLayerStyle(track));
                        }
                    }
                });
            });
        });
    }



    disableZoomSynchronization = () => {
        this.setState({
            zoomSynchronized: false,
        });
    };

    zoomToCurrentTracksAndSynchronizeZoom = () => {
        this.setState({
            zoomSynchronized: true,
        }, () => {
            this.zoomToCurrentTracksIfSynchronized();
        })
    };

    zoomToCurrentTracksIfSynchronized = () => {
        if (!this.state || !this.state.zoomSynchronized) {
            return;
        }
        let trackExtent: Extent = extent.createEmpty();
        this.props.trackGroups.forEach((trackGroup, trackGroupIndex) => {
            trackGroup.tracks.forEach((track, trackIndex) => {
                if (track.active || track.selected) {
                    trackExtent = extent.extend(trackExtent,
                        this.state.trackLayers[trackGroupIndex][trackIndex][trackGroup.renderStyle].getSource().getExtent());
                }
            });
        });
        if (!extent.isEmpty(trackExtent)) {
            this.state.map.getView().fit(trackExtent, {maxZoom: 18});
        }
    };

    render() {
        this.state && this.state.map.updateSize();
        this.state && this.state.controls.zoomToTracks.setVisibility(!this.state.zoomSynchronized);
        this.zoomToCurrentTracksIfSynchronized();
        this.setVisibilityAndStyleOfTrackLayers();
        return (
            <div className="MapComponent" id="map" ref={this.mapRef}/>
        );
    }
}


export default connect((state: State): MapProps => ({
    trackGroups: getMapViewTrackGroups(state),
}))(MapView)
