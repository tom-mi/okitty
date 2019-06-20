/* eslint-disable react/prop-types */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withSnackbar, WithSnackbarProps} from 'notistack';
import {NotificationMessage, NotificationType} from "../store/notification/notificationTypes";
import {Button} from "@material-ui/core";
import {State} from "../store/rootReducer";
import {getNotifications} from "../store/notification/notificationSelector";
import {ActionTypes} from "../store/actionTypes";
import {ThunkDispatch} from "redux-thunk";
import {removeNotification} from "../store/notification/notificationActions";


const AUTO_HIDE_DURATION_MS = 5 * 1000;
const AUTO_HIDE_DURATION_MS_ERROR = 15 * 1000;

interface NotifierMappedProps {
    notifications: Array<NotificationMessage>
}

interface NotifierDispatchProps {
    removeNotification: (key: string) => any,
}

type NotifierProps = NotifierMappedProps & NotifierDispatchProps

interface NotifierState {
    displayed: Array<string>
}

function mapNotificationType(message: NotificationMessage) {
    switch (message.type) {
        case NotificationType.ERROR:
            return 'error';
        case NotificationType.WARNING:
            return 'warning';
        case NotificationType.INFO:
            return 'info';
        case NotificationType.SUCCESS:
            return 'success';
    }
}

class Notifier extends Component<NotifierProps & WithSnackbarProps, NotifierState> {

    constructor(props: Readonly<NotifierMappedProps & NotifierDispatchProps & WithSnackbarProps>) {
        super(props);
        this.state = {displayed: []};
    }

    dismissNotificationAction = (key: string) => <Button onClick={() => this.props.closeSnackbar(key)}>Dismiss</Button>;

    componentDidUpdate(prevProps: Readonly<NotifierMappedProps & NotifierDispatchProps>, prevState: Readonly<NotifierState>, snapshot?: any): void {
        this.props.notifications.forEach(notification => {
            if (this.state.displayed.includes(notification.key)) {
                return;
            }
            this.setState(state => ({displayed: [...state.displayed, notification.key]}));
            this.props.enqueueSnackbar(
                notification.text, {
                    key: notification.key,
                    variant: mapNotificationType(notification),
                    action: this.dismissNotificationAction,
                    autoHideDuration: notification.type === NotificationType.ERROR ? AUTO_HIDE_DURATION_MS_ERROR : AUTO_HIDE_DURATION_MS,
                    onClose: () => {
                        this.props.removeNotification(notification.key);
                        this.setState((state) => ({displayed: state.displayed.filter(it => it !== notification.key)}));
                    },
                });
        });
    }

    render() {
        return null;
    }
}

export default connect(
    (state: State): NotifierMappedProps => ({
        notifications: getNotifications(state),
    }),
    (dispatch: ThunkDispatch<State, void, ActionTypes>): NotifierDispatchProps => ({
        removeNotification: (key: string) => dispatch(removeNotification(key)),
    }))(withSnackbar(Notifier));
