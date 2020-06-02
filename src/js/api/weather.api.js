import { WEATHER_API, NUM_DAY } from '../config';

export default {
  async get(city, lang) {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${city}&days=${NUM_DAY}&lang=${lang}`);
    const data = await res.json();
    return data;
  },
};
