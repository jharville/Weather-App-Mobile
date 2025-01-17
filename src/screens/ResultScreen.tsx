import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {MainStackScreenProps} from '../navigation/types/navigation.types';
import {LinearGradient} from 'react-native-gradients';
import {CurrentBox} from '../components/CurrentBox';
import {ActivityIndicator} from 'react-native';
import {ForecastBox} from '../components/ForecastBox';
import {getWeatherLabel} from '../utilities/getWeatherStatus';
import {SummaryChart} from '../components/SummaryChart';
import {UVBox} from '../components/UVBox';

export enum LoadingStatuses {
  Idle = 'Idle',
  Loading = 'Loading',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

export const ResultScreen = ({route}: MainStackScreenProps<'ResultScreen'>) => {
  const searchTerm = route.params?.searchTerm ?? '';
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatuses>(LoadingStatuses.Idle);
  const [weatherFetchError, setWeatherFetchError] = useState<string | null>(null);
  const [dayClickedIndex, setDayClickedIndex] = useState(0);

  // #region Weather Fetch Logic
  const fetchWeatherData = async (
    cityName: string,
    setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>,
    setLoadingStatus: React.Dispatch<React.SetStateAction<LoadingStatuses>>,
    setWeatherFetchError: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    try {
      setLoadingStatus(LoadingStatuses.Loading);

      // Fetch geolocation data
      const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`,
      );
      const geoData = await geoResponse.json();

      if (!geoData.length) {
        throw new Error('City not found. Please check the city name.');
      }

      const {lat, lon} = geoData[0];

      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=14&timezone=auto&timestamp=${Date.now()}`,
      );
      const weatherData = await weatherResponse.json();

      setWeatherData(weatherData);
      setLoadingStatus(LoadingStatuses.Fulfilled);
    } catch (error: any) {
      setWeatherData(null);
      setWeatherFetchError(error.message || 'Failed to fetch data.');
      setLoadingStatus(LoadingStatuses.Rejected);
    }
  };
  // #endregion Weather Fetch Logic

  // sets the initial highlighted forecast date
  const handleDayClick = useCallback((index: number) => {
    setDayClickedIndex(index);
  }, []);

  // For displaying only the city and country/city returned from the autofill.
  // city and country are simply what we are calling the parts of the suggestion that gets split up by the following code.
  const [city, country] = (() => {
    const parts = searchTerm.split(',').map(part => part.trim());
    if (parts.length === 1) {
      return [parts[0]]; // If there is only one part, it's assumed to be the city, with no country.
    } else if (parts.length > 2) {
      return [parts[0], parts[2]]; // If there are more than two parts, the third part is considered the country.
    } else {
      return [parts[0], parts[1]]; // If there are exactly two parts, the second part is considered the country or state.
    }
  })();

  const formattedSearchTerm = country ? `${city}, ${country}` : city;

  useEffect(() => {
    if (formattedSearchTerm) {
      fetchWeatherData(searchTerm, setWeatherData, setLoadingStatus, setWeatherFetchError);
    }
  }, [formattedSearchTerm]);

  const weatherIconStatusCode = weatherData?.current?.weather_code ?? 0;
  const generalWeatherCondition = getWeatherLabel(weatherIconStatusCode);

  const formattedUV = Math.round(weatherData?.daily?.uv_index_max[0] ?? 0);
  const formattedSunHours = Math.round((weatherData?.daily?.sunshine_duration[0] ?? 0) / 3600);

  return (
    <>
      <View style={styles.resultBackgroundGradiant}>
        <LinearGradient colorList={gradientColors} angle={90} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <Text style={styles.error}>{weatherFetchError}</Text>
          {loadingStatus === LoadingStatuses.Loading ? (
            <ActivityIndicator size={40} color={'white'} />
          ) : (
            <View style={styles.componentsContainer}>
              <CurrentBox
                weatherData={weatherData}
                generalWeatherCondition={generalWeatherCondition}
                searchTerm={formattedSearchTerm}
              />
              <SummaryChart
                weatherCode={weatherData?.hourly?.weather_code || []}
                rain={weatherData?.hourly?.precipitation_probability || []}
                temps={weatherData?.hourly?.temperature_2m || []}
                forecastDate={weatherData?.daily?.time || []}
                dayClickedIndex={dayClickedIndex}
                setDayClickedIndex={setDayClickedIndex}
              />
              <ForecastBox
                generalWeatherCondition={generalWeatherCondition}
                WeatherCode={weatherData?.daily?.weather_code || []}
                minTemp={weatherData?.daily?.temperature_2m_min || []}
                maxTemp={weatherData?.daily?.temperature_2m_max || []}
                forecastDates={weatherData?.daily?.time || []}
                onDaySelect={handleDayClick}
              />

              <UVBox uvValue={formattedUV} sunDuration={formattedSunHours} />
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  resultBackgroundGradiant: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },

  mainContainer: {
    paddingHorizontal: 15,
    gap: 15,
  },

  componentsContainer: {
    gap: 15,
  },

  error: {
    color: 'red',
    fontSize: 16,
  },
});

const gradientColors = [
  {offset: '0%', color: '#0a0a22', opacity: '1'},
  {offset: '100%', color: '#0e143e', opacity: '1'},
];

export type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    time: string;
  };

  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    uv_index_max: number[];
    sunshine_duration: number[];
    weather_code: number[];
    time: string[];
    sunrise: number[];
    sunset: number[];
  };

  hourly: {
    weather_code: number[];
    precipitation_probability: number[];
    temperature_2m: number[];
  };
};
