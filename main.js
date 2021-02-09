import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZSource from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

//init map
const map = new Map({
  target: 'map-container',
  layers: [
    new TileLayer({
      source: new XYZSource({
        url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg'
      })
    })
  ],
  view: new View({
    center: fromLonLat([23.8, 38]),
    zoom: 11
  })
});

//get GeoJSON from API
//transform projection and add to map
fetch('http://147.102.106.224:8050/bumptracer/potholes')
    .then(response => response.json())
    .then(json => JSON.parse(json)) //bad geojson api, it is twice stringified and requires double parsing
    .then(json => {
        const source = new VectorSource({
            features: new GeoJSON({
                featureProjection: 'EPSG:3857'
            }).readFeatures(json)
        })
        const layer = new VectorLayer({
            source: source
        })
        map.addLayer(layer);
    })
