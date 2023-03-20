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
    if (error.code === 'ERR_NETWORK') {
      Notify.failure(error.message);
    }
    if (!error.code)
      renderMarkup(
        refs.searchedCities,
        `<li class="search-block__btn" >
              No locations found
          </li> `
      );
    console.log(error.message);
  }
};
export const onClickCityName = async evt => {
  if (evt.target.nodeName !== 'A') {
    clearHtml(refs.searchedCities);
    clearInput();
    return;
  }
  Loading.pulse();
  clearHtml(refs.searchedCities);
  clearHtml(refs.currentCondition);
  clearHtml(refs.weatherLights);
  clearHtml(refs.highlights);

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
      await getDataInUnit(weatherApi.weatherUnit);

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
    console.log(error.message);
    Notify.failure('Something went wrong');
  } finally {
    hideLoader();
  }
};
export const onClickChangerUnit = async evt => {
  const currentActiveBtn = document.querySelector('.current__btn');
  if (weatherApi.latitude === 0 && weatherApi.longitude === 0) return;
  if (evt.target.nodeName !== 'BUTTON') return;
  if (evt.target.dataset.state === 'open') return;

  currentActiveBtn.classList.remove('current__btn');
  currentActiveBtn.dataset.state = 'close';

  evt.target.classList.add('current__btn');
  evt.target.dataset.state = 'open';
  Loading.pulse();
  clearHtml(refs.searchedCities);
  clearHtml(refs.currentCondition);
  clearHtml(refs.weatherLights);
  clearHtml(refs.highlights);
  try {
    weatherApi.weatherUnit = evt.target.dataset.value;

    const { hourly, daily, current_weather, hourly_units } =
      await getDataInUnit(weatherApi.weatherUnit);
    const airQuality = await weatherApi.fetchAirQuality();

    renderMarkup(
      refs.currentCondition,
      markupCurrentCondition(hourly, daily, current_weather, hourly_units)
    );
    if (weatherApi.dailyWeather) {
      renderMarkup(
        refs.weatherLights,
        markupDailyWeather(daily, current_weather)
      );
    } else {
      renderMarkup(
        refs.weatherLights,
        markupHourlyWeather(hourly, daily, current_weather)
      );
    }
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
    console.log(error.message);
    Notify.failure('Something went wrong');
  } finally {
    Loading.remove(300);
  }
};
export const onFocuseInput = () => {
  clearHtml(refs.searchedCities);
  renderMarkup(
    refs.searchedCities,
    `<li class="search-block__btn" style=' padding: .7rem;' >
              Start typing to search for locations
          </li> `
  );
};
