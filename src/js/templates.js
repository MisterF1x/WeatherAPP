import * as weatherSprite from '../assets/images/*.svg';
import * as icons from '../assets/images/fill/svg-static/icons/*.svg';
import * as riseSet from '../assets/images/fill/svg-static/rise-set/*.svg';
import { format } from 'date-fns';

export const mainWeatherCardTemplate = data => {
  return `
                    <div class="current-condition__primary">
                  <div class="current-condition__wrap-img">
                    <img
                      src="${data?.icon}"
                      alt="${data?.text}"
                      width="100%"
                      crossorigin
                    />
                  </div>
                  <div class="current-condition__temp">
                    <p class="current-condition__num">
                        ${data?.temperature}                    
                        <span>
                            ${data?.temperatureUnit}
                        </span>
                    </p>
                    <p class="current-condition__fill">
                        Fills like: ${data?.fillTemperature}                    
                        <span>
                            ${data?.temperatureUnit}
                        </span>
                    </p>
                  </div>
                  <ul class="location">
                    <li class="location__item">
                      <svg class="icon location__icon">
                        <use href="${
                          weatherSprite['sprite']
                        }#icon-location"></use>
                      </svg>
                      <h1 class="location__title">${data?.city}</h1>
                    </li>
                    <li class="location__item">
                      ${format(data.parsedTime, 'EEEE')}, 
                      <span class="location-time">${format(
                        data.parsedTime,
                        'h aaa'
                      )}</span>
                    </li>
                  </ul>
                </div>
                <div class="current-condition__secondary">
                  <ul class="current-condition__overcoast xl-theme">
                    <li class="current-condition__item">
                      <svg class="current-condition__img">
                        <use href="${weatherSprite['sprite']}#${
    data?.iconSecondary
  }"></use>
                      </svg>
                      <span>${data?.text}${data?.windy}</span>
                    </li>
                    <li class="current-condition__item">
                      <svg class="current-condition__img">
                        <use href="${weatherSprite['sprite']}#umbrella"></use>
                      </svg>
                      <span>${data?.precipitation}</span>
                    </li>
                  </ul>
              </div>
          `;
};

const weatherCardTemplate = ({
  icon,
  text,
  temperatureM,
  temperatureH,
  time,
}) => {
  return `
  <div class="swiper-slide weather-lights__items">
            <div class="weather-lights-wraper">
              <p class="weather-lights__time">${time}</p>
              <img
                src="${icon}"
                title="${text}"
                alt="${text}"
              />
              <p class="weather-lights__temp">
                <span 
                  title="${temperatureM?.title}" 
                  class="weather-lights__temp-now"
                >
                  ${temperatureM?.temp}&deg
                </span>
                <span 
                  class="weather-lights__temp-fills" 
                  title="${temperatureH?.title}"
                >
                  ${temperatureH?.temp}&deg
                </span>
              </p>
            </div>
          </div>`;
};

export const weatherListCardTemplate = dataArray => {
  return dataArray
    .map(weatherData => weatherCardTemplate(weatherData))
    .join('');
};

export const uvCardTemplate = uvIcon => {
  return `
  <li class="detail-list__item">
      <h2 class="detail-list__title">UV Index</h2>
      <img
        class="detail-list__img--large"
        src="${uvIcon}"
        alt="uv index"
      />
  </li>`;
};

export const windCardTemplate = (windSpeed, windUnit, windDirection) => {
  return `
  <li class="detail-list__item">
    <h2 class="detail-list__title">Wind Status</h2>
    <p class="detail-list__text">
      ${windSpeed} ${windUnit}
    </p>
    <div class="detail-list__wind-direction">
      <img src="${icons['compass']}" alt="compass" />
      <p class="detail-list__wind-direction--text">
        ${windDirection}
      </p>
    </div>
  </li>
  `;
};

export const sunriseSunsetCardTemplate = (sunrise, sunset) => {
  return `
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
          ${sunrise}
        </span>
      </div>
      <div class="sunrise-sunset">
        <img
          class="sunrise-sunset__img"
          src="${riseSet['sunset']}"
          alt="sunset"
        />
        <span class="sunrise-sunset__time">
          ${sunset}
        </span>
      </div>
    </div>
  </li>
  `;
};

export const humudityCardTemplate = (
  humudity,
  humidityColor,
  humidityStatus
) => {
  return `
  <li class="detail-list__item">
    <h2 class="detail-list__title">Humudity</h2>
    <div class="detail-list__wraper">
      <p class="detail-list__text">${humudity}%</p>
      <img
        src="${icons.humidity}"
        alt="humidity"
        class="detail-list__img"
      />
    </div>
    <p class="detail-list__status" style="color:${humidityColor}">
      ${humidityStatus}
    </p>
  </li>
  `;
};
export const visibilityCardTemplate = (
  visibility,
  visibilityColor,
  visibilityStatus
) => {
  return `
  <li class="detail-list__item">
    <h2 class="detail-list__title">Visibility</h2>
    <p class="detail-list__text" >
      ${visibility}
    </p>
    <p class="detail-list__status" style="color:
    ${visibilityColor}">
      ${visibilityStatus}
    </p>
  </li>
  `;
};

export const airQualityCardTemplate = (
  airQuality,
  airQualityColor,
  airQualityStatus
) => {
  return `
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
          stroke-dasharray: ${(airQuality * (2 * Math.PI * 30)) / 200} ${
    2 * Math.PI * 30
  };
          stroke: ${airQualityColor};
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
        ${airQuality}
      </text>
    </svg>

    <p class="detail-list__status" style="color: ${airQualityColor}">
    ${airQualityStatus}
    </p>
  </li>
  `;
};

export const cityTemplate = ({ id, name, country, admin1 }) => {
  return `
    <li class="search-block__btn" >
      <button data-id="${id}" type="button"  class="search-block__link">
        ${name}, 
        <span>${country} ${admin1 ?? ''}</span>
      </button>
    </li>
  `;
};

export const citiesListTemplate = results => {
  return results?.map(result => cityTemplate(result)).join('');
};

export const cityTitleTemplate = title => {
  return `
  <li class="search-block__btn" style=' padding: .7rem;' >
    ${title}
  </li>
  `;
};
