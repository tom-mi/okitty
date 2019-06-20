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
    isDownloadingGpx: boolean
}

export enum RenderStyle {
    TRACK = 'TRACK',
    POINTS = 'POINTS',
    HEATMAP = 'HEATMAP',
}

export const AllRenderStyles = [RenderStyle.TRACK, RenderStyle.POINTS, RenderStyle.HEATMAP];

export enum MapLayer {
    OSM = 'OSM',
    DARK_MATTER = 'DARK_MATTER',
    OPEN_TOPO_MAP = 'OPEN_TOPO_MAP',
}

export const AllMapLayers = [ MapLayer.OSM, MapLayer.DARK_MATTER, MapLayer.OPEN_TOPO_MAP ];

export interface TrackGroup {
    renderStyle: RenderStyle,
    fromDate: string,
    toDate: string,
    from: string,
    to: string,
    tracks: Array<Track>
}
