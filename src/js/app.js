/* eslint-disable no-param-reassign */
import imageAPI from './api/image.api';
import weatherAPI from './api/weather.api';
import mapboxAPI from './api/mapbox.api';
import GeolocationAPI from './api/geolocation.api';
import ru from './translate/ru.json';
import en from './translate/en.json';
import be from './translate/be.json';

const lang = {
  ru,
  en,
  be,
};

export default {
  lang: 'en',
  lat: 0,
  lon: 0,
  cityName: '',
  currentWeather: {
    date: new Date(),
    tempC: 0,
    tempF: 0,
    wind: 0,
    humidity: 0,
    text: '',
    icon: '',
  },
  weather: [],
  map: {
    lat: '',
    lon: '',
  },
  async changeBGImage() {
    const url = await imageAPI.getLinkToImage();
    document.body.style.backgroundImage = `url(${url})`;
  },
  setLang(language) {
    this.lang = language;
    this.updateLang();
  },
  updateLang() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const data = lang[this.lang][element.dataset.i18n];
      if (element.dataset.i18n === 'placeholder') {
        element.placeholder = data;
      } else if (element.dataset.i18n.includes('day')) {
        let day = this.currentWeather.date.getDay();
        if (element.dataset.day) {
          day += +element.dataset.day;
        }
        day %= 7;
        element.textContent = data[day];
      } else if (element.dataset.i18n === 'month') {
        const month = this.currentWeather.date.getMonth();
        element.textContent = data[month];
      } else {
        element.textContent = data;
      }
    });
  },
  setUnitOfTemp(unit) {
    console.log(unit);
  },
  async setCity(city) {
    const dataWeather = await weatherAPI.get(city, this.lang);
    const geoInfo = await GeolocationAPI.getInfoByCity(city, this.lang);
    this.lat = dataWeather.location.lat;
    this.lon = dataWeather.location.lon;
    this.cityName = geoInfo.results[0].formatted;
    this.map.lat = geoInfo.results[0].annotations.DMS.lat;
    this.map.lon = geoInfo.results[0].annotations.DMS.lng;
    mapboxAPI.setMarker(this.lon, this.lat);

    console.log(geoInfo);
    console.log(dataWeather);
    this.updateWeatherInfo();
  },
  updateWeatherInfo() {
    console.log('');
  },
};
