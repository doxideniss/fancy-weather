import mapbox from './js/api/mapbox.api';
import geolocation from './js/api/geolocation.api';
import speech from './js/speech';
import app from './js/app';

const langDropDownHandlers = () => {
  const langMenu = document.querySelector('.language-menu');
  const dropDownMenu = document.querySelector('.drop-down-menu');
  langMenu.addEventListener('click', () => {
    langMenu.querySelector('.drop-down-menu').classList.toggle('drop-down-menu--open');
    langMenu.querySelector('.language-menu__arrow').classList.toggle('arrow-down--open');
    langMenu.querySelector('.language-menu__face-button').classList.toggle('language-menu__face-button--open');
  });
  dropDownMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('drop-down-menu__item') && !e.target.classList.contains('drop-down-menu__item--active')) {
      langMenu.querySelector('.language-menu__face-button > span').innerText = e.target.innerText;
      dropDownMenu.querySelectorAll('.drop-down-menu__item').forEach((item) => {
        item.classList.remove('drop-down-menu__item--active');
      });
      e.target.classList.add('drop-down-menu__item--active');
      app.setLang(e.target.dataset.lang);
    }
  });
};

const updateHandlers = () => {
  const btnUpdate = document.querySelector('.button--update');
  const spinner = btnUpdate.querySelector('.spinner');
  btnUpdate.addEventListener('click', () => {
    spinner.classList.remove('spinner');
    app.changeBGImage();
    // eslint-disable-next-line no-unused-expressions
    spinner.offsetWidth;
    spinner.classList.add('spinner');
  });
};

const unitTempHandlers = () => {
  const unitBox = document.querySelector('.header__unit-temp');
  unitBox.addEventListener('click', (e) => {
    if (e.target.classList.contains('button') && e.target.classList.contains('button--inactive')) {
      unitBox.querySelectorAll('button').forEach((btn) => {
        btn.classList.add('button--inactive');
      });
      e.target.classList.remove('button--inactive');
      app.setUnitOfTemp(e.target.dataset.unit);
    }
  });
};

const btnSearchHandler = () => {
  const btnSearch = document.querySelector('.form__search-btn');
  const inputSearch = document.querySelector('.form__search-field');
  btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    const search = inputSearch.value;
    if (search !== '') {
      app.setCity(inputSearch.value);
    }
  });
};

window.onload = async () => {
  app.changeBGImage();
  await geolocation.init();
  mapbox.init();
  speech.init();
  langDropDownHandlers();
  updateHandlers();
  unitTempHandlers();
  btnSearchHandler();
  await app.setCity(geolocation.info.city);
  app.setLang('en');
  // document.querySelector('.speak').addEventListener('click', () => {
  //   speech.speech(document.querySelector('.form__search-field').value);
  // });
  const mic = document.querySelector('.form__mic');
  mic.addEventListener('click', () => {
    speech.startRecognition();
    mic.classList.add('form__mic--active');
  });
};
