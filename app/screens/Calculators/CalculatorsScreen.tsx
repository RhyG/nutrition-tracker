import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
//@ts-ignore no types available
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { RadioButton } from '../../components/RadioButton';
import { Space } from '../../components/Space';
import { Text } from '../../components/Text';
import { ACTIVITY_LEVELS, FEMALE_TDEE_VARIABLE, Genders, MALE_TDEE_VARIABLE } from '../../config/constants';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { isInputNumber } from '../../lib/validation';
import { calculateBMR } from '../../lib/calculators';
import { Theme } from '../../theme';

import { RootStackScreen } from '@app/navigation/types';
import { ActivityLevel } from '@app/types';

import { Converter } from './components/Converter';
import { InputWithLabel } from './components/InputWithLabel';

type TDEEFormData = {
  age: string;
  weight: string;
  height: string;
  gender: Genders;
  activityMultiplier: number;
};

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

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(ACTIVITY_LEVELS[0]);
  const [formData, setFormData] = useState<TDEEFormData>(DEFAULT_FORM_DATA);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* Clear all inputs when screen is unfocused */
  useFocusEffect(
    useCallback(() => {
      const clearAllFields = () => {
        setFormData(DEFAULT_FORM_DATA);
      };

      return () => clearAllFields();
    }, []),
  );

  const handleCalculatorChange = (property: string, value: string) => {
    // Check number fields have valid values.
    if (['age', 'height', 'weight'].includes(property)) {
      if (!isInputNumber(value)) {
        return;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [property]: value,
    }));
  };

  /* Boolean indicating if any inputs are incomplete */
  const TDEEFormIncomplete = Object.values(formData).some((property) => !property);

  const calculateTDEE = () => {
    if (TDEEFormIncomplete) {
      return;
    }

    const { age, weight, height, gender, activityMultiplier } = formData;

    const genderVariable = gender === Genders.MALE ? MALE_TDEE_VARIABLE : FEMALE_TDEE_VARIABLE;

    const BMR = calculateBMR(Number(weight), Number(height), Number(age), genderVariable);

    const finalTDEE = Math.round(BMR * Number(activityMultiplier));

    Alert.alert(`Your TDEE is ${finalTDEE} calories.`);
  };

  return (
    <KeyboardAwareScrollView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={80}>
      <View style={styles.contentContainer}>
        <Text preset="subheading" style={styles.cacluateTDEEText}>
          Calculate TDEE
        </Text>
        <View style={styles.TDEEFields}>
          <View style={styles.fieldContainer}>
            <InputWithLabel label="Age" placeholder="26" onInputChange={(text: string) => handleCalculatorChange('age', text)} value={formData.age} />
          </View>
          <View style={styles.fieldContainer}>
            <InputWithLabel
              label="Weight (kg)"
              placeholder="74"
              onInputChange={(text: string) => handleCalculatorChange('weight', text)}
              value={formData.weight}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Space units={3} />
            <InputWithLabel
              label="Height (cm)"
              placeholder="178"
              onInputChange={(text: string) => handleCalculatorChange('height', text)}
              value={formData.height}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Space units={3} />
            <Text size="lg" weight="bold">
              Gender
            </Text>
            <View style={styles.radiosContainer}>
              <RadioButton label="Male" selected={formData.gender === Genders.MALE} onPress={() => handleCalculatorChange('gender', Genders.MALE)} />
              <RadioButton label="Female" selected={formData.gender === Genders.FEMALE} onPress={() => handleCalculatorChange('gender', Genders.FEMALE)} />
            </View>
          </View>
        </View>
        <Text size="lg" weight="bold" style={styles.activityLevelText}>
          Activity level
        </Text>
        <DropDownPicker
          items={ACTIVITY_LEVELS}
          open={dropdownOpen}
          setOpen={setDropdownOpen}
          setValue={setActivityLevel}
          //@ts-ignore typing on this library is a bit odd
          value={activityLevel}
          onSelectItem={(item) => {
            //@ts-ignore typing on this library is a bit odd
            handleCalculatorChange('activityMultiplier', item.multiplier);
          }}
          labelStyle={styles.pickerLabel}
        />
        <TouchableOpacity
          disabled={TDEEFormIncomplete}
          onPress={calculateTDEE}
          style={[styles.calculateButton, { backgroundColor: TDEEFormIncomplete ? colours.palette.neutral500 : colours.palette.green }]}>
          <Text weight="bold" size="lg" style={styles.buttonText}>
            Calculate TDEE
          </Text>
        </TouchableOpacity>
        <Space units={5} />
        <Converter />
      </View>
    </KeyboardAwareScrollView>
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
    contentContainer: {
      paddingHorizontal: 20,
      flex: 1,
    },
    activityLevelText: {
      marginTop: 5,
      marginBottom: 2,
    },
    cacluateTDEEText: {
      marginVertical: 2,
    },
    TDEEFields: {
      ...theme.layout.spaceBetweenRow,
      flexWrap: 'wrap',
    },
    fieldContainer: {
      width: '48%',
    },
    radiosContainer: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'center',
      flex: 1,
    },
    calculateButton: {
      padding: 15,
      marginTop: 15,
      alignItems: 'center',
      borderRadius: 6,
    },
    buttonText: {
      color: '#fff',
    },
  });
