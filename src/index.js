// import 'modern-normalize';
import { swiper } from './js/slider';
import {
  onInputSearchCities,
  onLoadWindow,
  onClickCityName,
  onClickTodayWeek,
} from './js/handlers';
import { refs } from './js/refs';
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 350;

// window.addEventListener('load', onLoadWindow);
refs.input.addEventListener(
  'input',
  debounce(onInputSearchCities, DEBOUNCE_DELAY)
);
refs.searchedCities.addEventListener('click', onClickCityName);
refs.todayWeekChanger.addEventListener('click', onClickTodayWeek);
