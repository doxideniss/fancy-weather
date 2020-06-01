import mapbox from './js/mapbox.api';
import geolocation from './js/geolocation.api';
import speech from './js/speech';

window.onload = async () => {
  await geolocation.get();
  mapbox.init();
  speech.init();
  document.querySelector('.speak').addEventListener('click', () => {
    speech.speech(document.querySelector('.test').value);
  });
  document.querySelector('.mic').addEventListener('click', () => {
    speech.startRecognition();
  });
};
