import React, {Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {WithTheme} from "@material-ui/core";
import {State} from "../store/rootReducer";
import {connect} from "react-redux";
import './TrackFilterView.css';
import {ActionTypes} from "../store/actionTypes";
import {ThunkDispatch} from "redux-thunk";
import withTheme from "@material-ui/core/styles/withTheme";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {AuthorizationType} from "../store/app/appTypes";
import {loginAndFetchDevices} from "../store/app/appActions";
import {getIsLoggedIn} from "../store/app/appSelector";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

interface BasicAuthLoginState {
    username: string
    password: string
}

interface BasicAuthLoginMappedProps {
    isLoggedIn: boolean
}

interface BasicAuthLoginDispatchProps {
    login: (authorizationType: AuthorizationType, authorizationHeader: string) => void,
}

type  BasicAuthLoginProps = BasicAuthLoginMappedProps & BasicAuthLoginDispatchProps

class BasicAuthLoginView extends Component<BasicAuthLoginProps & WithTheme, BasicAuthLoginState> {

    constructor(props: Readonly<BasicAuthLoginMappedProps & BasicAuthLoginDispatchProps & WithTheme>) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
    }

    handleLoginClick = () => {
        const authHeader = 'Basic ' + btoa(`${this.state.username}:${this.state.password}`);
        this.props.login(AuthorizationType.BASIC_AUTH, authHeader);
    };

    render() {
        return (
            <Dialog open={!this.props.isLoggedIn}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide basic auth credentials for the OwnTracks-Recorder API.
                    </DialogContentText>
                    <TextField label="Username" onChange={event => this.setState({username: event.target.value})}/>
                    <TextField label="Password" onChange={event => this.setState({password: event.target.value})}
                               type="password"/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleLoginClick}>Login</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect((state: State): BasicAuthLoginMappedProps => ({
        isLoggedIn: getIsLoggedIn(state),
    }),
    (dispatch: ThunkDispatch<State, void, ActionTypes>): BasicAuthLoginDispatchProps => ({
        login: (authorizationType: AuthorizationType, authorizationHeader: string) =>
            dispatch(loginAndFetchDevices(authorizationType, authorizationHeader))
    }))(withTheme(BasicAuthLoginView))