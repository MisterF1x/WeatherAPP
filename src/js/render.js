import { weatherApi } from './handlers';
import { format, parseISO } from 'date-fns';
import * as weatherSprite from '../img/*.svg';
import * as icons from '../img/fill/svg-static/icons/*.svg';
import * as riseSet from '../img/fill/svg-static/rise-set/*.svg';
import {
  addColorStatusTextHumidity,
  addColorStatusTextAqi,
  airQualityRanges,
  getIconSecondaryCondition,
  getIconWeather,
  getUvindexIcon,
  getWeatherText,
  mphOrKmVisibility,
  relativeHumidity,
  unitChanger,
  visibilityCondition,
  windDirection,
  windyDay,
  addColorStatusTextVisibility,
  getIconDailyWeather,
} from './functions';

export const markupCurrentCondition = (
  hourly,
  daily,
  current_weather,
  hourly_units
) => {
  const { time } = current_weather;

  const { sunrise, sunset } = daily;

  const {
    cloudcover,
    weathercode,
    precipitation_probability,
    apparent_temperature,
    temperature_2m,
    windspeed_10m,
  } = hourly;
  let index = hourly.time.indexOf(time);
  const parsedTime = parseISO(time);
  let icon = getIconWeather(
    weathercode[index],
    sunrise[0],
    sunset[0],
    cloudcover[index],
    time
  );
  const text = getWeatherText(weathercode[index], sunrise[0], sunset[0], time);
  const temp = Math.round(temperature_2m[index]);
  const unitWeather = unitChanger(hourly_units.temperature_2m);
  const apparentTemp = Math.round(apparent_temperature[index]);
  const iconSecondary = getIconSecondaryCondition(
    weathercode[index],
    sunrise[0],
    sunset[0],
    windspeed_10m[index],
    hourly_units['windspeed_10m'],
    time
  );

  const precipitation = !precipitation_probability[index]
    ? 'No Precipitation'
    : `${precipitation_probability[index]}%`;

  const windy = windyDay(windspeed_10m[index], hourly_units['windspeed_10m'])
    ? `/${windyDay(windspeed_10m[index], hourly_units['windspeed_10m'])}`
    : '';
  // let svgUrl = new URL('../img/sprite.svg', import.meta.url);
  return `
              <div class="current-condition__primary">
            <div class="current-condition__wrap-img">
              <img
                src="${icon}"
                alt="${text}"
                width="100%"
                crossorigin
              />
            </div>
            <div class="current-condition__temp">
              <span class="current-condition__num"
                >${temp}
                <svg class="current-condition__celsius-main">
                  <use href="${weatherSprite['sprite']}#${unitWeather}"></use>
                </svg>
                
              </span>

              <span class="current-condition__fill"
                >Fills like: ${apparentTemp}
                <svg class="current-condition__celsius">
                  <use href="${weatherSprite['sprite']}#${unitWeather}"></use>
                </svg>
              </span>
            </div>
            <ul class="location">
              <li class="location__item">
                <svg class="icon location__icon">
                  <use href="${weatherSprite['sprite']}#icon-location"></use>
                </svg>
                <h1 class="location__title">${weatherApi.city}</h1>
              </li>
              <li class="location__item">
                ${format(parsedTime, 'EEEE')}, 
                <span class="location-time">${format(
                  parsedTime,
                  'h aaa'
                )}</span>
              </li>
            </ul>
          </div>
          <div class="current-condition__secondary">
            <ul class="current-condition__overcoast xl-theme">
              <li class="current-condition__item">
                <svg class="current-condition__img">
                  <use href="${weatherSprite['sprite']}#${iconSecondary}"></use>
                </svg>
                <span>${text}${windy}</span>
              </li>
              <li class="current-condition__item">
                <svg class="current-condition__img">
                  <use href="${weatherSprite['sprite']}#umbrella"></use>
                </svg>
                <span>${precipitation}</span>
              </li>
            </ul>
        </div>
    `;
};
export const markupHourlyWeather = (hourly, daily, current_weather) => {
  const {
    time,
    temperature_2m,
    apparent_temperature,
    weathercode,
    cloudcover,
  } = hourly;
  const { sunrise, sunset } = daily;
  let index = time.indexOf(current_weather.time);
  let array = [];
  const lenghtArray = index + 25;
  for (index += 1; index < lenghtArray; index += 1) {
    array.push(`
    <div class="swiper-slide weather-lights__items">
              <div class="weather-lights-wraper">
                <p class="weather-lights__time">${format(
                  parseISO(time[index]),
                  'h aaa'
                )}</p>
                <img
                  src="${getIconWeather(
                    weathercode[index],
                    sunrise[0],
                    sunset[0],
                    cloudcover[index],
                    time[index]
                  )}"
                  title="${getWeatherText(
                    weathercode[index],
                    sunrise[0],
                    sunset[0],
                    time[index]
                  )}"
                  alt="${getWeatherText(
                    weathercode[index],
                    sunrise[0],
                    sunset[0],
                    time[index]
                  )}"
                />
                <p class="weather-lights__temp">
                  <span title="Current temperature" class="weather-lights__temp-now">${Math.round(
                    temperature_2m[index]
                  )}&deg</span
                  ><span class="weather-lights__temp-fills" title="Fills Like">${Math.round(
                    apparent_temperature[index]
                  )}&deg</span>
                </p>
              </div>
            </div>
    `);
  }
  return array.join('');
};
export const markupDailyWeather = (daily, current_weather) => {
  const {
    time,
    weathercode,
    temperature_2m_max,
    temperature_2m_min,
    sunrise,
    sunset,
  } = daily;
  let array = [];

  for (let i = 0; i < time.length; i += 1) {
    array.push(`
    <div class="swiper-slide weather-lights__items">
              <div class="weather-lights-wraper">
                <p class="weather-lights__time">${format(
                  parseISO(time[i]),
                  'd iii'
                )}</p>
                <img
                  src="${getIconDailyWeather(
                    weathercode[i],
                    sunrise[0],
                    sunset[0],
                    current_weather.time
                  )}"
                  title="${getWeatherText(
                    weathercode[i],
                    sunrise[0],
                    sunset[0],
                    Date.now()
                  )}"
                  alt="${getWeatherText(
                    weathercode[i],
                    sunrise[0],
                    sunset[0],
                    current_weather.time
                  )}"
                />
                <p class="weather-lights__temp">
                  <span title="Max temperature" class="weather-lights__temp-now">${Math.round(
                    temperature_2m_max[i]
                  )}&deg</span
                  ><span class="weather-lights__temp-fills" title="Min temperature">${Math.round(
                    temperature_2m_min[i]
                  )}&deg</span>
                </p>
              </div>
            </div>
    `);
  }
  return array.join('');
};
export const markupTodayHighligts = (
  hourly,
  daily,
  current_weather,
  hourly_units,
  airQuality
) => {
  const { sunrise, sunset, uv_index_max } = daily;
  const {
    time,
    relativehumidity_2m,
    visibility,
    windspeed_10m,
    winddirection_10m,
  } = hourly;
  let index = time.indexOf(current_weather.time);
  const uvi = Math.round(uv_index_max[0]);

  return `
          <li class="detail-list__item">
            <h2 class="detail-list__title">UV Index</h2>
            <img
              class="detail-list__img--large"
              src="${getUvindexIcon(uvi)}"
              alt="uv index"
            />
          </li>
          <li class="detail-list__item">
            <h2 class="detail-list__title">Wind Status</h2>

            <p class="detail-list__text">
              ${windspeed_10m[index]} ${hourly_units['windspeed_10m']}
            </p>
            <div class="detail-list__wind-direction">
              <img src="${icons['compass']}" alt="compass" />
              <p class="detail-list__wind-direction--text">
                ${windDirection(winddirection_10m[index])}
              </p>
            </div>
          </li>
          <li class="detail-list__item">
            <h2 class="detail-list__title">Sunrise & Sunset</h2>
            <div class="detail-list__container--middle">
              <div class="sunrise-sunset">
                <img
                  class="sunrise-sunset__img"
                  src="${riseSet['sunrise']}"
                  alt="sunrise"
                />
                <span class="sunrise-sunset__time">
                  ${format(new Date(sunrise[0]), 'h:mmaaa')}
                </span>
              </div>
              <div class="sunrise-sunset">
                <img
                  class="sunrise-sunset__img"
                  src="${riseSet['sunset']}"
                  alt="sunset"
                />
                <span class="sunrise-sunset__time">
                  ${format(new Date(sunset[0]), 'h:mmaaa')}
                </span>
              </div>
            </div>
          </li>
          <li class="detail-list__item">
            <h2 class="detail-list__title">Humudity</h2>
            <div class="detail-list__wraper">
              <p class="detail-list__text">${relativehumidity_2m[index]}%</p>
              <img
                src="${icons.humidity}"
                alt="humidity"
                class="detail-list__img"
              />
            </div>

            <p class="detail-list__status" style="color:${addColorStatusTextHumidity(
              relativeHumidity(relativehumidity_2m[index])
            )}">
              ${relativeHumidity(relativehumidity_2m[index])}
            </p>
          </li>
          <li class="detail-list__item">
            <h2 class="detail-list__title">Visibility</h2>
            <p class="detail-list__text" >
              ${mphOrKmVisibility(
                hourly_units['temperature_2m'],
                visibility[index]
              )}
            </p>
            <p class="detail-list__status" style="color:
            ${addColorStatusTextVisibility(
              visibilityCondition(
                hourly_units['temperature_2m'],
                visibility[index]
              )
            )}">
              ${visibilityCondition(
                hourly_units['temperature_2m'],
                visibility[index]
              )}
            </p>
          </li>
          <li class="detail-list__item">
            <h2 class="detail-list__title">Air Quality</h2>
            <svg
              class="air-quality__img"
              width="60"
              height="60"
              style="border-radius: 50%"
            >
              <circle
                r="30"
                cx="30"
                cy="30"
                transform="rotate(90 30 30)"
                style="stroke-width: 15; fill: #0000; stroke: #e7ecf1"
              ></circle>
              <circle
                r="30"
                cx="30"
                cy="30"
                transform="rotate(90 30 30)"
                style="
                  stroke-width: 15;
                  stroke-dasharray: ${
                    (airQuality.hourly.european_aqi[index] *
                      (2 * Math.PI * 30)) /
                    100
                  } ${2 * Math.PI * 30};
                  stroke: ${addColorStatusTextAqi(
                    airQualityRanges(airQuality.hourly.us_aqi[index])
                  )};
                  fill: #0000;
                  transition: stroke-dasharray 0.3s ease;
                "
              ></circle>
              <text
                class="air-quality__text"
                x="50%"
                y="55%"
                dominant-baseline="middle"
                alignment-baseline="middle"
                text-anchor="middle"
              >
                ${airQuality.hourly.us_aqi[index]}
              </text>
            </svg>

            <p class="detail-list__status" style="color: ${addColorStatusTextAqi(
              airQualityRanges(airQuality.hourly.us_aqi[index])
            )}">
            ${airQualityRanges(airQuality.hourly.us_aqi[index])}
            </p>
          </li>
  `;
};
export const markupSearchedCities = results => {
  return results
    .map(result => {
      return `
          <li class="search-block__btn" >
              <a data-id="${result.id}" class="search-block__link" href="#">
              ${result.name}, ${result.country}, ${result.admin1}</a>
          </li>
  `;
    })
    .join('');
};
export const renderMarkup = (el, markup) => {
  el.insertAdjacentHTML('beforeend', markup);
};
