import {createNativeStackNavigator, NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {LandingStack} from './LandingStack';
import {MainStack} from './MainStack';
import {RootNavigatorParamList} from './types/navigation.types';

const Stack = createNativeStackNavigator<RootNavigatorParamList>();

// pull out header show rerenders

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LandingStack" // Tells where to go by default
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LandingStack" component={LandingStack} />
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
