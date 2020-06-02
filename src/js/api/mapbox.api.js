/* eslint-disable no-restricted-properties */
import mapboxgl from 'mapbox-gl';
import geolocation from './geolocation.api';
import { MAPBOX_API } from '../config';

export default {
  map: null,
  async init() {
    mapboxgl.accessToken = MAPBOX_API;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: geolocation.info.loc.split(',').reverse(),
      zoom: 11,
    });
    this.setMarker(...geolocation.info.loc.split(',').reverse());
  },
  setMarker(x, y) {
    new mapboxgl.Marker()
      .setLngLat([x, y])
      .addTo(this.map);
  },
};
