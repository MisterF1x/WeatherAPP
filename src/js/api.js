import axios from 'axios';
const GEO_URL = 'https://ipgeolocation.abstractapi.com/v1';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const CITY_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export default class WeatherApi {
  constructor() {
    this.long = 0;
    this.lat = 0;
    this.timezone = 'auto';
    this.city = '';
    this.copySearchedCity = [];
    this.weatherUnit = '';
    this.dailyWeather = false;
  }
  async setGeolocation() {
    const options = {
      params: {
        api_key: '0a99fae2ae7f4897b5e4f52e3a19db1e',
        fields: 'latitude,longitude,timezone,city,country_code',
      },
    };
    const { data } = await axios(GEO_URL, options);
    this.long = data.longitude;
    this.lat = data.latitude;
    this.city = data.city;
    if (data.country_code === 'UA') {
      this.timezone = 'Europe/Kiev';
    }
  }
  async fetchWeather() {
    const options = {
      params: {
        latitude: this.lat,
        longitude: this.long,
        current_weather: 'true',
        daily:
          'weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max',
        hourly:
          'temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m',
        timezone: this.timezone,
      },
    };
    const { data } = await axios(WEATHER_URL, options);
    return data;
  }
  async fetchWeatherInFarenheit() {
    const options = {
      params: {
        latitude: this.lat,
        longitude: this.long,
        current_weather: 'true',
        daily:
          'weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max',
        hourly:
          'temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m',
        timezone: this.timezone,
        temperature_unit: 'fahrenheit',
        windspeed_unit: 'mph',
      },
    };
    const { data } = await axios(WEATHER_URL, options);
    return data;
  }
  async fetchAirQuality() {
    const options = {
      params: {
        latitude: this.lat,
        longitude: this.long,
        hourly: 'european_aqi,us_aqi',
        timezone: this.timezone,
      },
    };
    const { data } = await axios(AIR_QUALITY_URL, options);
    return data;
  }
  async setFarenheitUnit() {
    const options = {
      params: {
        latitude: this.lat,
        longitude: this.long,
        current_weather: 'true',
        daily:
          'weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max',
        hourly:
          'temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m',
        timezone: this.timezone,
        temperature_unit: 'fahrenheit',
        windspeed_unit: 'mph',
      },
    };
    const { data } = await axios(WEATHER_URL, options);
    return data;
  }
  async fetchCities(name) {
    const options = {
      params: {
        name: name,
      },
    };
    const { data } = await axios(CITY_URL, options);
    return data;
  }
  async getCityFromCoordinates() {
    const URL = `https://nominatim.openstreetmap.org/reverse`;
    const options = {
      params: {
        format: 'jsonv2',
        lat: this.lat,
        lon: this.long,
      },
      headers: {
        'accept-language': 'en',
      },
    };
    const { data } = await axios.get(URL, options);

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet;

    this.city = city;
    if (data.address.country_code === 'ua') {
      this.timezone = 'Europe/Kiev';
    }
  }
  resetTimezone() {
    this.timezone = 'auto';
  }
  get latitude() {
    return this.lat;
  }
  set latitude(newLatitude) {
    this.lat = newLatitude;
  }
  get longitude() {
    return this.long;
  }
  set longitude(newLongitude) {
    this.long = newLongitude;
  }
  resetdailyWeather() {
    this.dailyWeather = false;
  }
}
