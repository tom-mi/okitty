import {Device} from "../store/modelTypes";
import moment from 'moment';

const TIMESTAMP_FILENAME_FORMAT = 'YYYY-MM-DDTHH-mm-ss';
const FILENAME_SANITIZER = RegExp('\\W', 'g');

function sanitize(value: string): string {
    return value.replace(FILENAME_SANITIZER, '_');
}

export const getTrackFilename = (device: Device, from: string, to: string, extension: string): string => {
    const fromFormatted = moment.utc(from).format(TIMESTAMP_FILENAME_FORMAT);
    const toFormatted = moment.utc(to).format(TIMESTAMP_FILENAME_FORMAT);

    return `${sanitize(device.user)}_${sanitize(device.device)}_${fromFormatted}_${toFormatted}.${extension}`;
};