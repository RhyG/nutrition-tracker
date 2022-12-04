import React from 'react';
import { StyleProp, StyleSheet, TouchableWithoutFeedback, ViewStyle, View } from 'react-native';
import Icon from '@expo/vector-icons/Feather';

import { useThemedStyles } from '@hooks/useThemedStyles';
import { Theme } from '@theme';

import { Text } from './Text';

type RadioButtonProps = {
  /**
   * Current toggle state of the button
   */
  selected: boolean;
  /**
   * Text rendered to the right of the box
   */
  label: string;
  /**
   * Function to run on press of the radio button
   */
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export const RadioButton = ({ selected, label, onPress, containerStyle }: RadioButtonProps) => {
  const {
    theme: { colours },
    styles,
  } = useThemedStyles(stylesFn);

  return (
    <TouchableWithoutFeedback testID="radio-button-touchable" onPress={onPress}>
      <View style={[styles.container, containerStyle]}>
        <View style={styles.radioOuter}>{selected && <Icon testID="radio-button-check-icon" name="check" color={colours.palette.green} size={20} />}</View>
        <Text testID="radio-button-label" size="md" style={styles.text}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...theme.layout.centerAlignedRow,
    },
    radioOuter: {
      ...theme.layout.fullyCentred,
      borderRadius: 4,
      height: 25,
      width: 25,
      borderWidth: 2,
      borderColor: theme.colours.palette.green,
    },
    text: {
      marginLeft: 6,
    },
  });
