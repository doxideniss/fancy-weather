import { WEATHER_API } from './config';

export default {
  async get(city, lang) {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${city}&days=4&lang=${lang}`);
    const data = await res.json();
    return data;
  },
};
