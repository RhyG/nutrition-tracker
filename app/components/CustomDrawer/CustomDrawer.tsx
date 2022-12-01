import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';

import { REPO_URL } from '../../config/constants';
import { DrawerHeaderImage } from './DrawerHeaderImage';
import { colours } from '../../theme';

export const CustomDrawer = (props: DrawerContentComponentProps) => {
  const openGithubRepo = () => {
    Linking.openURL(REPO_URL);
  };

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.headerContainer}>
        <DrawerHeaderImage />
      </View>
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footerContainer}>
        <Icon name="github" color="#fff" size={35} onPress={openGithubRepo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colours.palette.darkBlue,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  footerContainer: {
    marginBottom: 40,
    paddingLeft: 30,
  },
});
