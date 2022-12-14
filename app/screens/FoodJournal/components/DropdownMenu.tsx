import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Icon from '@expo/vector-icons/Entypo';
import shallow from 'zustand/shallow';

import { useJournal } from '@app/store/journal';
import { Day } from '@app/types';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@theme';

type Props = {
  currentDay: Day;
};

export const DropdownMenu = ({ currentDay }: Props) => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);
  const navigation = useNavigation();

  const { clearJournal, clearDay, copyPreviousDay } = useJournal((state) => ({ ...state }), shallow);

  // TODO figure out how to type navigation and remove cast to never.
  const navigateToGoalsScreen = () => {
    navigation.navigate('Goals' as never);
  };

  const _clearJournal = () => {
    Alert.alert('Clear all entries for this week?', `Are you sure you want to clear all items from each day this week?`, [
      { text: 'Cancel' },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: () => clearJournal(),
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.touchableHeader}>
      <Menu>
        <MenuTrigger children={<Icon name="dots-three-vertical" size={22} color={colours.palette.neutral800} />} />
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption onSelect={() => copyPreviousDay(currentDay)}>
            <Text>Copy previous day</Text>
          </MenuOption>
          <MenuOption onSelect={() => clearDay(currentDay)}>
            <Text>Clear day</Text>
          </MenuOption>
          <MenuOption onSelect={_clearJournal}>
            <Text>Clear week</Text>
          </MenuOption>
          <MenuOption onSelect={navigateToGoalsScreen}>
            <Text>Set goals</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </TouchableOpacity>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    touchableHeader: {
      paddingRight: 12.5,
    },
  });

const optionsStyles = StyleSheet.create({
  optionsContainer: {
    padding: 5,
    borderRadius: 12,
  },
  optionWrapper: {
    padding: 10,
    margin: 2,
  },
  // TODO Figure out how to actually style this text
  optionText: {
    // color: 'red',
  },
});
