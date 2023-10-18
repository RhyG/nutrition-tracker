import { Text } from '@components/Text';
import Icon from '@expo/vector-icons/AntDesign';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { Theme } from '@theme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Directions } from '../hooks/useDaySwitcher';

type Props = {
  changeDay: (direction: Directions) => void;
  currentDay: string;
};

/**
 * Renders the day switcher
 * Looks a bit like this:
 *       <    Wednesday    >
 */
export const DaySwitcher = ({ changeDay, currentDay }: Props) => {
  const {
    theme: { colours },
    styles,
  } = useThemedStyles(stylesFn);

  // Sets the colours for the left and right most days as white when selected.
  const leftArrowColour = currentDay === 'Monday' ? colours.palette.neutral100 : colours.palette.neutral800;
  const rightArrowColour = currentDay === 'Sunday' ? colours.palette.neutral100 : colours.palette.neutral800;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => changeDay(Directions.LEFT)}>
        <Icon name="left" size={24} color={leftArrowColour} />
      </TouchableOpacity>
      <Text weight="medium" size="lg">
        {currentDay}
      </Text>
      <TouchableOpacity onPress={() => changeDay(Directions.RIGHT)}>
        <Icon name="right" size={24} color={rightArrowColour} />
      </TouchableOpacity>
    </View>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'center',
      paddingTop: theme.spacing.small,
    },
  });
