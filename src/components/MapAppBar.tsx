import React, {Component} from 'react';
import {AppBar} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import LayersIcon from "@material-ui/icons/Layers";
import Typography from "@material-ui/core/Typography";
import {ActionTypes} from "../store/actionTypes";
import {State} from "../store/rootReducer";
import {ThunkDispatch} from "redux-thunk";
import {connect} from "react-redux";
import {setControlsVisible, setMapLayer} from "../store/actions";
import {getMapViewControlsVisible, getMapViewMapLayer} from "../store/mapView/mapViewSelector";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {AllMapLayers, MapLayer} from "../store/modelTypes";

interface MapAppBarMappedProps {
    mapLayer: MapLayer,
    controlsVisible: boolean,
}

interface MapAppBarDispatchProps {
    setControlsVisible: (setControlsVisible: boolean) => any,
    setMapLayer: (mapLayer: MapLayer) => any,
}

type  MapAppBarProps = MapAppBarMappedProps & MapAppBarDispatchProps

interface MapAppBarState {
    layersMenuAnchorsElement: HTMLElement | null
}

const MAP_LAYER_NAMES = {
    [MapLayer.OSM]: 'OSM',
    [MapLayer.DARK_MATTER]: 'Dark Matter',
    [MapLayer.OPEN_TOPO_MAP]: 'OpenTopoMap',
};

class MapAppBar extends Component<MapAppBarProps, MapAppBarState> {


    constructor(props: Readonly<MapAppBarMappedProps & MapAppBarDispatchProps>) {
        super(props);
        this.state = {layersMenuAnchorsElement: null};
    }

    handleToggleExpand = () => {
        this.props.setControlsVisible(!this.props.controlsVisible);
    };

    handleOpenLayersMenu = (event: any) => {
        this.setState({layersMenuAnchorsElement: event.currentTarget});
    };

    handleCloseLayersMenu = (mapLayer?: MapLayer) => () => {
        if (mapLayer) {
            this.props.setMapLayer(mapLayer);
        }
        this.setState({layersMenuAnchorsElement: null});
    };

    render() {
        return <AppBar position="relative">
            <Toolbar>
                <Typography variant="h5">
                    <span role="img" aria-label="Cat Emoji">🐱</span>
                    &nbsp;
                    okitty
                </Typography>
                <div style={{flexGrow: 1}}/>
                <IconButton edge="start" color="inherit" onClick={this.handleToggleExpand}>
                    {this.props.controlsVisible ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                </IconButton>
                <IconButton edge="end" color="inherit" onClick={this.handleOpenLayersMenu}>
                    <LayersIcon/>
                </IconButton>
            </Toolbar>
            <Menu
                id="menu-appbar"
                anchorEl={this.state.layersMenuAnchorsElement}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={!!this.state.layersMenuAnchorsElement}
                onClose={this.handleCloseLayersMenu()}
            >
                {AllMapLayers.map(mapLayer =>
                    <MenuItem key={mapLayer}
                              onClick={this.handleCloseLayersMenu(mapLayer)}
                              selected={mapLayer === this.props.mapLayer}>
                        {MAP_LAYER_NAMES[mapLayer] || mapLayer}
                    </MenuItem>
                )}
            </Menu>
        </AppBar>
    }
}

export default connect((state: State): MapAppBarMappedProps => ({
    mapLayer: getMapViewMapLayer(state),
    controlsVisible: getMapViewControlsVisible(state),
}), (dispatch: ThunkDispatch<State, void, ActionTypes>): MapAppBarDispatchProps => ({
    setControlsVisible: (controlsVisible: boolean) => dispatch(setControlsVisible(controlsVisible)),
    setMapLayer: (mapLayer: MapLayer) => dispatch(setMapLayer(mapLayer)),
}))(MapAppBar)
