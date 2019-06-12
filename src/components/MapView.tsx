import React, {Component} from 'react';
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Map from "ol/Map";
import View from "ol/View";
import {defaults as defaultControls} from 'ol/control';
import 'ol/ol.css';
import './MapComponent.css';
import Geolocation from "ol/Geolocation";
import Control from "ol/control/Control";
import {fromLonLat} from "ol/proj";
import {getMapViewTrackLayers} from "../store/mapView/mapViewSelector";
import {TrackLayer} from "../store/modelTypes";
import {connect} from "react-redux";
import {State} from "../store/rootReducer";
import Layer from "ol/layer/Layer";
import LayerGroup from "ol/layer/Group";
import {layerFromTrackFilter} from "../service/trackFormatter";
import * as extent from 'ol/extent';
import {Extent} from "ol/extent";
import VectorLayer from "ol/layer/Vector";


interface MapMappedProps {
    trackLayers: Array<TrackLayer>
}

type  MapProps = MapMappedProps

interface MapState {
    map: Map
    trackLayers: Array<VectorLayer>
    geolocation: Geolocation
}

class CustomControls extends Control {

    constructor(onClick: (() => void)) {

        const button = document.createElement('button');
        button.innerHTML = 'N';
        const element = document.createElement('div');
        element.className = 'ol-control MapComponent-custom-controls';
        element.appendChild(button);

        super({
            element: element,
        });

        element.addEventListener('click', onClick);
    }
}

class MapView extends Component<MapProps, MapState> {
    private mapRef = React.createRef<HTMLDivElement>();
    private tileLayer = new TileLayer({source: new OSM()});

    componentDidMount(): void {
        const geolocation = new Geolocation({
            tracking: true,
        });
        const map = new Map({
            target: this.mapRef.current!,
            controls: defaultControls().extend([
                new CustomControls(this.jumpToCurrentLocation),
            ]),
            layers: [
                this.tileLayer,
            ],
            view: new View({
                center: [0, 0],
                zoom: 4
            }),
        });

        this.setState({
            map: map,
            geolocation: geolocation,
            trackLayers: [],
        });
    }

    componentWillReceiveProps(nextProps: Readonly<MapProps>, nextContext: any): void {
        const layers: Array<Layer> = [this.tileLayer];
        const trackLayers: Array<VectorLayer> = [];

        nextProps.trackLayers.forEach(trackLayer => {
            trackLayer.tracks.forEach(track => {
                const layer = layerFromTrackFilter(trackLayer, track);
                layer.on('change', this.zoomToCurrentTracks);
                trackLayers.push(layer);
            })
        });

        layers.push(...trackLayers);
        this.state.map.setLayerGroup(new LayerGroup({layers: layers}));
        // this.state.map.getLayerGroup().on('change', this.zoomToCurrentTracks);
        this.setState({trackLayers: trackLayers});
    };

    zoomToCurrentTracks = () => {
        let trackExtent: Extent = extent.createEmpty();
        this.state.trackLayers.forEach(layer => {
            if (layer.getSource().getExtent()) {
                trackExtent = extent.extend(trackExtent, layer.getSource().getExtent());
            }
        });
        if (!extent.isEmpty(trackExtent)) {
            this.state.map.getView().fit(trackExtent);
        }
    };

    jumpToCurrentLocation = () => {
        const currentPosition = this.state.geolocation.getPosition();
        if (currentPosition) {
            this.state.map.getView().animate({
                center: fromLonLat(currentPosition),
                zoom: 12,
                duration: 2000,
            });
        }
    };

    render() {
        this.state && this.state.map.updateSize();
        return (
            <div className="MapComponent" id="map" ref={this.mapRef}/>
        );
    }
}


export default connect((state: State): MapProps => ({
    trackLayers: getMapViewTrackLayers(state),
}))(MapView)
