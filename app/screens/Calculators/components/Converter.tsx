import React, { memo, useState } from 'react';
import styled, { useTheme } from 'styled-components/native';

import { Text } from '@app/components/Text';
import { calToKj, isInputNumber, kjToCal } from '@app/utils/calculators';

import { InputWithLabel } from './InputWithLabel';

export const Converter = memo(() => {
  const { colours } = useTheme();

  const [kj, setKj] = useState('');
  const [calories, setCalories] = useState('');

  const handleCalorieChange = (value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    const convertedKj = calToKj(Number(value));

    setKj(String(convertedKj));
    setCalories(value);
  };

  const handleKilojouleChange = (value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    const convertedCalories = kjToCal(Number(value));

    setCalories(String(convertedCalories));
    setKj(value);
  };

  return (
    <>
      <Text color={colours.darkGrey} fontSize="xxl" bold marginBottom={2}>
        Convert Kilojoules to Calories
      </Text>
      <FieldsContainer>
        <FieldContainer>
          <InputWithLabel
            label="Calories"
            onInputChange={handleCalorieChange}
            value={calories}
          />
        </FieldContainer>
        <FieldContainer>
          <InputWithLabel
            label="Kilojoules"
            onInputChange={handleKilojouleChange}
            value={kj}
          />
        </FieldContainer>
      </FieldsContainer>
      <Text fontSize="md" marginTop={2}>
        Formula: 1 Cal = 4.184 kJ, rounded to the nearest whole number
      </Text>
    </>
  );
});

const FieldsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const FieldContainer = styled.View`
  width: 48%;
`;
