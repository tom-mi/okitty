import React, {Component} from 'react';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Map from "ol/Map";
import View from "ol/View";
import {defaults as defaultControls} from 'ol/control';
import 'ol/ol.css';
import './MapComponent.css';
import Geolocation from "ol/Geolocation";
import {getMapViewTrackGroups} from "../store/mapView/mapViewSelector";
import {TrackGroup} from "../store/modelTypes";
import {connect} from "react-redux";
import {State} from "../store/rootReducer";
import Layer from "ol/layer/Layer";
import LayerGroup from "ol/layer/Group";
import {layerFromTrackFilter} from "../service/trackFormatter";
import * as extent from 'ol/extent';
import {Extent} from "ol/extent";
import VectorLayer from "ol/layer/Vector";
import SimpleMapControl from "./SimpleMapControl";


interface MapMappedProps {
    trackLayers: Array<TrackGroup>
}

type  MapProps = MapMappedProps

interface MapState {
    map: Map
    controls: {
        zoomToTracks: SimpleMapControl,
    }
    trackLayers: Array<VectorLayer>
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
        const map = new Map({
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

    componentWillReceiveProps(nextProps: Readonly<MapProps>, nextContext: any): void {
        const layers: Array<Layer> = [this.tileLayer];
        const trackLayers: Array<VectorLayer> = [];

        nextProps.trackLayers.forEach(trackLayer => {
            trackLayer.tracks
                .filter(track => track.active)
                .forEach(track => {
                const layer = layerFromTrackFilter(trackLayer, track);
                layer.on('change', this.zoomToCurrentTracksIfSynchronized);
                trackLayers.push(layer);
            })
        });

        layers.push(...trackLayers);
        this.state.map.setLayerGroup(new LayerGroup({layers: layers}));
        // this.state.map.getLayerGroup().on('change', this.zoomToCurrentTracks);
        this.setState({trackLayers: trackLayers});
    };

    disableZoomSynchronization = (event: any) => {
        console.log('disable zoom sync', event);
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
        if (!this.state.zoomSynchronized) {
            return;
        }
        let trackExtent: Extent = extent.createEmpty();
        this.state.trackLayers.forEach(layer => {
            if (layer.getSource().getExtent()) {
                trackExtent = extent.extend(trackExtent, layer.getSource().getExtent());
            }
        });
        if (!extent.isEmpty(trackExtent)) {
            this.state.map.getView().fit(trackExtent, {maxZoom: 18});
        }
    };

    render() {
        this.state && this.state.map.updateSize();
        this.state && this.state.controls.zoomToTracks.setVisibility(!this.state.zoomSynchronized);
        return (
            <div className="MapComponent" id="map" ref={this.mapRef}/>
        );
    }
}


export default connect((state: State): MapProps => ({
    trackLayers: getMapViewTrackGroups(state),
}))(MapView)
