import { refs } from './js/refs';
import { Store } from './js/store';
import { CitiesApi, WeatherApi } from './js/api';
import { Loading, Notify } from 'notiflix';
import {
  airQualityCardTemplate,
  citiesListTemplate,
  cityTitleTemplate,
  humudityCardTemplate,
  mainWeatherCardTemplate,
  sunriseSunsetCardTemplate,
  uvCardTemplate,
  visibilityCardTemplate,
  weatherListCardTemplate,
  windCardTemplate,
} from './js/templates';
import { View } from './js/view';
import { DEBOUNCE_DELAY, errorMessage, swiperOptions } from './js/constants';
import {
  closestDate,
  getAirQualityStatus,
  getUvindexIcon,
  getVisibilityCondition,
  mphOrKmVisibility,
  relativeHumidity,
  windDirection,
  getURLHash,
  transformDataForDailyHourlyCard,
  transformDataForMainCard,
  clearHtml,
  clearInput,
} from './js/services';
import Swiper from 'swiper';
import 'swiper/swiper.scss';
import { format } from 'date-fns';
const debounce = require('lodash.debounce');

class App extends Store {
  constructor() {
    super({});

    this.weatherApi = new WeatherApi();
    this.view = new View();
    this.cities = new CitiesApi();
    this.init();
  }

  init() {
    this.initializeSwiper();
    this.addEventListeners();
  }

  initializeSwiper() {
    new Swiper('.swiper', swiperOptions);
  }

  setActive(option) {
    document.querySelectorAll(`[data-weather="options"] a`).forEach(el => {
      if (el.matches(`[href="#${option}"]`)) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    });
  }
  setActiveButton(evt) {
    const activeBtn = document.querySelector('[data-loaded="true"]');
    evt.target.dataset.loaded = 'true';
    activeBtn.dataset.loaded = 'false';
  }

  handleError(error) {
    Notify.failure(errorMessage.INVALID);
    console.error(error);
    Loading.remove();
  }

  clearSearchResults() {
    clearHtml(refs.searchedCities);
    clearInput();
  }

  eventDefinitions = [
    {
      event: 'DOMContentLoaded',
      listener: async () => {
        try {
          Loading.pulse();
          this._state = await this.weatherApi.init();
          this.render();
          Loading.remove();
        } catch (error) {
          this.handleError(error);
        }
      },
    },
    {
      event: 'hashchange',
      listener: () => {
        this.renderSliderWeather();
      },
    },
    {
      event: 'click',
      element: refs.tempChanger,
      listener: async evt => {
        const { latitude, longitude, countryCode } = this.state;
        if (
          evt.target.nodeName === 'BUTTON' ||
          evt.target.dataset.loaded !== 'true'
        ) {
          this.setActiveButton(evt);

          try {
            Loading.pulse();
            const data = await this.weatherApi.getWeather(
              latitude,
              longitude,
              countryCode,
              evt.target.dataset.value
            );
            this._state = { ...this.state, ...data };
            this.render();
            Loading.remove();
          } catch (error) {
            this.handleError(error);
          }
        }
      },
    },
    {
      event: 'focus',
      element: refs.input,
      listener: () => {
        clearHtml(refs.searchedCities);
        this.view.insertHTML(
          refs.searchedCities,
          cityTitleTemplate('Start typing to search for locations')
        );
      },
    },
    {
      event: 'input',
      element: refs.input,
      listener: debounce(async evt => {
        if (evt.target.value.trim()) {
          try {
            await this.cities.getCities(evt.target.value);
          } catch (error) {
            this.handleError(error);
          }
          if (!this.cities.data) {
            this.view.replaceHTML(
              refs.searchedCities,
              cityTitleTemplate('No locations found')
            );
          } else {
            this.view.replaceHTML(
              refs.searchedCities,
              citiesListTemplate(this.cities.data)
            );
          }
        } else {
          clearHtml(refs.searchedCities);
        }
      }, DEBOUNCE_DELAY),
    },
    {
      event: 'click',
      element: refs.searchedCities,
      listener: async evt => {
        if (evt.target.nodeName !== 'BUTTON') {
          this.clearSearchResults();
          return;
        }
        const {
          country_code,
          latitude,
          longitude,
          name: city,
        } = this.cities?.data.find(
          city => city.id === Number(evt.target.dataset.id)
        );
        const unit =
          this.state?.current_weather_units?.temperature === '°C'
            ? 'celsius'
            : 'fahrenheit';
        this.clearSearchResults();

        try {
          Loading.pulse();
          const data = await this.weatherApi.getWeather(
            latitude,
            longitude,
            country_code,
            unit
          );
          this._state = { ...this.state, ...data, city };

          this.render();
          Loading.remove();
        } catch (error) {
          this.handleError(error);
        }
      },
    },
  ];

  addEventListeners() {
    this.eventDefinitions.forEach(definition => {
      const { event, element, listener } = definition;
      (element || window).addEventListener(event, listener);
    });
  }

  // addEventListeners() {
  //   window.addEventListener('DOMContentLoaded', async () => {
  //     try {
  //       Loading.pulse();
  //       this._state = await this.weatherApi.init();
  //       this.render();
  //       Loading.remove();
  //     } catch (error) {
  //       this.handleError(error);
  //     }
  //   });
  //   window.addEventListener('hashchange', () => {
  //     this.renderSliderWeather();
  //   });
  //   refs.tempChanger.addEventListener('click', async evt => {
  //     const { latitude, longitude, countryCode } = this.state;
  //     if (
  //       evt.target.nodeName === 'BUTTON' ||
  //       evt.target.dataset.loaded !== 'true'
  //     ) {
  //       this.setActiveButton(evt);

  //       try {
  //         Loading.pulse();
  //         const data = await this.weatherApi.getWeather(
  //           latitude,
  //           longitude,
  //           countryCode,
  //           evt.target.dataset.value
  //         );
  //         this._state = { ...this.state, ...data };
  //         this.render();
  //         Loading.remove();
  //       } catch (error) {
  //         this.handleError();
  //       }
  //     }
  //   });
  //   refs.input.addEventListener('focus', () => {
  //     clearHtml(refs.searchedCities);
  //     this.view.insertHTML(
  //       refs.searchedCities,
  //       cityTitleTemplate('Start typing to search for locations')
  //     );
  //   });
  //   refs.input.addEventListener(
  //     'input',
  //     debounce(async evt => {
  //       if (evt.target.value.trim()) {
  //         try {
  //           await this.cities.getCities(evt.target.value);
  //         } catch (error) {
  //           this.handleError(error);
  //         }
  //         if (!this.cities.data) {
  //           this.view.replaceHTML(
  //             refs.searchedCities,
  //             cityTitleTemplate('No locations found')
  //           );
  //         } else {
  //           this.view.replaceHTML(
  //             refs.searchedCities,
  //             citiesListTemplate(this.cities.data)
  //           );
  //         }
  //       } else {
  //         clearHtml(refs.searchedCities);
  //       }
  //     }, DEBOUNCE_DELAY)
  //   );
  //   refs.searchedCities.addEventListener('click', async evt => {
  //     if (evt.target.nodeName === 'BUTTON') {
  //       const {
  //         country_code: countryCode,
  //         latitude,
  //         longitude,
  //         name: city,
  //       } = this.cities?.data.find(
  //         city => city.id === Number(evt.target.dataset.id)
  //       );

  //       const unit =
  //         this.state?.current_weather_units?.temperature === '°C'
  //           ? 'celsius'
  //           : 'fahrenheit';
  //       this.clearSearchResults();
  //       try {
  //         Loading.pulse();
  //         const data = await this.weatherApi.getWeather(
  //           latitude,
  //           longitude,
  //           countryCode,
  //           unit
  //         );
  //         this._state = { ...this.state, ...data, city, countryCode };
  //         this.render();
  //         Loading.remove();
  //       } catch (error) {
  //         this.handleError(error);
  //       }
  //     } else {
  //       this.clearSearchResults();
  //     }
  //   });
  // }

  renderMainCard() {
    const { hourly, daily, current_weather, hourly_units, city } = this.state;

    this.index = hourly.time.indexOf(
      closestDate(hourly.time, current_weather.time)
    );
    const dataForMainCardWeather = transformDataForMainCard(
      hourly,
      daily,
      current_weather,
      hourly_units,
      city,
      this.index
    );

    this.view.replaceHTML(
      refs.currentCondition,
      mainWeatherCardTemplate(dataForMainCardWeather)
    );
  }

  renderSliderWeather() {
    this.type = getURLHash() || 'today';
    this.setActive(this.type);

    const { hourly, daily, current_weather } = this.state;
    const dataArray = transformDataForDailyHourlyCard(
      hourly,
      daily,
      current_weather,
      this.type,
      this.index
    );
    this.view.replaceHTML(
      refs.weatherLights,
      weatherListCardTemplate(dataArray)
    );
  }

  renderWeatherHighlights() {
    const { hourly, daily, hourly_units, airData } = this.state;

    const windDirect = windDirection(hourly.winddirection_10m[this.index]);

    const { airQualityStatus, airQualityColor } = getAirQualityStatus(
      airData.hourly.us_aqi[this.index]
    );

    const visibilityValue = mphOrKmVisibility(
      hourly_units['temperature_2m'],
      hourly.visibility[this.index]
    );
    const { visibilityStatus, visibilityColor } = getVisibilityCondition(
      hourly_units['temperature_2m'],
      hourly.visibility[this.index]
    );

    const { humidityStatus, humidityColor } = relativeHumidity(
      hourly.relativehumidity_2m[this.index]
    );

    const uvi = Math.round(daily.uv_index_max[0]);
    const iconUv = getUvindexIcon(uvi);

    const tplList = `${uvCardTemplate(iconUv)}
    ${windCardTemplate(
      hourly.windspeed_10m[this.index],
      hourly_units['windspeed_10m'],
      windDirect
    )}
    ${sunriseSunsetCardTemplate(
      format(new Date(daily.sunrise[0]), 'h:mmaaa'),
      format(new Date(daily.sunset[0]), 'h:mmaaa')
    )}
    ${humudityCardTemplate(
      hourly.relativehumidity_2m[this.index],
      humidityColor,
      humidityStatus
    )}
    ${visibilityCardTemplate(
      visibilityValue,
      visibilityColor,
      visibilityStatus
    )}
    ${airQualityCardTemplate(
      airData.hourly.us_aqi[this.index],
      airQualityColor,
      airQualityStatus
    )}
    `;

    this.view.replaceHTML(refs.highlights, tplList);
  }
  render() {
    this.renderMainCard();
    this.renderSliderWeather();
    this.renderWeatherHighlights();
  }
}
new App();
