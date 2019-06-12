import moment from 'moment';


const DATE_FORMAT = 'YYYY-MM-DD';

export const minFrom = (fromDate: string): string => moment(fromDate, DATE_FORMAT).startOf('day').toISOString();
export const maxTo = (toDate: string): string => moment(toDate, DATE_FORMAT).endOf('day').toISOString();

export function clampIsoDatetimeToLocalDateInterval(value: string, fromDate: string, toDate: string): string {
    const fromDateMoment = moment(fromDate, DATE_FORMAT).startOf('day');
    const toDateMoment = moment(toDate, DATE_FORMAT).endOf('day');
    const valueMoment = moment(value);

    return moment.max(fromDateMoment, moment.min(valueMoment, toDateMoment)).toISOString();
}
