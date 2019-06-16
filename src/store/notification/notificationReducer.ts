import {ActionTypes} from "../actionTypes";
import {NotificationMessage} from "./notificationTypes";
import {NOTIFICATION_PUSH, NOTIFICATION_REMOVE} from "./notificationActionTypes";

export interface NotificationState {
    notifications: Array<NotificationMessage>

}

const initialState: NotificationState = {
    notifications: [],
};

export function notificationReducer(
    state = initialState,
    action: ActionTypes,
): NotificationState {
    switch (action.type) {
        case NOTIFICATION_PUSH:
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case NOTIFICATION_REMOVE:
            return {
                ...state,
                notifications: state.notifications.filter(n => n.key !== action.payload.key),
            };
    }
    return state
}
