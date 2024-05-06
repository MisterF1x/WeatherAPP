import { Navigation } from 'swiper';

export const errorMessage = Object.freeze({
  INVALID: 'Something went wrong',
  NETWORK_ERROR: 'A network error occurred. Please try again later.',
  GEO_DENIED: 'User denied the request for geolocation.',
  GEO_UNAVAILABLE: 'Location information is unavailable.',
  GEO_TIME_OUT: 'The request to get user location timed out.',
  GEO_UNKONW: 'An unknown error occurred.',
  GEO_NOT: 'Geolocation is not available in this browser.',
});

export const URL = Object.freeze({
  GEO: 'https://api.ipgeolocation.io/ipgeo',
  WEATHER: 'https://api.open-meteo.com/v1/forecast',
  AIR_QUALITY: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  CITY: 'https://geocoding-api.open-meteo.com/v1/search',
  OPEN_STREET: 'https://nominatim.openstreetmap.org/reverse',
});

export const weatherParams = {
  HOURLY:
    'temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m',
  DAILY:
    'weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
};

export const swiperOptions = {
  modules: [Navigation],
  slidesPerView: 6,
  spaceBetween: 2,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    900: {
      spaceBetween: 8,
    },
    500: {
      slidesPerView: 6,
    },
    300: {
      slidesPerView: 4,
    },
  },
};

export const DEBOUNCE_DELAY = 350;
