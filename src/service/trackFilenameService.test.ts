import {Device} from "../store/modelTypes";
import {getTrackFilename} from "./trackFilenameService";


const DEVICE: Device = {device: 'phone', user: 'tommi'};
const DEVICE_WITH_SPECIAL_CHARS: Device = {device: 'ph0/ne:.', user: 'tömmi'};
const FROM = '2019-06-06T22:00:00.000Z';
const TO = '2019-06-14T21:59:59.999Z';

describe('getTrackFilename', () => {
    [
        {device: DEVICE, from: FROM, to: TO, extension: 'gpx', expected: 'tommi_phone_2019-06-06T22-00-00_2019-06-14T21-59-59.gpx'},
        {device: DEVICE_WITH_SPECIAL_CHARS, from: FROM, to: TO, extension: 'txt', expected: 't_mmi_ph0_ne___2019-06-06T22-00-00_2019-06-14T21-59-59.txt'},
    ]
        .forEach(({device, from, to, extension, expected}) => it(`returns ${expected}`, () => {
            expect(getTrackFilename(device, from, to, extension)).toEqual(expected);
        }));
});