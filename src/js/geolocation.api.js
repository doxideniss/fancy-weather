import { GEO_API } from './config';

export default {
  info: {},
  async get() {
    const res = await fetch(`https://ipinfo.io/json?token=${GEO_API}`);
    this.info = await res.json();
  },
};
