import { GEO_API, OPEN_CAGE_DATA_API } from '../config';

export default {
  info: {},
  async get() {
    const res = await fetch(`https://ipinfo.io/json?token=${GEO_API}`);
    this.info = await res.json();
  },
  async getInfoByCity(city, lang) {
    const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&language=${lang}&key=${OPEN_CAGE_DATA_API}`);
    const data = await res.json();
    return data;
  },
};
