import React, {Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {RenderStyle} from "../store/modelTypes";
import Button from "@material-ui/core/Button";
import {Box} from "@material-ui/core";


interface RenderStyleSelectorProps {
    renderStyle: RenderStyle,
    onChange: (renderStyle: RenderStyle) => void,
}


export default class RenderStyleSelector extends Component<RenderStyleSelectorProps> {
    private STYLES: Array<[RenderStyle, string]> = [
        [RenderStyle.TRACK, 'Track'],
        [RenderStyle.POINTS, 'Points'],
        [RenderStyle.HEATMAP, 'Heatmap'],
    ];

    render() {
        return <Box>
            {this.STYLES.map(([renderStyle, label], index) => (
                <Button key={index}
                    color={renderStyle === this.props.renderStyle ? "primary" : "default"}
                    onClick={() => this.props.onChange(renderStyle)}
                >{label}</Button>
            ))}
        </Box>;
    }
}
