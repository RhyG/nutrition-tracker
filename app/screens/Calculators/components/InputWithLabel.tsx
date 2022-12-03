import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Theme } from '../../../theme';
import { Text } from '../../../components/Text';
import { useThemedStyles } from '../../../hooks/useThemedStyles';

type Props = {
  /**
   * Function to run when the value of the input changes.
   * @param {string} value - current value of the input
   */
  onInputChange: (value: string) => void;
  /**
   * Optional placeholder to render when input is empty.
   */
  placeholder?: string;
  /**
   * Current value of the input.
   */
  value: string;
  /**
   * Label to render above the input.
   */
  label: string;
};

export const InputWithLabel = ({ onInputChange, placeholder, value, label = '' }: Props) => {
  const { styles, theme } = useThemedStyles(stylesFn);

  return (
    <>
      <Text preset="heading" style={styles.text} testID={`input-with-label-${label}-label`}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder ?? label}
        onChangeText={onInputChange}
        value={String(value)}
        keyboardType="number-pad"
        placeholderTextColor={theme.colours.palette.neutral500}
        testID={`input-with-label-${label}-input`}
      />
    </>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    text: {
      marginBottom: 1,
    },
    textInput: {
      backgroundColor: theme.colours.palette.neutral200,
      padding: 10,
      borderRadius: 6,
      fontSize: theme.font.size.lg,
    },
  });
