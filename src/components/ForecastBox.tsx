import React, {useState, useRef, useCallback} from 'react';
import {View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Button} from 'react-native';
import {format, parseISO} from 'date-fns';
import {getWeatherLabel, getWeatherIcon, WeatherStatuses} from '../utilities/getWeatherStatus';
import {LoadingStatuses} from '../utilities/useWeatherFetch';

const daySpanOptions = {
  7: 7,
  14: 14,
};

const ItemSeparatorComponent = () => {
  return <View style={styles.itemSeparator} />;
};

export const ForecastBox = ({
  WeatherCode,
  maxTemp,
  minTemp,
  forecastDates,
  dayClicked,
}: ForecastBoxProps) => {
  const [selectedDaySpanOption, setSelectedDaySpanOption] = useState(daySpanOptions[7]);
  const [currentClickedDayIndex, setCurrentClickedDayIndex] = useState<number | null>(0);

  const handleSelectOption = (selectedOption: number) => {
    setSelectedDaySpanOption(selectedOption);
    setCurrentClickedDayIndex(null);
  };

  const handleDayClick = (index: number) => {
    setCurrentClickedDayIndex(index);
    dayClicked(index);
  };

  const getButtonStyle = (paramChosen: number) => [
    styles.dayParamSelect,
    selectedDaySpanOption === paramChosen && styles.dayParamSelectClicked,
  ];

  const isValidForecast = !!forecastDates?.length;

  const renderForecastItem = useCallback(
    ({item, index}: {item: string; index: number}) => {
      return (
        <TouchableOpacity onPress={() => handleDayClick(index)}>
          <View style={styles.mappedDatesContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dayStyle}>{format(parseISO(item), 'EEE')}</Text>
              <Text style={styles.monthAndDateStyle}>{format(parseISO(item), 'MMM, do')}</Text>
            </View>

            <View style={styles.iconAndConditionContainer}>
              <View style={styles.iconContainer}>
                {getWeatherIcon(getWeatherLabel(WeatherCode[index]))}
              </View>

              <Text style={styles.generalConditionStyle}>
                {getWeatherLabel(WeatherCode[index])}
              </Text>
            </View>

            <View>
              <Text style={styles.tempContainer}>
                {Math.round(minTemp[index])} / {Math.round(maxTemp[index]) + ` \u00B0F`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [isValidForecast],
  );

  return (
    <View style={styles.forecastBoxStyle}>
      <View style={styles.forecastTextAndButtons}>
        <Text style={styles.forecastText}>Forecast</Text>
        <View style={styles.daySelectorContainer}>
          <View style={getButtonStyle(daySpanOptions[7])}>
            <TouchableOpacity hitSlop={12} onPressIn={() => handleSelectOption(daySpanOptions[7])}>
              <Text style={styles.paramText}>7 Day</Text>
            </TouchableOpacity>
          </View>
          <View style={getButtonStyle(daySpanOptions[14])}>
            <TouchableOpacity hitSlop={12} onPressIn={() => handleSelectOption(daySpanOptions[14])}>
              <Text style={styles.paramText}>14 Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        ItemSeparatorComponent={ItemSeparatorComponent}
        scrollEnabled={false}
        data={forecastDates.slice(0, selectedDaySpanOption)}
        renderItem={renderForecastItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  forecastBoxStyle: {
    gap: 15,
    borderWidth: 5,
    borderRadius: 35,
    borderColor: '#4b5e94',
    flexDirection: 'column',
    padding: 15,
    backgroundColor: '#4b5e9434',
  },

  forecastTextAndButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 5,
    justifyContent: 'space-between',
  },

  daySelectorContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    borderRadius: 8,
    backgroundColor: '#1b4a7cfe',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },

  dayParamSelect: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: '#afb0b7',
    maxWidth: 100,
    fontSize: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },

  dayParamSelectClicked: {
    backgroundColor: '#196cf1',
    color: 'rgb(240, 232, 232)',
  },

  paramText: {
    color: 'black',
    fontWeight: 'bold',
  },

  forecastText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },

  calendarButton: {
    color: 'white',
    fontSize: 30,
  },

  mappedDatesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderWidth: 2,
    borderRadius: 15,
    borderColor: '#4b5e94',
    alignItems: 'center',
  },

  itemSeparator: {
    paddingVertical: 4,
  },

  dateContainer: {flex: 1},

  iconAndConditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    width: 180,
  },

  iconContainer: {
    transform: [{scale: 0.7}],
    alignItems: 'center',
    overflow: 'hidden',
    width: 88,
    height: 80,
    justifyContent: 'center',
  },

  generalConditionStyle: {
    color: 'white',
    flexShrink: 1,
  },

  dayStyle: {
    flexDirection: 'column',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  monthAndDateStyle: {
    fontSize: 14,
    color: 'white',
  },

  tempContainer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

type ForecastBoxProps = {
  generalWeatherCondition: WeatherStatuses;
  WeatherCode: number[];
  maxTemp: number[];
  minTemp: number[];
  forecastDates: string[];
  loadingStatus: LoadingStatuses;
  dayClicked: (index: number) => void;
};
