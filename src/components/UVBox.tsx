import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import RNSpeedometer from 'react-native-speedometer';
import {LoadingStatuses} from '../utilities/useWeatherFetch';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const precautionMessages: {[key: string]: {text: string[]; icons: string[]}} = {
  low: {
    text: ['lotion', 'sunglasses'],
    icons: ['lotion', 'sunglasses'],
  },
  moderate: {
    text: ['lotion', 'sunglasses', 'redhat', 'beach'],
    icons: ['lotion', 'sunglasses', 'redhat', 'beach'],
  },
  high: {
    text: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
    icons: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
  },
  veryHigh: {
    text: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
    icons: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
  },
  extreme: {
    text: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
    icons: ['lotion', 'sunglasses', 'redhat', 'beach', 'tshirt-crew'],
  },
  noData: {
    text: ['N/A'],
    icons: [],
  },
};

const labels = [
  {name: '1', labelColor: '#688D1B', activeBarColor: '#688D1B'}, // Dark Green
  {name: '2', labelColor: '#84BD00', activeBarColor: '#84BD00'}, // Green
  {name: '3', labelColor: '#97D700', activeBarColor: '#97D700'}, // Light Green
  {name: '4', labelColor: '#F7EA48', activeBarColor: '#dbd03f'}, // Yellow
  {name: '5', labelColor: '#FCE300', activeBarColor: '#ffde05'}, // Bright Yellow
  {name: '6', labelColor: '#FFC100', activeBarColor: '#FFC100'}, // Orange-Yellow
  {name: '7', labelColor: '#FCA514', activeBarColor: '#FCA514'}, // Orange
  {name: '8', labelColor: '#FF8200', activeBarColor: '#FF8200'}, // Deep Orange
  {name: '9', labelColor: '#EF3340', activeBarColor: '#EF3340'}, // Bright Red
  {name: '10', labelColor: '#7b1a1a', activeBarColor: '#7b1a1a'}, // Dark Red
];

const getUVSwitchResult = (uvValue: number) => {
  let conditionText = 'No Data';
  let gaugeChartValue = 1;
  let spfRecommendation = 'N/A';
  let minutesToBurn = 'N/A';
  let switchWarningMessage = precautionMessages.noData;

  switch (uvValue) {
    case 1:
      conditionText = 'Low';
      gaugeChartValue = 1;
      spfRecommendation = '15';
      minutesToBurn = '60';
      switchWarningMessage = precautionMessages.low;
      break;
    case 2:
      conditionText = 'Low';
      gaugeChartValue = 2;
      spfRecommendation = '15';
      minutesToBurn = '60';
      switchWarningMessage = precautionMessages.low;
      break;
    case 3:
      conditionText = 'Low';
      gaugeChartValue = 3;
      spfRecommendation = '30+';
      minutesToBurn = '45';
      switchWarningMessage = precautionMessages.low;
      break;
    case 4:
      conditionText = 'Moderate';
      gaugeChartValue = 4;
      spfRecommendation = '30+';
      minutesToBurn = '45';
      switchWarningMessage = precautionMessages.moderate;
      break;
    case 5:
      conditionText = 'Moderate';
      gaugeChartValue = 5;
      spfRecommendation = '30+';
      minutesToBurn = '45';
      switchWarningMessage = precautionMessages.moderate;
      break;
    case 6:
      conditionText = 'High';
      gaugeChartValue = 6;
      spfRecommendation = '50';
      minutesToBurn = '30';
      switchWarningMessage = precautionMessages.high;
      break;
    case 7:
      conditionText = 'High';
      gaugeChartValue = 7;
      spfRecommendation = '50';
      minutesToBurn = '30';
      switchWarningMessage = precautionMessages.high;
      break;
    case 8:
      conditionText = 'Very High';
      gaugeChartValue = 8;
      spfRecommendation = '50';
      minutesToBurn = '15';
      switchWarningMessage = precautionMessages.veryHigh;
      break;
    case 9:
      conditionText = 'Very High';
      gaugeChartValue = 9;
      spfRecommendation = '50';
      minutesToBurn = '15';
      switchWarningMessage = precautionMessages.veryHigh;
      break;
    case 10:
      conditionText = 'Extreme!';
      gaugeChartValue = 10;
      spfRecommendation = '50+';
      minutesToBurn = '10';
      switchWarningMessage = precautionMessages.extreme;
      break;
  }

  return {
    gaugeChartValue,
    conditionText,
    spfRecommendation,
    minutesToBurn,
    labels,
    switchWarningMessage,
  };
};

export const UVBox = ({uvValue, sunDuration}: UVBoxProps) => {
  const {
    gaugeChartValue,
    conditionText,
    spfRecommendation,
    minutesToBurn,
    switchWarningMessage,
    labels,
  } = getUVSwitchResult(uvValue);

  return (
    <View style={styles.container}>
      {/* Left Container */}
      <View style={styles.leftContainer}>
        {/* Speedometer */}
        <Text style={styles.uvIndexText}>UV Index</Text>
        <RNSpeedometer
          value={Math.max(0, gaugeChartValue - 1)}
          labels={labels}
          size={130}
          maxValue={10}
          labelWrapperStyle={{display: 'none'}}
          innerCircleStyle={{backgroundColor: 'rgb(48,49,49)'}}
          easeDuration={1500}
        />
        <Text style={styles.uvValueText}>{gaugeChartValue}</Text>
        <Text style={styles.riskText}>Risk: {conditionText}</Text>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Minutes to Burn:</Text>
            <Text style={styles.infoNumValues}>{minutesToBurn}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Suggested SPF:</Text>
            <Text style={styles.infoNumValues}>{spfRecommendation}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Total Sun Hours:</Text>
            <Text style={styles.infoNumValues}>{sunDuration}</Text>
          </View>
        </View>
      </View>

      {/* Right Container */}
      <View style={styles.rightContainer}>
        {/* Suggestions */}
        <View style={styles.suggestionContainer}>
          <Text style={styles.protectYourselfText}>
            Protect yourself if you're going out any longer than {minutesToBurn} minutes:
          </Text>
          <Text style={styles.protectNeededText}>Protection needed:</Text>

          {/* Icons and Descriptors */}
          <View style={styles.iconTextContainer}>
            {switchWarningMessage.icons.map((icon, index) => (
              <View key={index} style={styles.iconWithText}>
                <MaterialCommunityIcons name={icon} size={24} color="black" />
                <Text style={styles.warningText}>{switchWarningMessage.text[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
    borderWidth: 5,
    borderRadius: 35,
    borderColor: '#4b5e94',
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#4b5e9434',
  },

  leftContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(48,49,49)',
    borderRadius: 15,
    width: 150,
    gap: 5,
  },

  rightContainer: {
    backgroundColor: 'rgb(238, 238, 238)',
    width: 150,
    borderRadius: 15,
  },

  infoContainer: {
    flexDirection: 'column',
  },

  infoRow: {
    gap: 8,
    flexDirection: 'row',
  },

  infoText: {
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
    fontWeight: 500,
  },

  suggestionContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 15,
    gap: 5,
  },

  protectYourselfText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 500,
  },

  protectNeededText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 400,
  },

  uvIndexText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },

  riskText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
    fontWeight: 400,
  },

  infoNumValues: {
    fontWeight: 'bold',
    color: 'rgb(167, 188, 188)',
  },

  uvValueText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },

  iconTextContainer: {
    flexDirection: 'column',
    gap: 5,
  },

  iconWithText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    // backgroundColor: 'teal',
    width: 160, //I cant get this box to shrink. Should I use padding right? Margin?
  },

  warningText: {
    fontSize: 16,
    fontWeight: 500,
    color: 'rgb(88, 101, 101)',
  },
});

type UVBoxProps = {
  uvValue: number;
  sunDuration: number;
  loadingStatus: any;
};
