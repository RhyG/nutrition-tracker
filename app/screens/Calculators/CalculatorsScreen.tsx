import { ACTIVITY_LEVELS, FEMALE_TDEE_VARIABLE, MALE_TDEE_VARIABLE } from '@config/constants';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from '@theme';
import i18n from 'i18n-js';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { RadioButton } from '@app/components/RadioButton';
import { calculateBMR } from '@app/lib/calculators';
import { isInputNumber } from '@app/lib/validation';
import { RootStackScreen } from '@app/navigation';

import { InputWithLabel } from '@components/InputWithLabel';
import { Space } from '@components/Space';
import { Text } from '@components/Text';

import { useThemedStyles } from '@hooks/useThemedStyles';

import { Converter } from './components';

type TDEEFormData = {
  age: string;
  weight: string;
  height: string;
  gender: keyof typeof Genders;
  activityMultiplier: (typeof ACTIVITY_LEVELS)[number]['multiplier'];
};

const Genders = {
  FEMALE: 'FEMALE',
  MALE: 'MALE',
} as const;

const DEFAULT_FORM_DATA: TDEEFormData = {
  age: '',
  weight: '',
  height: '',
  gender: Genders.MALE,
  activityMultiplier: ACTIVITY_LEVELS[2].multiplier,
};

/**
 * Screen for the TDEE calculators and unit conversion.
 * @remarks this screen could be better optimised + better broken into composite parts.
 */
export const CalculatorsScreen: RootStackScreen<'Calculators'> = () => {
  const {
    theme: { colours },
    styles,
  } = useThemedStyles(stylesFn);

  const inputs = useRef<TDEEFormData>(DEFAULT_FORM_DATA);

  const [activityLevel, setActivityLevel] = useState<(typeof ACTIVITY_LEVELS)[number]>(ACTIVITY_LEVELS[2]);
  const [gender, setGender] = useState<keyof typeof Genders>(Genders.MALE);
  const [formComplete, setFormComplete] = useState(false);
  console.log({ formComplete });

  /* Clear all inputs when screen is unfocused */
  useFocusEffect(
    useCallback(() => {
      const clearAllFields = () => {
        inputs.current = DEFAULT_FORM_DATA;
      };

      return clearAllFields;
    }, []),
  );

  const handleCalculatorChange = (property: string, value: string | number) => {
    // Check number fields have valid values.
    if (['age', 'height', 'weight'].includes(property)) {
      if (typeof value === 'string' && !isInputNumber(value)) {
        return;
      }
    }

    const newValues = {
      ...inputs.current,
      [property]: value,
    };

    // Check if all fields are filled in.
    const complete = Object.values(newValues).every(prop => prop !== '' && prop !== null && prop !== undefined);
    setFormComplete(complete);

    inputs.current = newValues;
  };

  function calculateTDEE() {
    if (TDEEFormIncomplete) {
      return;
    }

    const { age, weight, height, activityMultiplier } = inputs.current;

    const genderVariable = gender === Genders.MALE ? MALE_TDEE_VARIABLE : FEMALE_TDEE_VARIABLE;

    const BMR = calculateBMR(Number(weight), Number(height), Number(age), genderVariable);

    const finalTDEE = Math.round(BMR * Number(activityMultiplier));

    Alert.alert(`Your TDEE is ${finalTDEE} calories.`);
  }

  /* Boolean indicating if any inputs are incomplete */
  const TDEEFormIncomplete = !formComplete;

  return (
    <KeyboardAvoidingView style={styles.screenContainer}>
      <ScrollView style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            <Text preset="heading" style={styles.cacluateTDEEText}>
              {i18n.t('screens.calculators.calculateTitle')}
            </Text>
            <View style={styles.TDEEFields}>
              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label={i18n.t('screens.calculators.age')}
                  placeholder="26"
                  onInputChange={(text: string) => handleCalculatorChange('age', text)}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.fieldContainer}>
                <InputWithLabel
                  label={`${i18n.t('screens.calculators.weight')} (kg)`}
                  placeholder="74"
                  onInputChange={(text: string) => handleCalculatorChange('weight', text)}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Space units={3} />
                <InputWithLabel
                  label={`${i18n.t('screens.calculators.height')} (cm)`}
                  placeholder="178"
                  onInputChange={(text: string) => handleCalculatorChange('height', text)}
                  keyboardType="number-pad"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Space units={3} />
                <Text preset="formHelper">{i18n.t('screens.calculators.gender')}</Text>
                <View style={styles.radiosContainer}>
                  {/* TODO: Make dropdown instead of radios */}
                  <RadioButton label={i18n.t('screens.calculators.male')} selected={gender === Genders.MALE} onPress={() => setGender(Genders.MALE)} />
                  <Space horizontal units={3} />
                  <RadioButton label={i18n.t('screens.calculators.female')} selected={gender === Genders.FEMALE} onPress={() => setGender(Genders.FEMALE)} />
                </View>
              </View>
            </View>
            <Space units={3} />
            <Text preset="formHelper" style={styles.activityLevelText}>
              {i18n.t('screens.calculators.activityLevel')}
            </Text>
            <Picker
              selectedValue={activityLevel}
              onValueChange={value => {
                setActivityLevel(value);
                // @ts-expect-error value is the type of selectedValue but it's actually the value prop of the current item
                handleCalculatorChange('activityMultiplier', value);
              }}>
              {ACTIVITY_LEVELS.map(level => (
                <Picker.Item label={level.label} value={level.multiplier} key={level.multiplier} />
              ))}
            </Picker>
            <TouchableOpacity
              disabled={!formComplete}
              onPress={calculateTDEE}
              style={[styles.calculateButton, { backgroundColor: !formComplete ? colours.palette.neutral300 : colours.palette.green }]}>
              <Text colour="#fff">{i18n.t('screens.calculators.calculate')}</Text>
            </TouchableOpacity>
            <Space units={5} />

            <Converter />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    pickerLabel: {
      color: theme.colours.palette.neutral800,
      fontSize: 16,
    },
    screenContainer: {
      paddingHorizontal: theme.spacing.base,
      flex: 1,
      backgroundColor: theme.colours.background,
    },
    activityLevelText: {
      marginBottom: 1,
    },
    cacluateTDEEText: {
      marginVertical: 10,
    },
    TDEEFields: {
      ...theme.layout.spaceBetweenRow,
      flexWrap: 'wrap',
    },
    fieldContainer: {
      width: '48%',
    },
    radiosContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    calculateButton: {
      padding: 10,
      alignItems: 'center',
      borderRadius: 6,
    },
    buttonText: {
      color: '#fff',
    },
    flex: { flex: 1 },
  });
