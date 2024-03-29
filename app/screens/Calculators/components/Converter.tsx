import i18n from 'i18n-js';
import React, { memo, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';

import { Space } from '@app/components/Space';
import { useEvent } from '@app/hooks/useEvent';
import { caloriesToKj, kjToCalories } from '@app/lib/energy';
import { isInputNumber } from '@app/lib/validation';

import { Text } from '@components/Text';

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
        {i18n.t('screens.calculators.convertTitle')}
      </Text>
      <View style={styles.fieldsWrapper}>
        <View style={styles.fieldContainer}>
          <InputWithLabel label={i18n.t('macros.calories')} onInputChange={handleCalorieChange} value={String(calories)} keyboardType="number-pad" />
        </View>
        <View style={styles.fieldContainer}>
          <InputWithLabel label={i18n.t('screens.calculators.kilojoules')} onInputChange={handleKilojouleChange} value={String(kj)} keyboardType="number-pad" />
        </View>
      </View>
      <Space units={4} />
      <Text>{i18n.t('screens.calculators.formula')}</Text>
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
