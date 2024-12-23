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
    [navigation],
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
        {/* 
        pr comment
        original:
        <View>
          <Text style={[styles.appTitle, styles.textOutline]}>Weather{'\n'}App</Text>
          <Text style={styles.appTitle}>Weather{'\n'}App</Text>
        </View>

        sugestion:
        */}
        <Text style={styles.appTitle}>Weather</Text>
        <Text style={styles.appTitle}>App</Text>
        {/* reason:
        stacking text on top of each other is gernerally not a great practice, because you'll have to use position absolute
        like you did on one of these. Plus the outline is the same size as they overlayed text here, 
        so you wont actually get the outlining effect you're looking for. You can try changing it to 
        pink the old way and you still wont get a pink border.

        Using \n to escape a new line is fine, but is not the norm. Usually just make another text tag unless there's a reason you can
        */}
        {/*  */}
        {/*  */}
        {/*  */}
        <SearchCity
          handleSearch={handleSearch}
          handleSuggestionClick={handleSuggestionClick}
          userTextInput={userTextInput}
          setUserTextInput={setUserTextInput}
        />
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
