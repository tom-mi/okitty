
export enum NotificationType {
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO',
    SUCCESS = 'SUCCESS',
}

export interface NotificationMessage {
    key: string
    type: NotificationType
    text: string
}