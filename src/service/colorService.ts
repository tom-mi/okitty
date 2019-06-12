
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

export const getIndexedColor = (index: number): string => {
    return COLORS[index % COLORS.length];
};