// Note: all colors are picked to match the custom theme colors set in theme.ts
export const PRIMARY_COLOR = '#3f51b5'; // todo
export const SECONDARY_COLOR = '#ff9100';

const COLORS = [
    '#d37fc1',
    '#ffa1c8',
    '#ff8e9d',
];

// https://learnui.design/tools/data-color-picker.html#divergent
export const COLOR_GRADIENT = [
    '#3f51b5',
    '#9864bc',
    '#d37fc1',
    '#ffa1c8',
    '#ff8e9d',
    '#ff8761',
    '#ff9100',
];

export const getIndexedColor = (index: number): string => {
    return COLORS[index % COLORS.length];
};