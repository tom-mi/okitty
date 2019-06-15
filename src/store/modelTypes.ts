export interface Device {
    user: string
    device: string
}

export function deviceEquals(a: Device, b: Device): boolean { return a.user === b.user && a.device === b.device }

export interface Track {
    active: boolean
    selected: boolean
    highlighted: boolean
    device: Device
    color: string
}

export enum RenderStyle {
    TRACK = 'TRACK',
    POINTS = 'POINTS',
    HEATMAP = 'HEATMAP',
}

export const AllRenderStyles = [RenderStyle.TRACK, RenderStyle.POINTS, RenderStyle.HEATMAP];

export interface TrackGroup {
    renderStyle: RenderStyle,
    fromDate: string,
    toDate: string,
    from: string,
    to: string,
    tracks: Array<Track>
}
