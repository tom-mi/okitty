import {NotificationMessage} from "./notificationTypes";

export const NOTIFICATION_PUSH = 'NOTIFICATION_PUSH';
export const NOTIFICATION_REMOVE = 'NOTIFICATION_REMOVE';

export interface PushNotificationAction {
    type: typeof NOTIFICATION_PUSH
    payload: NotificationMessage
}

export interface RemoveNotificationAction {
    type: typeof NOTIFICATION_REMOVE
    payload: { key: string }
}

export type NotificationActionTypes = PushNotificationAction | RemoveNotificationAction