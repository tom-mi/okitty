import {NOTIFICATION_PUSH, NOTIFICATION_REMOVE, NotificationActionTypes} from "./notificationActionTypes";
import {NotificationType} from "./notificationTypes";


export const pushNotification = (type: NotificationType, text: string): NotificationActionTypes => {
    return {
        type: NOTIFICATION_PUSH,
        payload: {
            key: new Date().toISOString(),
            type: type,
            text: text,
        },
    }
};

export const removeNotification = (key: string): NotificationActionTypes => {
    return {
        type: NOTIFICATION_REMOVE,
        payload: {key: key},
    }
};