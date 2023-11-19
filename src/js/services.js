import * as iconsDay from '../assets/images/fill/svg-static/day/*.svg';
import * as iconsNight from '../assets/images/fill/svg-static/night/*.svg';
import * as iconsDaily from '../assets/images/fill/svg-static/daily-icons/*.svg';
import * as uvIndex from '../assets/images/fill/svg-static/uv-index/*.svg';
import { refs } from './refs';
import { errorMessage } from './constants';
import { format, parseISO } from 'date-fns';

// ---Weather services
const getDayOrNight = (sunrise, sunset, localTime) => {
  const timeSunrise = new Date(sunrise).getHours();
  const timeSunset = new Date(sunset).getHours();
  const currentTime = new Date(localTime).getHours();
  return currentTime >= timeSunrise && currentTime <= timeSunset;
};

export const getIconWeather = (
  weathercode,
  sunrise,
  sunset,
  cloudcover,
  time
) => {
  if (weathercode === 0) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['clear-day']
      : iconsNight['clear-night'];
  }
  if (weathercode === 1) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day']
      : iconsNight['partly-cloudy-night'];
  }
  if (weathercode === 2) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['overcast-day']
      : iconsNight['overcast-night'];
  }
  if (weathercode === 3) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['extreme-day']
      : iconsNight['extreme-night'];
  }
  if (weathercode === 45) {
    if (getDayOrNight(sunrise, sunset, time)) {
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
    if (getDayOrNight(sunrise, sunset, time)) {
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
    if (getDayOrNight(sunrise, sunset, time)) {
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
    if (getDayOrNight(sunrise, sunset, time)) {
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
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day-rain']
      : iconsNight['partly-cloudy-night-rain'];
  }
  if (weathercode === 63 || weathercode === 81) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['overcast-day-rain']
      : iconsNight['overcast-night-rain'];
  }
  if (weathercode === 65 || weathercode === 82) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['extreme-day-rain']
      : iconsNight['extreme-night-rain'];
  }
  if (weathercode === 66 || weathercode === 67) {
    if (getDayOrNight(sunrise, sunset, time)) {
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
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['partly-cloudy-day-snow']
      : iconsNight['partly-cloudy-night-snow'];
  }
  if (weathercode === 73) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['overcast-day-snow']
      : iconsNight['overcast-night-snow'];
  }
  if (weathercode === 75 || weathercode === 77 || weathercode === 86) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['extreme-day-snow']
      : iconsNight['extreme-night-snow'];
  }
  if (weathercode === 95 || weathercode === 96) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['thunderstorms-day-overcast-rain']
      : iconsNight['thunderstorms-night-overcast-rain'];
  }
  if (weathercode === 99) {
    return getDayOrNight(sunrise, sunset, time)
      ? iconsDay['thunderstorms-day-extreme-rain']
      : iconsNight['thunderstorms-night-extreme-rain'];
  }
};
export const getIconDailyWeather = (weathercode, sunrise, sunset, time) => {
  const isDay = getDayOrNight(sunrise, sunset, time);

  const iconMap = {
    0: isDay ? iconsDay['clear-day'] : iconsNight['clear-night'],
    1: isDay
      ? iconsDay['partly-cloudy-day']
      : iconsNight['partly-cloudy-night'],
    2: iconsDay['overcast-day'],
    3: iconsDay['extreme-day'],
    45: iconsDaily['fog'],
    48: iconsDaily['haze'],
    51: iconsDay['partly-cloudy-day-drizzle'],
    53: iconsDay['overcast-day-drizzle'],
    55: iconsDaily['extreme-drizzle'],
    56: iconsDay['partly-cloudy-day-sleet'],
    57: iconsDay['overcast-day-sleet'],
    61: iconsDay['partly-cloudy-day-rain'],
    63: iconsDaily['rain'],
    65: iconsDaily['overcast-rain'],
    66: iconsDaily['sleet'],
    67: iconsDaily['overcast-sleet'],
    71: iconsDay['partly-cloudy-day-snow'],
    73: iconsDaily['snow'],
    75: iconsDay['overcast-day-snow'],
    77: iconsDaily['overcast-hail'],
    80: iconsDaily['overcast-rain'],
    81: iconsDaily['extreme-rain'],
    82: iconsDaily['extreme-rain'],
    85: iconsDaily['extreme-snow'],
    86: iconsDaily['extreme-snow'],
    95: iconsDaily['thunderstorms-overcast-rain'],
    96: iconsDaily['thunderstorms-overcast-rain'],
    99: iconsDaily['thunderstorms-extreme-rain'],
  };

  const weatherIcon = iconMap[weathercode];
  return weatherIcon;
};
export const getWeatherText = (weathercode, sunrise, sunset, time) => {
  switch (weathercode) {
    case 0:
      return getDayOrNight(sunrise, sunset, time) ? 'Sunny' : 'Clear sky';
    case 1:
      return getDayOrNight(sunrise, sunset, time)
        ? 'Mostly Sunny'
        : 'Mostly Clear';
    case 2:
      return getDayOrNight(sunrise, sunset, time)
        ? 'Partly Sunny'
        : 'Partly Cloudy';
    case 3:
      return 'Cloudy';
    case 45:
      return 'Fog';
    case 48:
      return 'Rime Fog';
    case 51:
      return 'Light Drizzle';
    case 53:
      return 'Drizzle';
    case 55:
      return 'Heavy Drizzle';
    case 56:
      return 'Freezing drizzle';
    case 57:
      return 'Heavy Freezing drizzle';
    case 61:
      return 'Light Rain';
    case 63:
      return 'Rain';
    case 65:
      return 'Heavy Rain';
    case 66:
      return 'Light Freezing Rain';
      break;
    case 67:
      return 'Heavy Freezing Rain';
    case 71:
      return 'Light Snow';
    case 73:
      return 'Snow';
    case 75:
      return 'Heavy Snow';
    case 77:
      return 'Snow Grains';
    case 80:
      return 'Few Showers';
    case 81:
      return 'Showers';
    case 82:
      return 'Heavy Showers';
    case 85:
      return 'Few Snow Showers';
    case 86:
      return 'Snow Showers';
    case 95:
      return 'Thunderstorm';
    case 96:
      return 'Thunderstorm and Hail';
    case 99:
      return 'Thunderstorm and Heavy Hail';
  }
};
export const windyDay = (windspeed, windspeedUnit) => {
  const speedLimits = {
    'km/h': { wind: 30, hurricane: 125 },
    'mp/h': { wind: 24, hurricane: 75 },
  };

  const unit = windspeedUnit.toLowerCase();
  const limits = speedLimits[unit];

  if (windspeed > limits.wind) {
    return 'Wind';
  }
  if (windspeed > limits.hurricane) {
    return 'Hurricane';
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
    return 'wind';
  }
  switch (weathercode) {
    case 0:
      return getDayOrNight(sunrise, sunset, time) ? 'clearday' : 'clearnight';
    case 1:
    case 2:
    case 3:
      return 'cloudy';
    case 45:
    case 48:
      return 'mist';
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return 'raindrop';
    case 56:
    case 57:
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return 'snowflake';
    case 66:
    case 67:
      return 'hail';
    case 95:
    case 96:
    case 99:
      return 'thunderstorm';
    default:
      return 'cloudy';
  }
};
export const relativeHumidity = humidity => {
  if (humidity < 20) {
    return { humidityStatus: 'Dry', humidityColor: '#FFD700' };
  }
  if (humidity > 60) {
    return { humidityStatus: 'Wet', humidityColor: '#2F58CD' };
  }
  return { humidityStatus: 'Normal', humidityColor: '#539165' };
};
export const mphOrKmVisibility = (unit, visibility) => {
  const mph = 0.621371192;
  const distance =
    unit === '°F' ? (visibility / 1000) * mph : visibility / 1000;
  return `${distance.toFixed(1)} ${unit === '°F' ? 'mi' : 'km'}`;
};
export const getVisibilityCondition = (unit, visibility) => {
  if (unit === '°F') {
    if (visibility > 3) {
      return { visibilityStatus: 'Clear', visibilityColor: '#539165' };
    }
    if (visibility >= 3 && visibility <= 0.5) {
      return { visibilityStatus: 'Average', visibilityColor: '#E7B10A' };
    }
    if (visibility < 0.5) {
      return { visibilityStatus: 'Poor', visibilityColor: '#E21818' };
    }
  }
  if (visibility > 5) {
    return { visibilityStatus: 'Clear', visibilityColor: '#539165' };
  }
  if (visibility >= 5 && visibility <= 1) {
    return { visibilityStatus: 'Average', visibilityColor: '#E7B10A' };
  }
  if (visibility < 1) {
    return { visibilityStatus: 'Poor', visibilityColor: '#E21818' };
  }
};
export const getAirQualityStatus = aqi => {
  if (aqi > 150) {
    return { airQualityStatus: 'Unhealthy', airQualityColor: '#E21818' };
  }
  if (aqi >= 60 && aqi <= 150) {
    return { airQualityStatus: 'Moderate', airQualityColor: '#E7B10A' };
  }
  if (aqi <= 60) {
    return { airQualityStatus: 'Good', airQualityColor: '#539165' };
  }
};
export const getUvindexIcon = (uvi = 0) => {
  const uvIndexMap = {
    0: uvIndex['uv-index'],
    1: uvIndex['uv-index-1'],
    2: uvIndex['uv-index-2'],
    3: uvIndex['uv-index-3'],
    4: uvIndex['uv-index-4'],
    5: uvIndex['uv-index-5'],
    6: uvIndex['uv-index-6'],
    7: uvIndex['uv-index-7'],
    8: uvIndex['uv-index-8'],
    9: uvIndex['uv-index-9'],
    10: uvIndex['uv-index-10'],
    11: uvIndex['uv-index-11'],
  };

  return uvIndexMap[uvi] || uvIndex['uv-index'];
};

//---Helpers
export const closestDate = (dates, targetDate) =>
  dates.reduce((prev, curr) => {
    const prevDiff = Math.abs(new Date(prev) - new Date(targetDate));
    const currDiff = Math.abs(new Date(curr) - new Date(targetDate));
    return currDiff < prevDiff ? curr : prev;
  });

export const getURLHash = () => document.location.hash.slice(1);

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

export const checkGeoError = error => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.error(errorMessage.GEO_DENIED);
      break;
    case error.POSITION_UNAVAILABLE:
      console.error(errorMessage.GEO_UNAVAILABLE);
      break;
    case error.TIMEOUT:
      console.error(errorMessage.GEO_TIME_OUT);
      break;
    default:
      console.error(errorMessage.GEO_UNKONW);
  }
};

// ---Transforming Data
export const transformDataForMainCard = (
  hourly,
  daily,
  current_weather,
  hourly_units,
  city,
  index
) => {
  const parsedTime = parseISO(current_weather.time);

  const precipitation = !hourly?.precipitation_probability[index]
    ? 'No Precipitation'
    : `${hourly.precipitation_probability[index]}%`;

  const windy = windyDay(
    hourly.windspeed_10m[index],
    hourly_units['windspeed_10m']
  )
    ? `/${windyDay(hourly.windspeed_10m[index], hourly_units['windspeed_10m'])}`
    : '';
  const icon = getIconWeather(
    hourly.weathercode[index],
    daily.sunrise[0],
    daily.sunset[0],
    hourly.cloudcover[index],
    current_weather.time
  );
  const text = getWeatherText(
    hourly.weathercode[index],
    daily.sunrise[0],
    daily.sunset[0],
    current_weather.time
  );
  const iconSecondary = getIconSecondaryCondition(
    hourly.weathercode[index],
    hourly.windspeed_10m[index],
    hourly_units['windspeed_10m'],
    daily.sunrise[0],
    daily.sunset[0],
    current_weather.time
  );
  const temperature = Math.round(hourly.temperature_2m[index]);
  const fillTemperature = Math.round(hourly.apparent_temperature[index]);

  return {
    icon,
    iconSecondary,
    text,
    parsedTime,
    windy,
    precipitation,
    temperature,
    fillTemperature,
    city,
    temperatureUnit: hourly_units.temperature_2m,
  };
};

export const transformDataForDailyHourlyCard = (
  hourly,
  daily,
  current_weather,
  type,
  index
) => {
  const length = type.toLowerCase() !== 'today' ? daily?.time.length : 25;
  return Array.from({ length }).map((_, i) => {
    return {
      icon:
        type.toLowerCase() !== 'today'
          ? getIconDailyWeather(
              daily.weathercode[i],
              daily.sunrise[0],
              daily.sunset[0],
              current_weather.time
            )
          : getIconWeather(
              hourly.weathercode[i + index],
              daily.sunrise[0],
              daily.sunset[0],
              hourly.cloudcover[i + index],
              hourly.time[i + index]
            ),
      text:
        type.toLowerCase() !== 'today'
          ? getWeatherText(
              daily.weathercode[i],
              daily.sunrise[0],
              daily.sunset[0],
              current_weather.time
            )
          : getWeatherText(
              hourly.weathercode[i + index],
              daily.sunrise[0],
              daily.sunset[0],
              hourly.time[i + index]
            ),
      time:
        type.toLowerCase() !== 'today'
          ? format(parseISO(daily.time[i]), 'd iii')
          : format(parseISO(hourly.time[i + index]), 'h aaa'),
      temperatureM: {
        temp:
          type.toLowerCase() !== 'today'
            ? Math.round(daily.temperature_2m_max[i])
            : Math.round(hourly.temperature_2m[i + index]),
        title:
          type.toLowerCase() !== 'today'
            ? 'Max temperature'
            : 'Current temperature',
      },
      temperatureH: {
        temp:
          type.toLowerCase() !== 'today'
            ? Math.round(daily.temperature_2m_min[i])
            : Math.round(hourly.apparent_temperature[i + index]),
        title:
          type.toLowerCase() !== 'today'
            ? 'Min temperature'
            : 'Fills temperature',
      },
    };
  });
};
