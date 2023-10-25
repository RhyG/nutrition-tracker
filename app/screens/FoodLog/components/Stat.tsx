import { Text } from '@components/Text';
import { Theme } from '@theme';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { useThemedStyles } from '@app/hooks/useThemedStyles';

type Props = {
  /**
   * Value rendered above stat bar on left hand side.
   * While the current only macros in the app are 'Calories' or 'Protein' this could be a union type
   * but I wanted to keep this component mostly generic for the time being.
   */
  name: string;
  /**
   * Current total of macro for that day.
   */
  currentAmount: number;
  /**
   * Maximum number of that macro for the day.
   */
  max: number;
  /**
   * Colour of the inner progress bar.
   */
  progressColour: string;
};

export const Stat = memo(({ name, currentAmount, max, progressColour }: Props): JSX.Element => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const statWidth = useSharedValue(0);

  const progressBarStyle = useAnimatedStyle(() => {
    const width = currentAmount > max ? 100 : (currentAmount / max) * 100;

    // The ternary prevents jank when the value is 0
    statWidth.value =
      width > 0
        ? withSpring(width, {
            damping: 15,
          })
        : 0;

    return {
      width: `${statWidth.value}%`,
    };
  }, [max, currentAmount]);

  return (
    <View style={styles.container}>
      <View style={styles.reminaingMacroContainer}>
        <Text>{name}</Text>
        <Text colour={colours.palette.neutral400} size="xs">
          {currentAmount} / {max}
        </Text>
      </View>
      <View style={styles.outerProgressBar}>
        <Animated.View
          style={[progressBarStyle, styles.innerProgressBar, { backgroundColor: currentAmount > max ? colours.palette.angry500 : progressColour }]}
        />
      </View>
    </View>
  );
});

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1 },
    reminaingMacroContainer: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'center',
    },
    outerProgressBar: {
      backgroundColor: theme.colours.palette.neutral300,
      borderRadius: 8,
      height: 10,
    },
    innerProgressBar: {
      borderRadius: 8,
      zIndex: 1,
      height: 10,
    },
    progressBarTextContainer: {
      position: 'absolute',
      zIndex: 9,
      alignItems: 'center',
      justifyContent: 'center',
      left: '50%',
      marginLeft: -50,
      height: 30,
      width: 100,
    },
    remainingText: {
      color: theme.colours.palette.neutral200,
    },
  });
