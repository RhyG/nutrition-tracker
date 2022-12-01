import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from '@expo/vector-icons/Entypo';

import { Theme } from '@app/theme';
import { useThemedStyles } from '@app/hooks/useThemedStyles';

export const BurgerMenu = () => {
  const { dispatch } = useNavigation();
  // const { styles, theme } = useThemedStyles(stylesFn);

  const openDawer = () => {
    dispatch(DrawerActions.openDrawer());
  };

  return (
    <TouchableOpacity onPress={openDawer} style={styles.button}>
      <Icon name="menu" size={30} color={theme.colours.darkGrey} />
    </TouchableOpacity>
  );
};

const stylesFn = () =>
  StyleSheet.create({
    button: {
      paddingLeft: 10,
    },
  });
