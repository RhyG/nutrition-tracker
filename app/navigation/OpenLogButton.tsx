import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';

export function OpenLogButton({ onPress }: { onPress: () => void }) {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
      }}
      style={styles.button}>
      <Feather name="plus" size={35} color={colours.palette.neutral700} />
    </TouchableOpacity>
  );
}

const stylesFn = () =>
  StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
    },
  });
