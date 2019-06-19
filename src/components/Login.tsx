import React, {Component} from 'react';
import 'ol/ol.css';
import './MapComponent.css';
import {State} from "../store/rootReducer";
import './TrackFilterView.css';
import {AuthorizationType} from "../store/app/appTypes";
import BasicAuthLogin from "./BasicAuthLogin";
import {getAuthorizationType} from "../store/app/appSelector";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import {CONFIG_URL} from "../store/app/appActions";
import {connect} from "react-redux";

interface LoginMappedProps {
    authorizationType: AuthorizationType
}

type  LoginProps = LoginMappedProps

class LoginView extends Component<LoginProps> {

    render() {
        if (this.props.authorizationType === AuthorizationType.NONE) {
            return ''
        } else if (this.props.authorizationType === AuthorizationType.BASIC_AUTH) {
            return <BasicAuthLogin/>;
        } else {
            return <Dialog open={true}>
                <DialogTitle>Configuration Error</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Unknown authorization type. Check <a href={CONFIG_URL}>config.json</a>.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        }
    }
}

export default connect((state: State): LoginMappedProps => ({
        authorizationType: getAuthorizationType(state),
    })
)(LoginView);