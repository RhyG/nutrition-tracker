import React, { memo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@components/Text';
import { isInputNumber } from '@app/lib/validation';
import { caloriesToKj, kjToCalories } from '@app/lib/energy';

import { InputWithLabel } from '../../../components/InputWithLabel';

type ReducerState = {
  calories: number;
  kj: number;
};

type ReducerAction = { type: 'CALORIES' | 'KJ'; value: number };

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case 'CALORIES':
      return {
        ...state,
        calories: action.value,
        kj: caloriesToKj(action.value),
      };
    case 'KJ':
      return {
        ...state,
        calories: kjToCalories(action.value),
        kj: action.value,
      };
    default:
      return state;
  }
};

export const Converter = memo(() => {
  const [{ kj, calories }, dispatch] = useReducer(reducer, {
    kj: 0,
    calories: 0,
  });

  const handleCalorieChange = (value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    const convertedKj = caloriesToKj(Number(value));

    // setKj(String(convertedKj));
    // setCalories(value);

    dispatch({ type: 'CALORIES', value: convertedKj });
  };

  const handleKilojouleChange = (value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    const convertedCalories = kjToCalories(Number(value));

    // setCalories(String(convertedCalories));
    // setKj(value);
    dispatch({ type: 'KJ', value: convertedCalories });
  };

  return (
    <>
      <Text preset="heading" style={styles.heading}>
        Convert Kilojoules to Calories
      </Text>
      <View style={styles.fieldsWrapper}>
        <View style={styles.fieldContainer}>
          <InputWithLabel label="Calories" onInputChange={handleCalorieChange} value={String(calories)} />
        </View>
        <View style={styles.fieldContainer}>
          <InputWithLabel label="Kilojoules" onInputChange={handleKilojouleChange} value={String(kj)} />
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
