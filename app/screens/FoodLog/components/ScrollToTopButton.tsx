import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { BounceInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@app/theme';

const FAB_VISIBLE_BOTTOM_VALUE = 10;
const FAB_HIDDEN_BOTTOM_VALUE = -180;

type Props = {
  onPress: () => void;
  buttonVisible: boolean;
};

export function ScrollToTopButton({ onPress, buttonVisible }: Props) {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const style = useAnimatedStyle(() => {
    let value: number;

    if (buttonVisible) {
      value = withSpring(FAB_VISIBLE_BOTTOM_VALUE, { damping: 15 });
    } else {
      value = withSpring(FAB_HIDDEN_BOTTOM_VALUE, { damping: 15 });
    }

    return {
      bottom: value,
    };
  }, [buttonVisible]);

  return (
    <Animated.View entering={BounceInDown} style={[styles.animatedView, style]}>
      <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
        <Feather name="chevron-up" size={24} color={colours.palette.neutral100} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    animatedView: {
      position: 'absolute',
      right: 20,
      zIndex: 0,
      opacity: 0.35,
    },
    buttonContainer: {
      backgroundColor: theme.colours.palette.neutral400,
      height: 35,
      width: 35,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
