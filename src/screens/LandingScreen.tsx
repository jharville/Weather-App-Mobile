import React, {useCallback, useState} from 'react';
import {StyleSheet, View, Text, Keyboard, Pressable} from 'react-native';
import Video from 'react-native-video';
import {LandingStackScreenProps} from '../navigation/types/navigation.types';
import {SearchCity} from '../components/SearchCity';

export const LandingScreen = ({navigation}: LandingStackScreenProps<'LandingScreen'>) => {
  const [userTextInput, setUserTextInput] = useState('');

  const handleSearch = useCallback(() => {
    navigation.navigate('MainStack', {
      screen: 'ResultScreen',
      params: {
        searchTerm: userTextInput.trim(),
      },
    });
  }, [userTextInput, navigation]);

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      return navigation.navigate('MainStack', {
        screen: 'ResultScreen',
        params: {
          searchTerm: suggestion,
        },
      });
    },
    [userTextInput, navigation],
  );

  return (
    <Pressable onPress={Keyboard.dismiss} style={styles.wholeScreen}>
      <Video
        source={require('../assets/Weather_App_Background_Video_Compressed.mp4')}
        style={styles.videoLanding}
        resizeMode="cover"
        repeat
        muted
        playInBackground={false}
      />
      <View style={styles.appTitleAndSearch}>
        <View>
          <Text style={[styles.appTitle, styles.textOutline]}>Weather{'\n'}App</Text>
          <Text style={styles.appTitle}>Weather{'\n'}App</Text>
        </View>
        <View>
          <View style={styles.searchAndIconContainer}>
            <SearchCity
              handleSearch={handleSearch}
              handleSuggestionClick={handleSuggestionClick}
              userTextInput={userTextInput}
              setUserTextInput={setUserTextInput}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wholeScreen: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 40,
  },

  videoLanding: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -99,
  },

  contentContainer: {
    borderColor: '#ffffff',
    borderWidth: 5,
    borderRadius: 10,
    gap: 30,
    paddingVertical: 30,
    overflow: 'hidden',
    paddingBottom: 50,
  },
  appTitleAndSearch: {
    gap: 15,
  },

  linearGradiantStyle: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },

  searchAndIconContainer: {
    // flexDirection: 'row',
    // height: 100,
    // minHeight: 3,x
    // alignItems: 'center',
    // borderRadius: 10,
    // justifyContent: 'center',
    // paddingHorizontal: 20,
  },

  appTitle: {
    flexDirection: 'column',
    fontSize: 65,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#184445',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  },

  textOutline: {
    fontSize: 65,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    position: 'absolute',
    left: 1,
    top: 1,
  },

  errorMessage: {
    color: 'red',
  },
});

// import {LinearGradient} from 'react-native-gradients';
// const gradiantColorList = [
//   {offset: '8%', color: '#768087', opacity: '1'},
//   {offset: '100%', color: '#3274a6', opacity: '1'},
// ];

// <View style={styles.linearGradiantStyle}>
// {/* <LinearGradient colorList={gradiantColorList} angle={90} /> */}
// </View>
