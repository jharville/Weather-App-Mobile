import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {LandingScreen} from '../screens/LandingScreen';
import {LandingStackParamList} from './types/navigation.types';

const Stack = createStackNavigator<LandingStackParamList>();
const screenOptions = {
  headerShown: false,
};

export const LandingStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
    </Stack.Navigator>
  );
};
