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
    fromDate: string
    toDate: string
    fromError: boolean
    toError: boolean
}

export default class DateRangePicker extends Component<DateRangePickerProps, DateRangePickerState> {

    constructor(props: Readonly<DateRangePickerProps>) {
        super(props);
        this.state = {
            fromDate: props.fromDate,
            toDate: props.toDate,
            fromError: false,
            toError: false,
        };
    }

    componentWillReceiveProps(nextProps: Readonly<DateRangePickerProps>, nextContext: any): void {
        this.setState({
            fromDate: nextProps.fromDate,
            toDate: nextProps.toDate,
        })
    }

    handleDateRangeChange() {
        let fromError = false;
        let toError = false;

        if (this.state.fromDate.length === 0) {
            fromError = true;
        }
        if (this.state.toDate.length === 0) {
            toError = true;
        }
        if (this.state.fromDate.length > 0 && this.state.fromDate.length > 0 && this.state.fromDate > this.state.toDate) {
            fromError = toError = true;
        }

        this.setState({
            fromError: fromError,
            toError: toError,
        }, () => {
            if (!fromError && !toError) {
                this.props.onChange(this.state.fromDate, this.state.toDate);
            }
        });
    }

    handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            fromDate: event.target.value,
        }, this.handleDateRangeChange);
    };

    handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            toDate: event.target.value,
        }, this.handleDateRangeChange);
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
                error={this.state.fromError}
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
                error={this.state.toError}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Box>;
    }
}
