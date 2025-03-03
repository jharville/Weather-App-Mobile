import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#5a5d68" />
      {/* for Android ^ */}

      <SafeAreaView style={styles.safeAreaTop} />

      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaTop: {
    backgroundColor: '#5a5d68',
    //for IOS ^
  },
});
