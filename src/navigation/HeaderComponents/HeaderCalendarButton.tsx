import {HeaderCalendarButtonProps} from '../types/headerComponent.types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const HeaderCalendarButton = (props: HeaderCalendarButtonProps) => {
  return (
    <TouchableOpacity
      // onPress={() => (props.canGoBack ? navigation.goBack() : null)}
      onPressIn={() => null}
      // onPressOut={() => (props.canGoBack ? navigation.goBack() : null)}
      // hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}>
    >
      <FontAwesome name="calendar" size={30} color="white" style={styles.calendarButton} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  calendarButton: {
    color: 'white',
    fontSize: 38,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
