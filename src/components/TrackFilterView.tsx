import React, {Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {RenderStyle, TrackGroup} from "../store/modelTypes";
import {Box, WithTheme} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {getMapViewTrackGroups} from "../store/mapView/mapViewSelector";
import {State} from "../store/rootReducer";
import {connect} from "react-redux";
import './TrackFilterView.css';
import {ActionTypes} from "../store/actionTypes";
import {ThunkDispatch} from "redux-thunk";
import {highlightTrack, selectTrack, setRenderStyle, setTrackActive, updateDateRange} from "../store/actions";
import DateRangePicker from "./DateRangePicker";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import RenderStyleSelector from "./RenderStyleSelector";
import withTheme from "@material-ui/core/styles/withTheme";
import {getTrackColor} from "../service/trackFormatter";


interface TrackFilterMappedProps {
    trackLayers: Array<TrackGroup>
}

interface TrackFilterDispatchProps {
    highlightTrack: (trackGroupIndex: number, trackIndex: number) => any,
    selectTrack: (trackGroupIndex: number, trackIndex: number) => any,
    setRenderStyle: (trackGroupIndex: number, renderStyle: RenderStyle) => any,
    setTrackActive: (trackGroupIndex: number, trackIndex: number, active: boolean) => any,
    updateDateRange: (index: number, fromDate: string, toDate: string) => any,
}

type  TrackFilterProps = TrackFilterMappedProps & TrackFilterDispatchProps

class TrackFilterView extends Component<TrackFilterProps & WithTheme> {

    handleDateRangeChange = (index: number) => (fromDate: string, toDate: string) => {
        this.props.updateDateRange(index, fromDate, toDate);
    };

    handleToggleTrack = (trackGroupIndex: number, trackIndex: number) => () => {
        const isActive = this.props.trackLayers[trackGroupIndex].tracks[trackIndex].active;
        this.props.setTrackActive(trackGroupIndex, trackIndex, !isActive);
    };

    handleSelectTrack = (trackGroupIndex: number, trackIndex: number) => () => {
        this.props.selectTrack(trackGroupIndex, trackIndex);
    };

    handleHighlightTrack = (trackGroupIndex: number, trackIndex: number) => () => {
        this.props.highlightTrack(trackGroupIndex, trackIndex);
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
                <RenderStyleSelector renderStyle={trackGroup.renderStyle}
                                     onChange={this.handleRenderStyleChange(trackGroupIndex)}/>
                <List component="nav">
                    {trackGroup.tracks.map((track, trackIndex) =>
                        <div key={trackIndex}
                             onMouseEnter={this.handleHighlightTrack(trackGroupIndex, trackIndex)}
                             onMouseLeave={this.handleHighlightTrack(-1, -1)}>
                            <ListItem button
                                      selected={track.selected}
                                      onClick={this.handleSelectTrack(trackGroupIndex, trackIndex)}>
                                {trackGroup.renderStyle === RenderStyle.HEATMAP ? '' : [
                                    <ListItemIcon key="1"
                                                  className="TrackFilterView-checkbox-icon"
                                                  onClick={event => event.stopPropagation()}>
                                        <Checkbox
                                            checked={track.active}
                                            disableRipple
                                            onChange={this.handleToggleTrack(trackGroupIndex, trackIndex)}
                                        />
                                    </ListItemIcon>,
                                    <div key="2"
                                         className="TrackFilterView-colorindicator" style={{
                                        backgroundColor: getTrackColor(track, trackIndex)
                                    }}/>
                                ]}
                                <ListItemText
                                    style={{
                                        color: track.selected ? this.props.theme.palette.primary.dark : 'inherit'
                                    }}
                                    primary={`${track.device.user} / ${track.device.device}`}/>
                            </ListItem>
                        </div>
                    )
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
    highlightTrack: (trackGroupIndex: number, trackIndex: number) => dispatch(highlightTrack(trackGroupIndex, trackIndex)),
    selectTrack: (trackGroupIndex: number, trackIndex: number) => dispatch(selectTrack(trackGroupIndex, trackIndex)),
}))(withTheme(TrackFilterView))