import React, {ChangeEvent, Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {Box} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import './TrackFilterView.css';


interface DateRangePickerProps {
    fromDate: string,
    toDate: string,
    onChange: (fromDate: string, toDate: string) => void,
}

interface DateRangePickerState {
    fromDate: string,
    toDate: string,
}

export default class DateRangePicker extends Component<DateRangePickerProps, DateRangePickerState> {

    constructor(props: Readonly<DateRangePickerProps>) {
        super(props);
        this.state = {
            fromDate: props.fromDate,
            toDate: props.toDate,
        };
    }

    componentWillReceiveProps(nextProps: Readonly<DateRangePickerProps>, nextContext: any): void {
        this.setState({
            fromDate: nextProps.fromDate,
            toDate: nextProps.toDate,
        })
    }

    handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            fromDate: event.target.value,
        }, () => this.props.onChange(this.state.fromDate, this.state.toDate));
    };

    handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            toDate: event.target.value,
        }, () => this.props.onChange(this.state.fromDate, this.state.toDate));
    };

    render() {
        return <Box>
            <TextField
                id="date"
                className="TrackFilterView-datepicker"
                label="From"
                type="date"
                onChange={this.handleFromChange}
                defaultValue={this.state.fromDate}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            < TextField
                id="date"
                className="TrackFilterView-datepicker"
                label="To"
                type="date"
                onChange={this.handleToChange}
                defaultValue={this.state.toDate}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Box>;
    }
}
