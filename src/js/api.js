import axios from 'axios';
import { URL, errorMessage, weatherParams } from './constants';

export class GeolocationApi {
  async getGeolocationByApi() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude } = position.coords;
            const { longitude } = position.coords;
            try {
              const data = await this.getCityByCoordinates(latitude, longitude);
              resolve({ latitude, longitude, ...data });
            } catch (error) {
              reject(error);
            }
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject(new Error(errorMessage.GEO_NOT));
      }
    });
  }
  async getGeolocationByIp() {
    const options = {
      params: {
        api_key: '0a99fae2ae7f4897b5e4f52e3a19db1e',
        fields: 'latitude,longitude,timezone,city,country_code',
      },
    };
    const {
      data: { longitude, latitude, city, country_code },
    } = await axios(URL.GEO, options);
    return { longitude, latitude, city, country_code };
  }
  async getCityByCoordinates(latitude, longitude) {
    const options = {
      params: {
        format: 'jsonv2',
        lat: latitude,
        lon: longitude,
      },
      headers: {
        'accept-language': 'en',
      },
    };
    const { data } = await axios(URL.OPEN_STREET, options);

    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.hamlet;
    return { city, country_code: data.address.country_code };
  }
  async getGeolocation() {
    try {
      return await this.getGeolocationByApi();
    } catch (error) {
      return await this.getGeolocationByIp();
    }
  }
}

export class WeatherApi extends GeolocationApi {
  constructor() {
    super();
  }
  async getWeather(latitude, longitude, countryCode, weatherUnit) {
    this.timezone =
      countryCode?.toLowerCase() === 'ua' ? 'Europe/Kiev' : 'auto';
    const options =
      weatherUnit === 'celsius'
        ? {
            params: {
              latitude,
              longitude,
              current_weather: 'true',
              daily: weatherParams.DAILY,
              hourly: weatherParams.HOURLY,
              timezone: this.timezone,
            },
          }
        : {
            params: {
              latitude,
              longitude,
              current_weather: 'true',
              daily: weatherParams.DAILY,
              hourly: weatherParams.HOURLY,
              timezone: this.timezone,
              temperature_unit: 'fahrenheit',
              windspeed_unit: 'mph',
            },
          };
    const { data } = await axios(URL.WEATHER, options);
    return data;
  }
  async getAirQuality(latitude, longitude) {
    const options = {
      params: {
        latitude,
        longitude,
        hourly: 'european_aqi,us_aqi',
        timezone: this.timezone,
      },
    };
    const { data } = await axios(URL.AIR_QUALITY, options);
    return data;
  }
  async init(unit = 'celsius') {
    const { latitude, longitude, countryCode, city } =
      await this.getGeolocation();
    const weatherData = await this.getWeather(
      latitude,
      longitude,
      countryCode,
      unit
    );
    const airQualityData = await this.getAirQuality(latitude, longitude);

    return {
      ...weatherData,
      airData: { ...airQualityData },
      city,
      countryCode,
    };
  }
}

export class CitiesApi {
  constructor() {
    this.data = [];
  }
  async getCities(name) {
    const options = {
      params: {
        name,
      },
    };
    const {
      data: { results },
    } = await axios(URL.CITY, options);
    this.data = results;
  }
  get cities() {
    return this.cities;
  }

  set cities(value) {
    this.cities = value;
  }
}
