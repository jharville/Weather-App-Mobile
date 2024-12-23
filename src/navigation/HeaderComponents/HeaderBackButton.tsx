import {useNavigation} from '@react-navigation/native';
import {HeaderBackButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import {StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const HeaderBackButton = (props: HeaderBackButtonProps) => {
  const navigation = useNavigation();

  return (
    // pr comment if you're using a prop that isnt as standard to use for no apparent reason,
    //  i would recommend leaving a comment with a link to someone else experiencing the issue
    //  where pressability is shotty with TouchableOpacity's onPress prop so it doesn't get changed in the future
    // and reintroduce a bug
    <TouchableOpacity onPressIn={() => (props.canGoBack ? navigation.goBack() : null)}>
      <FontAwesome5 name="home" style={styles.backButton} size={38} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {color: 'white', fontSize: 38},
});
