import { Text } from '@components/Text';
import React, { memo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';

import { Space } from '@app/components/Space';
import { useEvent } from '@app/hooks/useEvent';
import { caloriesToKj, kjToCalories } from '@app/lib/energy';
import { isInputNumber } from '@app/lib/validation';

import { InputWithLabel } from '../../../components/InputWithLabel';

type ReducerState = {
  calories: number;
  kj: number;
};

type ReducerAction = { type: 'INPUT_CHANGED'; value: { calories: number; kj: number } };

const reducer = (state: ReducerState, action: ReducerAction) => {
  switch (action.type) {
    case 'INPUT_CHANGED':
      return {
        ...state,
        ...action.value,
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

  const handleCalorieChange = useEvent((value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    dispatch({ type: 'INPUT_CHANGED', value: { kj: caloriesToKj(Number(value)), calories: Number(value) } });
  });

  const handleKilojouleChange = useEvent((value: string) => {
    if (!isInputNumber(value)) {
      return;
    }

    dispatch({ type: 'INPUT_CHANGED', value: { kj: Number(value), calories: kjToCalories(Number(value)) } });
  });

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
      <Space units={4} />
      <Text>Formula: 1 Cal = 4.184 kJ, rounded to the nearest whole number.</Text>
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
