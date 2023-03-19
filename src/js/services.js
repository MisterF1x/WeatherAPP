import * as iconsDay from '../img/fill/svg-static/day/*.svg';
import * as iconsNight from '../img/fill/svg-static/night/*.svg';
import * as iconsDaily from '../img/fill/svg-static/daily-icons/*.svg';
import * as uvIndex from '../img/fill/svg-static/uv-index/*.svg';
import { refs } from './refs';
import { weatherApi } from './handlers';
import {
  markupDailyWeather,
  markupHourlyWeather,
  renderMarkup,
} from './render';

const isDay = (sunrise, sunset, localTime) => {
  const timeSunrise = new Date(sunrise).getHours();
  const timeSunset = new Date(sunset).getHours();
  const todayTime = new Date(localTime).getHours();
  return todayTime >= timeSunrise && todayTime <= timeSunset ? true : false;
};
export const getIconWeather = (
  weathercode,
  sunrise,
  sunset,
  cloudcover,
  time
) => {
  if (weathercode === 0) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['clear-day']
      : iconsNight['clear-night'];
  }
  if (weathercode === 1) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day']
      : iconsNight['partly-cloudy-night'];
  }
  if (weathercode === 2) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['overcast-day']
      : iconsNight['overcast-night'];
  }
  if (weathercode === 3) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['extreme-day']
      : iconsNight['extreme-night'];
  }
  if (weathercode === 45) {
    if (isDay(sunrise, sunset, time)) {
      if (cloudcover < 25) {
        return iconsDay['fog-day'];
      }
      if (cloudcover > 65) {
        return iconsDay['extreme-day-fog'];
      }
      return iconsDay['overcast-day-fog'];
    } else {
      if (cloudcover < 20) {
        return iconsNight['fog-night'];
      }
      if (cloudcover > 65) {
        return iconsNight['extreme-night-fog'];
      }
      return iconsNight['overcast-night-fog'];
    }
  }
  if (weathercode === 48) {
    if (isDay(sunrise, sunset, time)) {
      if (cloudcover < 25) {
        return iconsDay['haze-day'];
      }
      if (cloudcover > 65) {
        return iconsDay['extreme-day-haze'];
      }
      return iconsDay['overcast-day-haze'];
    } else {
      if (cloudcover < 25) {
        return iconsNight['haze-night'];
      }
      if (cloudcover > 65) {
        return iconsNight['extreme-night-haze'];
      }
      return iconsNight['overcast-night-haze'];
    }
  }
  if (weathercode === 51 || weathercode === 53 || weathercode === 55) {
    if (isDay(sunrise, sunset, time)) {
      if (cloudcover < 25) {
        return iconsDay['partly-cloudy-day-drizzle'];
      }
      if (cloudcover > 65) {
        return iconsDay['extreme-day-drizzle'];
      }
      return iconsDay['overcast-day-drizzle'];
    } else {
      if (cloudcover < 25) {
        return iconsNight['partly-cloudy-night-drizzle'];
      }
      if (cloudcover > 65) {
        return iconsNight['extreme-night-drizzle'];
      }
      return iconsNight['overcast-night-drizzle'];
    }
  }
  if (weathercode === 56 || weathercode === 57) {
    if (isDay(sunrise, sunset, time)) {
      if (cloudcover < 25) {
        return iconsDay['partly-cloudy-day-sleet'];
      }
      if (cloudcover > 65) {
        return iconsDay['extreme-day-sleet'];
      }
      return iconsDay['overcast-day-sleet'];
    } else {
      if (cloudcover < 25) {
        return iconsNight['partly-cloudy-night-sleet'];
      }
      if (cloudcover > 65) {
        return iconsNight['extreme-night-sleet'];
      }
      return iconsNight['overcast-night-sleet'];
    }
  }
  if (weathercode === 61 || weathercode === 80) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day-rain']
      : iconsNight['partly-cloudy-night-rain'];
  }
  if (weathercode === 63 || weathercode === 81) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['overcast-day-rain']
      : iconsNight['overcast-night-rain'];
  }
  if (weathercode === 65 || weathercode === 82) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['extreme-day-rain']
      : iconsNight['extreme-night-rain'];
  }
  if (weathercode === 66 || weathercode === 67) {
    if (isDay(sunrise, sunset, time)) {
      if (cloudcover < 25) {
        return iconsDay['partly-cloudy-day-sleet'];
      }
      if (cloudcover > 65) {
        return iconsDay['extreme-day-sleet'];
      }
      return iconsDay['overcast-day-sleet'];
    } else {
      if (cloudcover < 25) {
        return iconsNight['partly-cloudy-night-sleet'];
      }
      if (cloudcover > 65) {
        return iconsNight['extreme-night-sleet'];
      }
      return iconsNight['overcast-night-sleet'];
    }
  }
  if (weathercode === 71 || weathercode === 85) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day-snow']
      : iconsNight['partly-cloudy-night-snow'];
  }
  if (weathercode === 73) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['overcast-day-snow']
      : iconsNight['overcast-night-snow'];
  }
  if (weathercode === 75 || weathercode === 77 || weathercode === 86) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['extreme-day-snow']
      : iconsNight['extreme-night-snow'];
  }
  if (weathercode === 95 || weathercode === 96) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['thunderstorms-day-overcast-rain']
      : iconsNight['thunderstorms-night-overcast-rain'];
  }
  if (weathercode === 99) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['thunderstorms-day-extreme-rain']
      : iconsNight['thunderstorms-night-extreme-rain'];
  }
};
export const getIconDailyWeather = (weathercode, sunrise, sunset, time) => {
  if (weathercode === 0) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['clear-day']
      : iconsNight['clear-night'];
  }
  if (weathercode === 1) {
    return isDay(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day']
      : iconsNight['partly-cloudy-night'];
  }
  if (weathercode === 2) return iconsDaily['overcast'];
  if (weathercode === 3) return iconsDaily['extreme'];
  if (weathercode === 45) return iconsDaily['fog'];
  if (weathercode === 48) return iconsDaily['haze'];
  if (weathercode === 51) return iconsDaily['drizzle'];
  if (weathercode === 53) return iconsDaily['overcast-drizzle'];
  if (weathercode === 55) return iconsDaily['extreme-drizzle'];
  if (weathercode === 56 || weathercode === 66) return iconsDaily['sleet'];
  if (weathercode === 67 || weathercode === 57)
    return iconsDaily['overcast-sleet'];
  if (weathercode === 61 || weathercode === 63) return iconsDaily['rain'];
  if (weathercode === 65 || weathercode === 80)
    return iconsDaily['overcast-rain'];
  if (weathercode === 81 || weathercode === 82)
    return iconsDaily['extreme-rain'];
  if (weathercode === 71 || weathercode === 73) return iconsDaily['snow'];
  if (weathercode === 75) return iconsDaily['overcast-snow'];
  if (weathercode === 77) return iconsDaily['overcast-hail'];
  if (weathercode === 85 || weathercode === 86)
    return iconsDaily['extreme-snow'];

  if (weathercode === 95 || weathercode === 96)
    return iconsDaily['thunderstorms-overcast-rain'];
  if (weathercode === 99) return iconsDaily['thunderstorms-extreme-rain'];
};
export const getWeatherText = (weathercode, sunrise, sunset, time) => {
  switch (weathercode) {
    case 0:
      return isDay(sunrise, sunset, time) ? 'Sunny' : 'Clear sky';
      break;
    case 1:
      return isDay(sunrise, sunset, time) ? 'Mostly Sunny' : 'Mostly Clear';
      break;
    case 2:
      return isDay(sunrise, sunset, time) ? 'Partly Sunny' : 'Partly Cloudy';
      break;
    case 3:
      return 'Cloudy';
      break;
    case 45:
      return 'Fog';
      break;
    case 48:
      return 'Rime Fog';
      break;
    case 51:
      return 'Light Drizzle';
      break;
    case 53:
      return 'Drizzle';
      break;
    case 55:
      return 'Heavy Drizzle';
      break;
    case 56:
      return 'Freezing drizzle';
      break;
    case 57:
      return 'Heavy Freezing drizzle';
      break;
    case 61:
      return 'Light Rain';
      break;
    case 63:
      return 'Rain';
      break;
    case 65:
      return 'Heavy Rain';
      break;
    case 66:
      return 'Light Freezing Rain';
      break;
    case 67:
      return 'Heavy Freezing Rain';
      break;
    case 71:
      return 'Light Snow';
    case 73:
      return 'Snow';
      break;
    case 75:
      return 'Heavy Snow';
      break;
    case 77:
      return 'Snow Grains';
      break;
    case 80:
      return 'Few Showers';
      break;
    case 81:
      return 'Showers';
      break;
    case 82:
      return 'Heavy Showers';
      break;
    case 85:
      return 'Few Snow Showers';
      break;
    case 86:
      return 'Snow Showers';
      break;
    case 95:
      return 'Thunderstorm';
      break;
    case 96:
      return 'Thunderstorm and Hail';
      break;
    case 99:
      return 'Thunderstorm and Heavy Hail';
      break;
  }
};
export const windyDay = (windspeed, windspeedUnit) => {
  const unit = windspeedUnit.toLowerCase();
  if (unit === 'km/h') {
    if (windspeed > 30) {
      return 'Wind';
    }
    if (windspeed > 125) {
      return 'Hurricane';
    }
  }
  if (unit === 'mp/h') {
    if (windspeed > 24) {
      return 'Wind';
    }
    if (windspeed > 75) {
      return 'Hurricane';
    }
  }
};
export const windDirection = direction => {
  if (direction >= 326 && direction < 349) {
    return 'NNW';
  }

  if (direction >= 304 && direction < 326) {
    return 'NW';
  }

  if (direction >= 281 && direction < 304) {
    return 'WNW';
  }

  if (direction >= 259 && direction < 281) {
    return 'W';
  }

  if (direction >= 236 && direction < 259) {
    return 'WSW';
  }

  if (direction >= 214 && direction < 236) {
    return 'SW';
  }

  if (direction >= 191 && direction < 214) {
    return 'SSW';
  }

  if (direction >= 169 && direction < 191) {
    return 'S';
  }

  if (direction >= 146 && direction < 169) {
    return 'SSE';
  }

  if (direction >= 124 && direction < 146) {
    return 'SE';
  }

  if (direction >= 101 && direction < 124) {
    return 'ESE';
  }

  if (direction >= 79 && direction < 101) {
    return 'E';
  }
  if (direction >= 56 && direction < 79) {
    return 'ENE';
  }
  if (direction >= 34 && direction < 56) {
    return 'NE';
  }
  if (direction >= 11 && direction < 34) {
    return 'NNE';
  }
  if (
    (direction >= 349 && direction < 380) ||
    (direction >= 0 && direction < 11)
  ) {
    return 'N';
  }
};
export const getIconSecondaryCondition = (
  weathercode,
  windspeed,
  windspeedUnit,
  sunrise,
  sunset,
  time
) => {
  if (windyDay(windspeed, windspeedUnit)) {
    return windyDay(windspeed, windspeedUnit).toLowerCase();
  }
  if (weathercode === 0) {
    return isDay(sunrise, sunset, time) ? 'clearday' : 'clearnight';
  }
  if (weathercode === 1 || weathercode === 2 || weathercode === 3)
    return 'cloudy';
  if (weathercode === 45 || weathercode === 48) return 'mist';
  if (
    weathercode === 51 ||
    weathercode === 53 ||
    weathercode === 55 ||
    weathercode === 61 ||
    weathercode === 63 ||
    weathercode === 65 ||
    weathercode === 80 ||
    weathercode === 81 ||
    weathercode === 82
  )
    return 'raindrop';
  if (
    weathercode === 56 ||
    weathercode === 57 ||
    weathercode === 71 ||
    weathercode === 73 ||
    weathercode === 75 ||
    weathercode === 77 ||
    weathercode === 85 ||
    weathercode === 86
  )
    return 'snowflake';
  if (weathercode === 66 || weathercode === 67) return 'hail';
  if (weathercode === 95 || weathercode === 96 || weathercode === 99)
    return 'thunderstorm';
};
export const unitChanger = tempUnit => {
  return tempUnit === '°F' ? 'fahrenheit' : 'celsius';
};
export const relativeHumidity = humidity => {
  if (humidity < 20) {
    return 'Dry';
  }
  if (humidity > 60) {
    return 'Wet';
  }
  return 'Normal';
};
export const addColorStatusTextHumidity = string => {
  if (string.toLowerCase() === 'dry') {
    return '#FFD700';
  }
  if (string.toLowerCase() === 'wet') {
    return '#2F58CD';
  }
  if (string.toLowerCase() === 'normal') {
    return '#539165';
  }
};
export const mphOrKmVisibility = (unit, visibility) => {
  const mph = 0.621371192;
  return unit === '°F'
    ? `${((visibility / 1000) * mph).toFixed(1)} mi`
    : `${(visibility / 1000).toFixed(1)} km`;
};
export const visibilityCondition = (unit, visibility) => {
  if (unit === '°F') {
    if (visibility > 3.1) {
      return 'Clear';
    }
    if (visibility >= 3.1 && visibility <= 0.6) {
      return 'Average';
    }
    if (visibility < 0.6) {
      return 'Poor';
    }
  }
  if (visibility > 5) {
    return 'Clear';
  }
  if (visibility >= 5 && visibility <= 1) {
    return 'Average';
  }
  if (visibility < 1) {
    return 'Poor';
  }
};
export const addColorStatusTextVisibility = string => {
  if (string.toLowerCase() === 'poor') {
    return '#E21818';
  }
  if (string.toLowerCase() === 'avarege') {
    return '#E7B10A';
  }
  if (string.toLowerCase() === 'clear') {
    return '#539165';
  }
};
export const airQualityRanges = aqi => {
  if (aqi > 85) {
    return 'Unhealthy';
  }
  if (aqi >= 55 && aqi <= 85) {
    return 'Moderate';
  }
  if (aqi <= 55) {
    return 'Good';
  }
};
export const addColorStatusTextAqi = string => {
  if (string.toLowerCase() === 'unhealthy') {
    return '#E21818';
  }
  if (string.toLowerCase() === 'moderate') {
    return '#E7B10A';
  }
  if (string.toLowerCase() === 'good') {
    return '#539165';
  }
};
export const getUvindexIcon = uvi => {
  switch (uvi) {
    case 0:
      return uvIndex['uv-index'];
    case 1:
      return uvIndex['uv-index-1'];
    case 2:
      return uvIndex['uv-index-2'];
    case 3:
      return uvIndex['uv-index-3'];
    case 4:
      return uvIndex['uv-index-4'];
    case 5:
      return uvIndex['uv-index-5'];
    case 6:
      return uvIndex['uv-index-6'];
    case 7:
      return uvIndex['uv-index-7'];
    case 8:
      return uvIndex['uv-index-8'];
    case 9:
      return uvIndex['uv-index-9'];
    case 10:
      return uvIndex['uv-index-10'];
    case 11:
      return uvIndex['uv-index-11'];
    default:
      return uvIndex['uv-index'];
  }
};
export const clearHtml = el => {
  el.innerHTML = '';
};
export const clearInput = () => {
  refs.input.value = '';
};
export const showLoader = () => {
  refs.loader.classList.remove('hide');
};
export const hideLoader = () => {
  refs.loader.classList.add('hide');
};
export const getDataInUnit = async unit => {
  if (unit === 'fahrenheit') {
    return ({ hourly, daily, current_weather, hourly_units } =
      await weatherApi.fetchWeatherInFarenheit());
  } else {
    return ({ hourly, daily, current_weather, hourly_units } =
      await weatherApi.fetchWeather());
  }
};
export const renderHourlyDailyWeather = dailyWeather => {
  // console.log(weatherApi.dailyWeather);
  if (!dailyWeather) {
    renderMarkup(
      refs.weatherLights,
      markupDailyWeather(daily, current_weather)
    );
    return;
  }
  renderMarkup(
    refs.weatherLights,
    markupHourlyWeather(hourly, daily, current_weather)
  );
};
