import React, {Component} from 'react';
import MapView from "./MapView";
import './MainView.css'
import TrackFilterView from "./TrackFilterView";
import MapAppBar from "./MapAppBar";

interface MainViewProps {
}

export default class MainView extends Component<MainViewProps> {

    render() {
        return (
            <div className="MainView">
                <div className="MainView-app-bar">
                    <MapAppBar/>
                </div>
                <div className="MainView-track-filter">
                    <TrackFilterView/>
                </div>
                <div className="MainView-map">
                    <MapView/>
                </div>
            </div>
        );
    }

}