const COLORS = [
    '#003f5c',
    '#2f4b7c',
    '#665191',
    '#a05195',
    '#d45087',
    '#f95d6a',
    '#ff7c43',
    '#ffa600',
];

export const COLOR_GRADIENT = [
    // see http://tristen.ca/hcl-picker/#/hlc/8/1.04/1E2A38/E7FA6D
    '#1E2A38',
    '#204654',
    '#1A656B',
    '#1E8579',
    '#3DA57F',
    '#6BC47C',
    '#A4E074',
    '#E7FA6D',
];

export const getIndexedColor = (index: number): string => {
    return COLORS[index % COLORS.length];
};