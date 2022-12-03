import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '../../../components/Text';
import { isInputNumber } from '../../../lib/validation';
import { caloriesToKj, kjToCalories } from '../../../lib/energy';
import { InputWithLabel } from './InputWithLabel';

export const Converter = memo(() => {
  const [kj, setKj] = useState('');
  const [calories, setCalories] = useState('');

  const handleCalorieChange = (value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    const convertedKj = caloriesToKj(Number(value));

    setKj(String(convertedKj));
    setCalories(value);
  };

  const handleKilojouleChange = (value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    const convertedCalories = kjToCalories(Number(value));

    setCalories(String(convertedCalories));
    setKj(value);
  };

  return (
    <>
      <Text preset="heading" style={styles.heading}>
        Convert Kilojoules to Calories
      </Text>
      <View style={styles.fieldsWrapper}>
        <View style={styles.fieldContainer}>
          <InputWithLabel label="Calories" onInputChange={handleCalorieChange} value={calories} />
        </View>
        <View style={styles.fieldContainer}>
          <InputWithLabel label="Kilojoules" onInputChange={handleKilojouleChange} value={kj} />
        </View>
      </View>
      <Text preset="subheading">Formula: 1 Cal = 4.184 kJ, rounded to the nearest whole number</Text>
    </>
  );
});

const styles = StyleSheet.create({
  fieldsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldContainer: {
    width: '48%',
  },
  heading: {
    marginBottom: 4,
  },
});
