import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Entypo';

import { colours } from '../theme';

export const BurgerMenu = () => {
  const { dispatch } = useNavigation();
  // const { styles, theme } = useThemedStyles(stylesFn);

  const openDawer = () => {
    dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity onPress={openDawer} style={styles.button}>
      <Icon name="menu" size={30} color={colours.palette.neutral800} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingLeft: 10,
  },
});
