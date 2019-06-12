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


interface MapMappedProps {
    trackLayers: Array<TrackLayer>
}

type  MapProps = MapMappedProps

interface MapState {
    map: Map
    geolocation: Geolocation,
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
        console.log('setting map');
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
                zoom: 7
            }),
        });

        this.setState({
            map: map,
            geolocation: geolocation,
        });
    }

    componentWillReceiveProps(nextProps: Readonly<MapProps>, nextContext: any): void {
        console.log('next props', nextProps);
        const layers: Array<Layer> = [this.tileLayer];

        nextProps.trackLayers.forEach(trackLayer => {
            trackLayer.tracks.forEach(track => {
                layers.push(layerFromTrackFilter(trackLayer, track));
            })
        });

        this.state.map.setLayerGroup(new LayerGroup({layers: layers}))
    };

    jumpToCurrentLocation = () => {
        const currentPosition = this.state.geolocation.getPosition();
        console.log('Current position: ', currentPosition);
        if (currentPosition) {
            console.log("Setting position");
            this.state.map.getView().animate({
                center: fromLonLat(currentPosition),
                zoom: 12,
                duration: 2000,
            });
        }
    };

    render() {
        console.log('Rendering map');
        this.state && this.state.map.updateSize();
        return (
            <div className="MapComponent" id="map" ref={this.mapRef}/>
        );
    }
}


export default connect((state: State): MapProps => ({
    trackLayers: getMapViewTrackLayers(state),
}))(MapView)
