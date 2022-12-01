import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { View, Image, StyleSheet } from 'react-native';

export const DrawerHeaderImage = () => {
  const navigation = useNavigation();

  const hideDrawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <TouchableWithoutFeedback onPress={hideDrawer}>
      <View style={styles.imageBackground}>
        <Image style={styles.logo} source={require('../../../assets/logo.png')} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    backgroundColor: '#fff',
    height: 120,
    width: 120,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  logo: {
    height: 80,
    width: 80,
  },
});
