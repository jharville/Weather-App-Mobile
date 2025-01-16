import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {MainStackScreenProps} from '../navigation/types/navigation.types';
import {LinearGradient} from 'react-native-gradients';
import {CurrentBox} from '../components/CurrentBox';
import {ActivityIndicator} from 'react-native';
import {LoadingStatuses} from '../utilities/useWeatherFetch';
import {ForecastBox} from '../components/ForecastBox';
import {getWeatherLabel} from '../utilities/getWeatherStatus';
import {SummaryChart} from '../components/SummaryChart';
import {UVBox} from '../components/UVBox';

// #region Weather Fetch Logic
const weatherFetch = async (cityName: string) => {
  try {
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`,
    );

    const geoData = await geoResponse.json();
    if (!geoData.length) {
      throw new Error('City not found. Please check the city name.');
    }

    const {lat, lon} = geoData[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&forecast_days=14&timezone=auto&timestamp=${Date.now()}`,
    );

    const weatherData = await weatherResponse.json();
    return {weather: weatherData, error: null};
  } catch (error: any) {
    return {weather: null, error: error.message};
  }
};
// #endregion Weather Fetch Logic

export const ResultScreen = ({route}: MainStackScreenProps<'ResultScreen'>) => {
  const [weather, setWeather] = useState<any | null>(null);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatuses>(LoadingStatuses.Idle);

  const [weatherFetchError, setWeatherFetchError] = useState<string | null>(null);

  const searchTerm = route.params?.searchTerm ?? '';

  // sets the initial highlighted forecast date
  const [dayClickedIndex, setDayClickedIndex] = useState(0);

  const handleDayClick = useCallback((index: number) => {
    setDayClickedIndex(index);
  }, []);

  //For displaying only the city and country/city returned from the autofill.
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

  const formattedSearchTerm = country && city ? `${city}, ${country}` : city;

  const fetchWeatherData = useCallback(async () => {
    try {
      const {weather, error} = await weatherFetch(searchTerm);
      if (error) {
        throw new Error(error);
      }
      setWeather(weather);
      setLoadingStatus(LoadingStatuses.Fulfilled);
    } catch (error) {
      setWeatherFetchError('An unknown error occurred');
      setLoadingStatus(LoadingStatuses.Rejected);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm) {
      fetchWeatherData();
    }
  }, [searchTerm, fetchWeatherData]);

  const weatherIconStatusCode = weather?.current?.weather_code ?? 0;
  const generalWeatherCondition = getWeatherLabel(weatherIconStatusCode);

  const formattedUV = Math.round(weather?.daily?.uv_index_max[0]);
  const formattedSunHours = Math.round(weather?.daily?.sunshine_duration[0] / 3600);
  return (
    <>
      <View style={styles.resultBackgroundGradiant}>
        <LinearGradient colorList={gradientColors} angle={90} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <Text style={styles.error}>{weatherFetchError}</Text>
          {loadingStatus === 'Loading' ? (
            // ActivityIndicator is a loading icon
            <ActivityIndicator size={40} color={'white'} />
          ) : (
            <View style={styles.componentsContainer}>
              <CurrentBox
                weatherData={weather}
                generalWeatherCondition={generalWeatherCondition}
                searchTerm={formattedSearchTerm}
              />
              <ForecastBox
                generalWeatherCondition={generalWeatherCondition}
                WeatherCode={weather?.daily?.weather_code}
                minTemp={weather?.daily?.temperature_2m_min}
                maxTemp={weather?.daily?.temperature_2m_max}
                forecastDates={weather?.daily?.time || []}
                onDaySelect={handleDayClick}
              />

              <SummaryChart
                loadingStatus={loadingStatus}
                weatherCode={weather?.hourly?.weather_code}
                rain={weather?.hourly?.precipitation_probability}
                temps={weather?.hourly?.temperature_2m || []}
                forecastDate={weather?.daily?.time}
                dayClickedIndex={dayClickedIndex}
                setDayClickedIndex={setDayClickedIndex}
              />

              <UVBox
                uvValue={formattedUV}
                sunDuration={formattedSunHours}
                loadingStatus={undefined}
              />
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

  topAndBottomContainer: {
    flexDirection: 'column',
  },

  topBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 25,
  },

  bottomBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 25,
  },

  tempAndConditionBox: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  conditionText: {
    color: 'white',
    fontSize: 24,
  },

  searchTerm: {
    color: 'white',
    fontSize: 24,
  },

  tempText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 48,
  },

  text: {
    color: 'white',
    fontSize: 18,
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
