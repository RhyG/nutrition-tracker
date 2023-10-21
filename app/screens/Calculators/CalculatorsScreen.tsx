import { InputWithLabel } from '@components/InputWithLabel';
import { Space } from '@components/Space';
import { Text } from '@components/Text';
import { ACTIVITY_LEVELS, FEMALE_TDEE_VARIABLE, MALE_TDEE_VARIABLE } from '@config/constants';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from '@theme';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { RadioButton } from '@app/components/RadioButton';
import { calculateBMR } from '@app/lib/calculators';
import { isInputNumber } from '@app/lib/validation';
import { RootStackScreen } from '@app/navigation';

import { Converter } from './components';

type TDEEFormData = {
  age: string;
  weight: string;
  height: string;
  gender: keyof typeof Genders;
  activityMultiplier: number;
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
  activityMultiplier: 1.2,
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

  const [gender, setGender] = useState<keyof typeof Genders>(Genders.MALE);

  const inputs = useRef<TDEEFormData>(DEFAULT_FORM_DATA);

  const [activityLevel, setActivityLevel] = useState<(typeof ACTIVITY_LEVELS)[number]>(ACTIVITY_LEVELS[0]);
  const [activityLevelDropdownOpen, setActivityLevelDropdownOpen] = useState(false);

  /* Clear all inputs when screen is unfocused */
  useFocusEffect(
    useCallback(() => {
      const clearAllFields = () => {
        inputs.current = DEFAULT_FORM_DATA;
      };

      return clearAllFields;
    }, []),
  );

  const handleCalculatorChange = (property: string, value: string) => {
    // Check number fields have valid values.
    if (['age', 'height', 'weight'].includes(property)) {
      if (!isInputNumber(value)) {
        return;
      }
    }

    inputs.current = {
      ...inputs.current,
      [property]: value,
    };
  };

  /* Boolean indicating if any inputs are incomplete */
  const TDEEFormIncomplete = Object.values(inputs.current).some(property => !property);

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

  return (
    <View style={styles.screenContainer}>
      <Text preset="heading" style={styles.cacluateTDEEText}>
        Calculate TDEE
      </Text>
      <View style={styles.TDEEFields}>
        <View style={styles.fieldContainer}>
          <InputWithLabel label="Age" placeholder="26" onInputChange={(text: string) => handleCalculatorChange('age', text)} />
        </View>
        <View style={styles.fieldContainer}>
          <InputWithLabel
            label="Weight (kg)"
            placeholder="74"
            onInputChange={(text: string) => handleCalculatorChange('weight', text)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Space units={3} />
          <InputWithLabel
            label="Height (cm)"
            placeholder="178"
            onInputChange={(text: string) => handleCalculatorChange('height', text)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.fieldContainer}>
          <Space units={3} />
          <Text preset="formHelper">Gender</Text>
          <View style={styles.radiosContainer}>
            {/* TODO: Make dropdown instead of radios */}
            <RadioButton label="Male" selected={gender === Genders.MALE} onPress={() => setGender(Genders.MALE)} />
            <Space horizontal units={3} />
            <RadioButton label="Female" selected={gender === Genders.FEMALE} onPress={() => setGender(Genders.FEMALE)} />
            {/* <DropDownPicker
              //@ts-expect-error typing on this library is a bit odd
              items={Object.values(Genders)}
              open={genderDropdownOpen}
              setOpen={setGenderDropdownOpen}
              // maxHeight={44}
              labelStyle={{ height: 4 }}
              setValue={setSelectedGender}
              value={selectedGender}
              zIndex={1000}
              onSelectItem={item => {
                //@ts-expect-error typing on this library is a bit odd
                handleCalculatorChange('gender', item);
              }}
              labelStyle={styles.pickerLabel}
            /> */}
          </View>
        </View>
      </View>
      <Space units={3} />
      <Text preset="formHelper" style={styles.activityLevelText}>
        Activity level
      </Text>
      <DropDownPicker
        //@ts-expect-error typing on this library is a bit odd
        items={ACTIVITY_LEVELS}
        open={activityLevelDropdownOpen}
        setOpen={setActivityLevelDropdownOpen}
        setValue={setActivityLevel}
        //@ts-expect-error typing on this library is a bit odd
        value={activityLevel}
        zIndex={1}
        onSelectItem={item => {
          //@ts-expect-error typing on this library is a bit odd
          handleCalculatorChange('activityMultiplier', item.multiplier);
        }}
        labelStyle={styles.pickerLabel}
      />
      <TouchableOpacity
        disabled={TDEEFormIncomplete}
        onPress={calculateTDEE}
        style={[styles.calculateButton, { backgroundColor: TDEEFormIncomplete ? colours.palette.neutral300 : colours.palette.green }]}>
        <Text colour="#fff">Calculate TDEE</Text>
      </TouchableOpacity>
      <Space units={5} />

      <Converter />
    </View>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
    },
    pickerLabel: {
      color: theme.colours.palette.neutral800,
      fontSize: 16,
    },
    screenContainer: {
      paddingHorizontal: 20,
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
      // ...theme.layout.spaceBetweenRow,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    calculateButton: {
      padding: 10,
      marginTop: 15,
      alignItems: 'center',
      borderRadius: 6,
    },
    buttonText: {
      color: '#fff',
    },
  });
