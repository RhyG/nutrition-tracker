import { LabelPosition } from '@react-navigation/bottom-tabs/lib/typescript/src/types';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';

interface Props {
  focused: boolean;
  color: string;
  position: LabelPosition;
  children: string;
  label: string;
}

export function TabBarLabel({ label, focused }: Props) {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  return <Text style={[styles.text, { color: focused ? colours.palette.neutral700 : colours.palette.neutral500 }]}>{label}</Text>;
}

const stylesFn = () =>
  StyleSheet.create({
    text: { fontSize: 12 },
  });
