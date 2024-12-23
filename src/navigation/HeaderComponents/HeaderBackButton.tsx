import {useNavigation} from '@react-navigation/native';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const HeaderBackButton = (props: HeaderBackButtonProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      // onPress={() => (props.canGoBack ? navigation.goBack() : null)}
      onPressIn={() => (props.canGoBack ? navigation.goBack() : null)}
      // onPressOut={() => (props.canGoBack ? navigation.goBack() : null)}
      // hitSlop={{top: 30, bottom: 30, left: 30, right: 30}}>
    >
      <FontAwesome5 name="home" style={styles.backButton} size={38} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {color: 'white', fontSize: 38},
});
