import {StyleSheet, Text, View} from 'react-native';
import {getWeatherIcon, getWeatherLabel} from '../utilities/getWeatherStatus';
import {SunPositionTracker} from './SunPositionTracker';
import {format, parseISO, addMinutes} from 'date-fns';
import {useEffect, useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const CurrentBox = ({weatherData, searchTerm}: CurrentBoxProps) => {
  const temperature = Math.round(weatherData?.current?.temperature_2m) ?? 'N/A';
  const humidity = Math.round(weatherData?.current?.relative_humidity_2m ?? 0);
  const windSpeed = Math.round(weatherData?.current?.wind_speed_10m ?? 0);
  const weatherIconStatusCode = weatherData?.current?.weather_code ?? 0;
  const generalWeatherCondition = getWeatherLabel(weatherIconStatusCode);
  const generalWeatherIcon = getWeatherIcon(generalWeatherCondition);

  const [incrementingTime, setIncrementingTime] = useState<Date | null>(null);
  const rawTime = weatherData?.current?.time;

  // used to increment the time by 1 minute every 60 seconds even though
  // current time pulled from OpenMateo isn't frequently updated.
  useEffect(() => {
    if (rawTime) {
      const initialTime = parseISO(rawTime);
      setIncrementingTime(initialTime);
      const interval = setInterval(() => {
        setIncrementingTime(previousTime =>
          previousTime ? addMinutes(previousTime, 1) : previousTime,
        );
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [rawTime]);

  const formattedTime = incrementingTime ? format(incrementingTime, 'h:mm a') : null;

  return (
    <View style={styles.currentBox}>
      <View style={styles.topAndBottomContainer}>
        <View style={styles.topBox}>
          <Text style={styles.currentWeatherInText}>Current Weather in:</Text>
          <Text style={styles.searchTerm}>{searchTerm}</Text>
          <Text style={styles.timeStyle}>{formattedTime}</Text>
        </View>

        <View style={styles.middleBox}>
          <View>{generalWeatherIcon}</View>
          <View style={styles.tempAndConditionBox}>
            <Text style={styles.tempText}>{temperature}°F</Text>
            <Text style={styles.conditionText}>{generalWeatherCondition}</Text>
          </View>
        </View>

        <View style={styles.bottomBox}>
          <View style={styles.sunPositionStyle}>
            <SunPositionTracker
              sunriseTime={weatherData?.daily?.sunrise[0]}
              sunsetTime={weatherData?.daily?.sunset[0]}
              currentTime={weatherData?.current?.time}
            />
          </View>
          <View style={styles.humidityBox}>
            <FontAwesome5 name="tint" color="#379EE4" size={25} style={styles.humidityIcon} />
            <Text style={styles.humidityValue}>{humidity} %</Text>
            <Text style={styles.defaultText}>Humidity</Text>
          </View>
          <View style={styles.windSpeedBox}>
            <FontAwesome5 name="wind" color="goldenrod" size={25} style={styles.windIcon} />
            <Text style={styles.defaultText}>{windSpeed} mph </Text>
            <Text style={styles.defaultText}>Wind</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  currentBox: {
    borderWidth: 5,
    borderRadius: 35,
    borderColor: '#4b5e94',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 0,
    backgroundColor: '#4b5e9434',
  },

  topAndBottomContainer: {
    flexDirection: 'column',
  },

  topBox: {
    justifyContent: 'flex-start',
    padding: 20,
  },

  middleBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 25,
  },

  bottomBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 25,
  },

  currentWeatherInText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
  },

  timeStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
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

  sunPositionStyle: {
    width: 130,
    height: 80,
  },

  humidityBox: {
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    fontSize: 18,
  },

  humidityIcon: {
    paddingBottom: 5,
  },

  humidityValue: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 4,
  },

  windSpeedBox: {
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    fontSize: 18,
  },

  windIcon: {
    paddingBottom: 5,
  },

  defaultText: {
    color: 'white',
    fontSize: 18,
  },

  error: {
    color: 'red',
    fontSize: 16,
  },
});

type CurrentBoxProps = {
  weatherData: WeatherData;
  searchTerm: string;
};

type WeatherData = {
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
    sunrise: string;
    sunset: string;
  };
};
