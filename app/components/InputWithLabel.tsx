import React, { memo } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Theme } from '@theme';
import { Text } from '@components/Text';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { TextInputProps } from 'react-native';

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
} & TextInputProps;

export const InputWithLabel = memo(({ onInputChange, placeholder, value, label = '', ...inputProps }: Props) => {
  const { styles, theme } = useThemedStyles(stylesFn);

  return (
    <>
      <Text preset="formHelper" style={styles.text} testID={`input-with-label-${label}-label`}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder ?? label}
        onChangeText={onInputChange}
        value={String(value)}
        placeholderTextColor={theme.colours.palette.neutral500}
        testID={`input-with-label-${label}-input`}
        style={styles.textInput}
        {...inputProps}
      />
    </>
  );
});

const stylesFn = ({ colours, typography }: Theme) =>
  StyleSheet.create({
    text: {
      marginBottom: 1,
    },
    textInput: {
      backgroundColor: colours.palette.neutral200,
      padding: 10,
      borderRadius: 6,
      fontSize: typography.sizes.lg,
    },
  });
