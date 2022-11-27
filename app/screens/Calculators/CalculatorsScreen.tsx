import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
//@ts-ignore no types available
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

import { RadioButton } from '@app/components/RadioButton';
import { Space } from '@app/components/Space';
import { Text } from '@app/components/Text';
import {
  ACTIVITY_LEVELS,
  FEMALE_TDEE_VARIABLE,
  Genders,
  MALE_TDEE_VARIABLE,
} from '@app/config/constants';
import { colours as themeColours } from '@app/config/themes';
import { RootStackScreen } from '@app/navigation/types';
import { ActivityLevel } from '@app/types';
import { calculateBMR, isInputNumber } from '@app/utils/calculators';

import { Converter } from '../components/Converter';
import { InputWithLabel } from '../components/InputWithLabel';

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
  const { colours } = useTheme();

  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    ACTIVITY_LEVELS[0],
  );
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

    setFormData(prevData => ({
      ...prevData,
      [property]: value,
    }));
  };

  /* Boolean indicating if any inputs are incomplete */
  const TDEEFormIncomplete = Object.values(formData).some(
    property => !property,
  );

  const calculateTDEE = () => {
    if (TDEEFormIncomplete) {
      return;
    }

    const { age, weight, height, gender, activityMultiplier } = formData;

    const genderVariable =
      gender === Genders.MALE ? MALE_TDEE_VARIABLE : FEMALE_TDEE_VARIABLE;

    const BMR = calculateBMR(
      Number(weight),
      Number(height),
      Number(age),
      genderVariable,
    );

    const finalTDEE = Math.round(BMR * Number(activityMultiplier));

    Alert.alert(`Your TDEE is ${finalTDEE} calories.`);
  };

  return (
    <Container
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={80}>
      <ContentContainer>
        <Text color={colours.darkGrey} fontSize="xxl" bold marginVertical={2}>
          Calculate TDEE
        </Text>
        <TDEEFields>
          <FieldContainer>
            <InputWithLabel
              label="Age"
              placeholder="26"
              onInputChange={(text: string) =>
                handleCalculatorChange('age', text)
              }
              value={formData.age}
            />
          </FieldContainer>
          <FieldContainer>
            <InputWithLabel
              label="Weight (kg)"
              placeholder="74"
              onInputChange={(text: string) =>
                handleCalculatorChange('weight', text)
              }
              value={formData.weight}
            />
          </FieldContainer>
          <FieldContainer>
            <Space units={3} />
            <InputWithLabel
              label="Height (cm)"
              placeholder="178"
              onInputChange={(text: string) =>
                handleCalculatorChange('height', text)
              }
              value={formData.height}
            />
          </FieldContainer>
          <FieldContainer>
            <Space units={3} />
            <Text color={colours.darkGrey} fontSize="lg" bold>
              Gender
            </Text>
            <RadiosContainer>
              <RadioButton
                label="Male"
                selected={formData.gender === Genders.MALE}
                onPress={() => handleCalculatorChange('gender', Genders.MALE)}
              />
              <RadioButton
                label="Female"
                selected={formData.gender === Genders.FEMALE}
                onPress={() => handleCalculatorChange('gender', Genders.FEMALE)}
              />
            </RadiosContainer>
          </FieldContainer>
        </TDEEFields>
        <Text
          color={colours.darkGrey}
          fontSize="lg"
          bold
          marginTop={5}
          marginBottom={2}>
          Activity level
        </Text>
        <DropDownPicker
          items={ACTIVITY_LEVELS}
          open={dropdownOpen}
          setOpen={setDropdownOpen}
          setValue={setActivityLevel}
          //@ts-ignore typing on this library is a bit odd
          value={activityLevel}
          onSelectItem={item => {
            //@ts-ignore typing on this library is a bit odd
            handleCalculatorChange('activityMultiplier', item.multiplier);
          }}
          labelStyle={styles.pickerLabel}
        />
        <CalculateButton disabled={TDEEFormIncomplete} onPress={calculateTDEE}>
          <Text color="#fff" bold fontSize="lg">
            Calculate TDEE
          </Text>
        </CalculateButton>
        <Space units={5} />
        <Converter />
      </ContentContainer>
    </Container>
  );
};

const CalculateButton = styled.TouchableOpacity<{ disabled: boolean }>`
  padding: 15px;
  margin-top: 15px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.grey : theme.colours.green};
  align-items: center;
  border-radius: 6px;
`;

const Container = styled(KeyboardAwareScrollView)`
  background-color: #fff;
  flex: 1;
`;

const ContentContainer = styled.View`
  padding-left: 20px;
  padding-right: 20px;
  flex: 1;
`;

const TDEEFields = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FieldContainer = styled.View`
  width: 48%;
`;

const RadiosContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const styles = StyleSheet.create({
  pickerLabel: {
    color: themeColours.darkGrey,
    fontSize: 16,
  },
});
