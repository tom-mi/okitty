import {MapLayer} from "../store/modelTypes";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

export function createMapLayer(mapLayer: MapLayer): TileLayer {
    switch (mapLayer) {
        case MapLayer.OSM:
            return new TileLayer({source: new OSM()});
        case MapLayer.DARK_MATTER:
            return new TileLayer({
                source: new OSM({
                    url: 'http://{a-c}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                    attributions: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                        '&copy; <a href="https://carto.com/attributions">CARTO</a>'
                })
            });
        case MapLayer.OPEN_TOPO_MAP:
            return new TileLayer({
                source: new OSM({
                    url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
                    attributions: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                        '<a href="http://viewfinderpanoramas.org">SRTM</a> | ' +
                        'map style: © <a href="https://opentopomap.org">OpenTopoMap</a> ' +
                        '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>',
                })
            });
    }

}