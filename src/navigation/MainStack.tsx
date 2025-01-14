import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ResultScreen} from '../screens/ResultScreen';
import {MainStackParamList} from './types/navigation.types';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderBackButton} from './HeaderComponents/HeaderBackButton';
import {HeaderSettingsButton} from './HeaderComponents/HeaderSettingsButton';

const Stack = createNativeStackNavigator<MainStackParamList>();

const resultScreenOptions: NativeStackNavigationOptions = {
  headerLeft: HeaderBackButton,
  headerTitle: '',
  headerRight: HeaderSettingsButton,
  headerBackVisible: false,
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor: '#121944',
  },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
};

export const MainStack = ({}) => {
  return (
    <Stack.Navigator screenOptions={resultScreenOptions}>
      <Stack.Screen name="ResultScreen" component={ResultScreen} options={resultScreenOptions} />
    </Stack.Navigator>
  );
};
