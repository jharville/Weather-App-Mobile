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
import {MapDisplay} from '../components/MapDisplay';
import {SearchCity} from '../components/SearchCity';
import {HeaderBackButton} from '../navigation/HeaderComponents/HeaderBackButton';
import {FooterSearchIcon} from '../navigation/FooterComponents/FooterSearchIcon';
import {isIOS} from '../constants.ts';

export enum LoadingStatuses {
  Idle = 'Idle',
  Loading = 'Loading',
  Fulfilled = 'Fulfilled',
  Rejected = 'Rejected',
}

export const ResultScreen = ({route, navigation}: MainStackScreenProps<'ResultScreen'>) => {
  const searchTerm = route.params?.searchTerm ?? '';
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatuses>(LoadingStatuses.Idle);
  const [weatherFetchError, setWeatherFetchError] = useState<string | null>(null);
  const [dayClickedIndex, setDayClickedIndex] = useState(0);
  const [userTextInput, setUserTextInput] = useState('');
  const [searchVisibility, setSearchVisibility] = useState(false);

  const handleSearch = useCallback(() => {
    navigation.setParams({
      searchTerm: userTextInput,
    });
    setUserTextInput('');
  }, [userTextInput]);

  const handleSuggestionSearch = useCallback(
    (suggestion: string) => {
      setUserTextInput('');
      navigation.setParams({
        searchTerm: suggestion,
      });
    },
    [navigation],
  );

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

      const weatherResponse = await fetch(
        // Fetch from WeatherApp_Backend
        `https://weatherapp-backend-188594537255.us-central1.run.app/api/getOpenMeteoWeather?lat=${lat}&lon=${lon}`,
      );

      const weatherData = await weatherResponse.json();
      setWeatherData(weatherData.data);
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

      {/* Loading Icon */}
      {loadingStatus === LoadingStatuses.Loading ? (
        <>
          <View style={styles.loadingIconsContainer}>
            <Text style={styles.error}>{weatherFetchError}</Text>
            <Text style={styles.loadingText}>Beep Boop Beep...</Text>
            <ActivityIndicator color="white" size={isIOS ? 'large' : 50} />
          </View>
        </>
      ) : (
        <>
          {/* Search Bar */}
          {searchVisibility && (
            <View style={styles.searchBar}>
              <SearchCity
                userTextInput={userTextInput}
                setUserTextInput={setUserTextInput}
                handleSearch={handleSearch}
                handleSuggestionClick={handleSuggestionSearch}
              />
            </View>
          )}

          <View style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.componentsContainer}>
                <CurrentBox
                  weatherData={weatherData}
                  generalWeatherCondition={generalWeatherCondition}
                  searchTerm={formattedSearchTerm}
                />
                <MapDisplay userSearchedCity={searchTerm} />
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
            </ScrollView>
          </View>

          {/* Footer */}
          <View style={isIOS ? styles.IOSfooter : styles.androidFooter}>
            <FooterSearchIcon onPressIcon={() => setSearchVisibility(!searchVisibility)} />
            <HeaderBackButton canGoBack={true} />
          </View>
        </>
      )}
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

  loadingIconsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: 15,
  },
  loadingText: {
    color: 'white',
    fontSize: 30,
  },

  searchBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2a2e4a',
  },

  mainContainer: {
    flex: 1,
    gap: 15,
  },

  componentsContainer: {
    gap: 15,
    paddingBottom: 15,
    paddingTop: 15,
  },

  error: {
    color: 'red',
    fontSize: 16,
  },

  IOSfooter: {
    flexDirection: 'row',
    paddingHorizontal: 120,
    paddingBottom: 15,
    height: 80,
    backgroundColor: '#1e2c56',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  androidFooter: {
    flexDirection: 'row',
    paddingHorizontal: 120,
    height: 60,
    backgroundColor: '#1e2c56',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footerText: {
    color: 'white',
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
