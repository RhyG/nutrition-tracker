import React, { memo } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';

import { Text } from '@components/Text';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@theme';

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
};

export const Stat = memo(({ name, currentAmount, max }: Props): JSX.Element => {
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
      backgroundColor: currentAmount > max ? colours.palette.angry500 : colours.palette.green,
    };
  }, [max, currentAmount]);

  const remaining = max - currentAmount;

  return (
    <>
      <View style={styles.reminaingMacroContainer}>
        <Text weight="bold" size="lg">
          {name}
        </Text>
        <Text size="md" style={styles.remainingText}>
          {remaining} remaining
        </Text>
      </View>
      <View style={styles.outerProgressBar}>
        <View style={styles.progressBarTextContainer}>
          <Text weight="bold">
            {currentAmount} / {max}
          </Text>
        </View>
        <Animated.View style={[progressBarStyle, styles.innerProgressBar]} />
      </View>
    </>
  );
});

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    reminaingMacroContainer: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'center',
    },
    outerProgressBar: {
      backgroundColor: theme.colours.palette.neutral300,
      // borderTopLeftRadius: 8,
      // borderTopRightRadius: 8,
      // borderBottomLeftRadius: 8,
      // borderBottomRightRadius: 8,
      borderRadius: 8,
      position: 'relative',
      height: 30,
    },
    innerProgressBar: {
      borderRadius: 8,
      zIndex: 1,
      height: 30,
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
