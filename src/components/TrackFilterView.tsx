import React, {Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {RenderStyle, TrackGroup} from "../store/modelTypes";
import {Box} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {getMapViewTrackGroups} from "../store/mapView/mapViewSelector";
import {State} from "../store/rootReducer";
import {connect} from "react-redux";
import './TrackFilterView.css';
import {ActionTypes} from "../store/actionTypes";
import {ThunkDispatch} from "redux-thunk";
import {setRenderStyle, setTrackActive, updateDateRange} from "../store/actions";
import DateRangePicker from "./DateRangePicker";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import RenderStyleSelector from "./RenderStyleSelector";


interface TrackFilterMappedProps {
    trackLayers: Array<TrackGroup>
}

interface TrackFilterDispatchProps {
    updateDateRange: (index: number, fromDate: string, toDate: string) => any,
    setTrackActive: (trackGroupIndex: number, trackIndex: number, active: boolean) => any,
    setRenderStyle: (trackGroupIndex: number, renderStyle: RenderStyle) => any,
}

type  TrackFilterProps = TrackFilterMappedProps & TrackFilterDispatchProps

class TrackFilterView extends Component<TrackFilterProps> {

    handleDateRangeChange = (index: number) => (fromDate: string, toDate: string) => {
        this.props.updateDateRange(index, fromDate, toDate);
    };

    handleToggleTrack = (trackGroupIndex: number, trackIndex: number) => () => {
        const isActive = this.props.trackLayers[trackGroupIndex].tracks[trackIndex].active;
        this.props.setTrackActive(trackGroupIndex, trackIndex, !isActive);
    };

    handleRenderStyleChange = (trackGroupIndex: number) => (renderStyle: RenderStyle) => {
        this.props.setRenderStyle(trackGroupIndex, renderStyle);
    };

    render() {
        return this.props.trackLayers.map((trackGroup, trackGroupIndex) =>
            <Box key={trackGroupIndex}>
                <div>Track group {trackGroupIndex}</div>
                <DateRangePicker
                    fromDate={trackGroup.fromDate}
                    toDate={trackGroup.toDate}
                    onChange={this.handleDateRangeChange(trackGroupIndex)}
                />
                <RenderStyleSelector renderStyle={trackGroup.renderStyle} onChange={this.handleRenderStyleChange(trackGroupIndex)}/>
                <List component="nav">
                    {trackGroup.tracks.map((track, trackIndex) =>
                        <ListItem key={trackIndex} button onClick={this.handleToggleTrack(trackGroupIndex, trackIndex)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={track.active}
                                    disableRipple
                                    onChange={this.handleToggleTrack(trackGroupIndex, trackIndex)}
                                />
                            </ListItemIcon>
                            <div className="TrackFilterView-colorindicator" style={{backgroundColor: track.color}} />
                            <ListItemText primary={`${track.device.user} / ${track.device.device}`}/>
                        </ListItem>)
                    }
                </List>
            </Box>
        );
    }
}

export default connect((state: State): TrackFilterMappedProps => ({
    trackLayers: getMapViewTrackGroups(state),
}), (dispatch: ThunkDispatch<State, void, ActionTypes>): TrackFilterDispatchProps => ({
    updateDateRange: (index: number, fromDate: string, toDate: string) => dispatch(updateDateRange(index, fromDate, toDate)),
    setTrackActive: (trackGroupIndex: number, trackIndex: number, active: boolean) => dispatch(setTrackActive(trackGroupIndex, trackIndex, active)),
    setRenderStyle: (trackGroupIndex: number, renderStyle: RenderStyle) => dispatch(setRenderStyle(trackGroupIndex, renderStyle)),
}))(TrackFilterView)