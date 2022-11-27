import React from 'react';
import { useTheme } from 'styled-components/native';
import styled from 'styled-components/native';

import { Text } from '@app/components/Text';

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

export const InputWithLabel = ({
  onInputChange,
  placeholder,
  value,
  label = '',
}: Props) => {
  const { colours } = useTheme();

  return (
    <>
      <Text
        color={colours.darkGrey}
        fontSize="lg"
        bold
        marginBottom={1}
        testID={`input-with-label-${label}-label`}>
        {label}
      </Text>
      <Input
        placeholder={placeholder ?? label}
        onChangeText={onInputChange}
        value={String(value)}
        keyboardType="number-pad"
        placeholderTextColor={colours.grey}
        testID={`input-with-label-${label}-input`}
      />
    </>
  );
};

const Input = styled.TextInput`
  background-color: ${({ theme }) => theme.colours.offWhite};
  padding: 10px;
  border-radius: 6px;
  font-size: ${({ theme }) => theme.font.size.lg};
`;
