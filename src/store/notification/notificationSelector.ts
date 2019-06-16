import {State} from "../rootReducer";
import {NotificationMessage} from "./notificationTypes";

export const getNotifications = (state: State): Array<NotificationMessage> => state.notifications.notifications;