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
import { clearHtml, clearInput, hideLoader, showLoader } from './functions';

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
    console.log(current_weather);
  } catch (error) {
    Notify.failure('Something went wrong');
    console.log(error.message);
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
    weatherApi.copySearchedCity = [...results];

    clearHtml(refs.searchedCities);

    renderMarkup(refs.searchedCities, markupSearchedCities(results));
  } catch (error) {
    clearHtml(refs.searchedCities);
    console.log(error.message);
  }
};
export const onClickCityName = async evt => {
  Loading.pulse();
  clearHtml(refs.searchedCities);
  clearHtml(refs.currentCondition);
  clearHtml(refs.weatherLights);
  clearHtml(refs.highlights);

  if (evt.target.nodeName !== 'A') {
    return;
  }
  weatherApi.resetTimezone();

  const searchedCity = weatherApi.copySearchedCity.find(
    city => city.id === Number(evt.target.dataset.id)
  );
  if (searchedCity.country_code === 'UA') {
    weatherApi.timezone = 'Europe/Kiev';
  }

  weatherApi.city = searchedCity.name;
  weatherApi.latitude = searchedCity.latitude;
  weatherApi.longitude = searchedCity.longitude;

  try {
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
    Notify.failure('Something went wrong');
    console.log(error.message);
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
    const { hourly, daily, current_weather } = await weatherApi.fetchWeather();
    if (evt.target.dataset.weather === 'hourly') {
      renderMarkup(
        refs.weatherLights,
        markupHourlyWeather(hourly, daily, current_weather)
      );
      return;
    }
    renderMarkup(
      refs.weatherLights,
      markupDailyWeather(daily, current_weather)
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    hideLoader();
  }
};
