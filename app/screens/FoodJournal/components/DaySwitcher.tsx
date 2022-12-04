import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from '@expo/vector-icons/AntDesign';

import { Text } from '@components/Text';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { Theme } from '@theme';

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
  const leftArrowColour = currentDay === 'Monday' ? colours.palette.neutral200 : colours.palette.neutral800;
  const rightArrowColour = currentDay === 'Sunday' ? colours.palette.neutral200 : colours.palette.neutral800;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => changeDay(Directions.LEFT)}>
        <Icon name="left" size={26} color={leftArrowColour} />
      </TouchableOpacity>
      <Text size="lg">{currentDay}</Text>
      <TouchableOpacity onPress={() => changeDay(Directions.RIGHT)}>
        <Icon name="right" size={26} color={rightArrowColour} />
      </TouchableOpacity>
    </View>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'center',
      backgroundColor: theme.colours.palette.neutral200,
      paddingHorizontal: theme.spacing.small,
      paddingTop: theme.spacing.small,
    },
  });
