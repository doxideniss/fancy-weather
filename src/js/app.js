/* eslint-disable no-param-reassign */
import imageAPI from './api/image.api';
import weatherAPI from './api/weather.api';
import mapboxAPI from './api/mapbox.api';
import geolocationAPI from './api/geolocation.api';
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
  unitTemp: 'C',
  lat: 0,
  lon: 0,
  city: '',
  cityWithCountry: '',
  currentWeather: {
    dateOffset: null,
    time: '',
    tempC: 0,
    tempF: 0,
    wind: 0,
    humidity: 0,
    text: '',
    icon: '',
  },
  weatherDays: [],
  map: {
    lat: '',
    lon: '',
  },
  timer: null,
  async changeBGImage() {
    const url = await imageAPI.getLinkToImage();
    document.body.style.backgroundImage = `url(${url})`;
  },
  setLang(language) {
    this.lang = language;
    this.updateLang();
  },
  async updateLang() {
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
    const dataWeather = await weatherAPI.get(this.city, this.lang);
    const geoInfo = await geolocationAPI.getInfoByCity(this.city, this.lang);
    this.currentWeather.text = dataWeather.current.condition.text;
    this.cityWithCountry = `${geoInfo.results[0].components.city ? geoInfo.results[0].components.city : geoInfo.results[0].components.state}, ${geoInfo.results[0].components.country}`;
    this.updateWeatherInfo();
  },
  setUnitOfTemp(unit) {
    document.querySelectorAll('[data-temp]').forEach((element) => {
      if (element.dataset.temp === 'current') {
        element.textContent = this.currentWeather[`temp${unit}`];
      } else {
        element.textContent = this.weatherDays[element.dataset.day - 1][`temp${unit}`];
      }
    });
  },
  async setCity(city) {
    const dataWeather = await weatherAPI.get(city, this.lang);
    const geoInfo = await geolocationAPI.getInfoByCity(city, this.lang);
    this.lat = dataWeather.location.lat;
    this.lon = dataWeather.location.lon;

    this.city = city;
    this.cityWithCountry = `${geoInfo.results[0].components.city ? geoInfo.results[0].components.city : geoInfo.results[0].components.state}, ${geoInfo.results[0].components.country}`;
    this.map.lat = geoInfo.results[0].annotations.DMS.lat;
    this.map.lon = geoInfo.results[0].annotations.DMS.lng;

    this.currentWeather.date = new Date(dataWeather.location.localtime);
    this.currentWeather.dateOffset = geoInfo.results[0].annotations.timezone.offset_sec / 3600;
    this.currentWeather.tempC = dataWeather.current.temp_c;
    this.currentWeather.tempF = dataWeather.current.temp_f;
    this.currentWeather.feelC = dataWeather.current.feelslike_c;
    this.currentWeather.feelF = dataWeather.current.feelslike_f;
    this.currentWeather.wind = ((dataWeather.current.wind_kph * 1000) / 3600).toFixed(2);
    this.currentWeather.humidity = dataWeather.current.humidity;
    this.currentWeather.text = dataWeather.current.condition.text;
    this.currentWeather.icon = dataWeather.current.condition.icon;

    this.weatherDays = [];
    dataWeather.forecast.forecastday.forEach(({ day }) => {
      this.weatherDays.push({
        tempC: day.avgtemp_c,
        tempF: day.avgtemp_f,
        icon: day.condition.icon,
      });
    });

    this.updateWeatherInfo();
  },
  updateWeatherInfo() {
    mapboxAPI.setCenter(this.lon, this.lat);

    document.querySelector('[data-day]').innerText = this.currentWeather.date.getDay();

    document.querySelectorAll('[data-info]').forEach((element) => {
      const path = element.dataset.info.split('.');
      let result = { ...this };

      path.forEach((piece) => {
        if (piece.includes('temp') || piece.includes('feel')) {
          result = result[`${piece}${this.unitTemp}`];
        } else {
          result = result[piece];
        }
      });

      if (element.dataset.info.includes('icon')) {
        element.src = result;
      } else {
        element.innerText = result;
      }
    });
    clearInterval(this.timer);
    this.startTime();
  },
  startTime() {
    setInterval(() => {
      const date = new Date();
      const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
      const newDate = new Date(utc + (3600000 * this.currentWeather.dateOffset));
      document.querySelector('[data-time]').innerText = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    }, 1000);
  },
};
