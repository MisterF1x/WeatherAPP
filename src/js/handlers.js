import WeatherApi from './api';
import { Notify, Loading } from 'notiflix';
import { refs } from './refs';
import {
  markupCurrentCondition,
  markupDailyWeather,
  markupHourlyWeather,
  markupSearchedCities,
  markupTodayHighligts,
  renderMarkup,
} from './render';
import {
  clearHtml,
  clearInput,
  hideLoader,
  showLoader,
  getDataInUnit,
  renderHourlyDailyWeather,
} from './services';

export const weatherApi = new WeatherApi();
export const onLoadWindow = async () => {
  Loading.pulse();
  try {
    await weatherApi.setGeolocation();

    const { hourly, daily, current_weather, hourly_units } =
      await weatherApi.fetchWeather();
    const airQuality = await weatherApi.fetchAirQuality();

    renderMarkup(
      refs.currentCondition,
      markupCurrentCondition(hourly, daily, current_weather, hourly_units)
    );
    renderMarkup(
      refs.weatherLights,
      markupHourlyWeather(hourly, daily, current_weather)
    );
    renderMarkup(
      refs.highlights,
      markupTodayHighligts(
        hourly,
        daily,
        current_weather,
        hourly_units,
        airQuality
      )
    );
  } catch (error) {
    // Notify.failure('Something went wrong');
    console.error(error.message);
  } finally {
    Loading.remove(300);
  }
};
export const onInputSearchCities = async evt => {
  try {
    const name = evt.target.value.trim();
    if (name === '') {
      clearHtml(refs.searchedCities);
      return;
    }

    const { results } = await weatherApi.fetchCities(name);
    weatherApi.copySearchedCity = !results ? [] : [...results];

    clearHtml(refs.searchedCities);
    if (!results) {
      renderMarkup(
        refs.searchedCities,
        `<li class="search-block__btn" >
              No locations found
          </li> `
      );
      return;
    }
    renderMarkup(refs.searchedCities, markupSearchedCities(results));
  } catch (error) {
    console.error(error.message);
    clearHtml(refs.searchedCities);
    if (error.code === 'ERR_NETWORK') {
      Notify.failure(error.message);
    }
  }
};
export const onClickCityName = async evt => {
  const clearedRefs = [
    refs.searchedCities,
    refs.currentCondition,
    refs.weatherLights,
    refs.highlights,
  ];

  if (evt.target.nodeName !== 'A') {
    clearHtml(refs.searchedCities);
    clearInput();
    return;
  }
  Loading.pulse();
  clearedRefs.forEach(ref => clearHtml(ref));
  weatherApi.resetTimezone();

  const searchedCity = weatherApi.copySearchedCity.find(
    city => city.id === Number(evt.target.dataset.id)
  );
  weatherApi.timezone =
    searchedCity.country_code === 'UA' ? 'Europe/Kiev' : 'auto';

  weatherApi.city = searchedCity.name;
  weatherApi.latitude = searchedCity.latitude;
  weatherApi.longitude = searchedCity.longitude;

  try {
    const { hourly, daily, current_weather, hourly_units } =
      await getDataInUnit(weatherApi.weatherUnit);

    const airQuality = await weatherApi.fetchAirQuality();

    const weatherLightsMarkup = weatherApi.dailyWeather
      ? markupDailyWeather(daily, current_weather)
      : markupHourlyWeather(hourly, daily, current_weather);

    renderMarkup(
      refs.currentCondition,
      markupCurrentCondition(hourly, daily, current_weather, hourly_units)
    );
    renderMarkup(refs.weatherLights, weatherLightsMarkup);

    renderMarkup(
      refs.highlights,
      markupTodayHighligts(
        hourly,
        daily,
        current_weather,
        hourly_units,
        airQuality
      )
    );
  } catch (error) {
    Notify.failure('Something went wrong');
    console.error(error.message);
  } finally {
    clearInput();
    Loading.remove(300);
  }
};
export const onClickTodayWeek = async evt => {
  evt.preventDefault();
  const currentActiveBtn = document.querySelector('.current');
  if (weatherApi.latitude === 0 && weatherApi.longitude === 0) return;
  if (evt.target.nodeName !== 'A') return;
  if (evt.target.dataset.state === 'open') return;

  currentActiveBtn.classList.remove('current');
  currentActiveBtn.dataset.state = 'close';

  evt.target.classList.add('current');
  evt.target.dataset.state = 'open';
  clearHtml(refs.weatherLights);
  showLoader();
  try {
    const { hourly, daily, current_weather } = await getDataInUnit(
      weatherApi.weatherUnit
    );
    renderHourlyDailyWeather(
      weatherApi.dailyWeather,
      hourly,
      daily,
      current_weather
    );
    weatherApi.dailyWeather = weatherApi.dailyWeather ? false : true;
  } catch (error) {
    console.error(error.message);
    Notify.failure('Something went wrong');
  } finally {
    hideLoader();
  }
};
export const onClickChangerUnit = async evt => {
  const clearedRefs = [
    refs.searchedCities,
    refs.currentCondition,
    refs.weatherLights,
    refs.highlights,
  ];
  const currentActiveBtn = document.querySelector('.current__btn');
  if (
    (weatherApi.latitude === 0 && weatherApi.longitude === 0) ||
    evt.target.nodeName !== 'BUTTON' ||
    evt.target.dataset.state === 'open'
  )
    return;

  currentActiveBtn.classList.remove('current__btn');
  currentActiveBtn.dataset.state = 'close';

  evt.target.classList.add('current__btn');
  evt.target.dataset.state = 'open';
  Loading.pulse();
  clearedRefs.forEach(ref => clearHtml(ref));

  try {
    weatherApi.weatherUnit = evt.target.dataset.value;

    const { hourly, daily, current_weather, hourly_units } =
      await getDataInUnit(weatherApi.weatherUnit);
    const airQuality = await weatherApi.fetchAirQuality();

    const weatherLightsMarkup = weatherApi.dailyWeather
      ? markupDailyWeather(daily, current_weather)
      : markupHourlyWeather(hourly, daily, current_weather);

    renderMarkup(
      refs.currentCondition,
      markupCurrentCondition(hourly, daily, current_weather, hourly_units)
    );
    renderMarkup(refs.weatherLights, weatherLightsMarkup);

    renderMarkup(
      refs.highlights,
      markupTodayHighligts(
        hourly,
        daily,
        current_weather,
        hourly_units,
        airQuality
      )
    );
  } catch (error) {
    console.error(error.message);
    Notify.failure('Something went wrong');
  } finally {
    Loading.remove(300);
  }
};
export const onFocuseInput = () => {
  const tpl = `<li class="search-block__btn" style=' padding: .7rem;' >
              Start typing to search for locations
          </li> `;
  clearHtml(refs.searchedCities);
  renderMarkup(refs.searchedCities, tpl);
};
