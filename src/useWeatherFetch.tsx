import {useState, useCallback} from 'react';

// export const loadingStatuses = {
//   idle: 'idle',
//   loading: 'loading',
//   fulfilled: 'fulfilled',
//   rejected: 'no Data found',
// };

/**
 * useWeatherFetch is a custom hook for fetching weather variables from the Open Mateo API.
 * This destructured hook returns the following values:
 *
weather:
Type: Object or Null.
Description: Contains the weather data retrieved from the API. Initially, it's null before any data is fetched.
Once data is fetched successfully, it holds the weather data structure returned from the Open Meteo API.

fetchWeather:
Type: Function.
Description: A function that takes a cityName as an argument and initiates the process of fetching weather data for that city.
This function performs the API requests to retrieve geographical coordinates and weather data, handles errors, and updates the states accordingly.

weatherFetchError:
Type: String or Null.
Description: Contains an error message if an error occurs during the fetch operation.
It is null if no errors occur or if the weather data is successfully fetched.

loadingStatus:
Type: String.
Description: Indicates the current status of the fetching operation. It can be one of the following:
Idle: No fetch operation is currently in progress.
Loading: The fetch operation is in progress.
Fulfilled: The fetch operation has completed, either successfully or with an error.
 */

type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

export enum LoadingStatuses {
  Idle = 'Idle',
  Loading = 'Loading',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

export const useWeatherFetch = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherFetchError, setWeatherFetchError] = useState<string | null>(
    null,
  );
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatuses.Idle);

  const fetchWeather = useCallback(async (cityName: string) => {
    setWeatherFetchError(null);
    setLoadingStatus(LoadingStatuses.Loading);

    try {
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`,
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
      );

      const geoData = await geoResponse.json();

      if (!geoData.length) {
        setWeatherFetchError('City not found. Please check the city name.');
        setLoadingStatus(LoadingStatuses.Rejected);
        return;
      }

      const {lat, lon} = geoData[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=14&timezone=auto`,
      );

      const weatherData: WeatherData = await weatherResponse.json();
      setWeather(weatherData);
      setLoadingStatus(LoadingStatuses.Fulfilled);
    } catch (error) {
      setWeather(null);
      setWeatherFetchError(
        'Failed to fetch data. Check your internet connection.',
      );
      setLoadingStatus(LoadingStatuses.Rejected);
    }
  }, []);
  // why was isRejected in the dependancy array?

  return {weather, fetchWeather, weatherFetchError, loadingStatus};
};
