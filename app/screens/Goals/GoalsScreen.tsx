import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import shallow from 'zustand/shallow';

import { Text } from '@components/Text';
import { InputWithLabel } from '@components/InputWithLabel';
import { RootStackScreen } from '@app/navigation/types';
import { Goals, useGoals } from '@store/goals';
import { isInputNumber } from '@app/lib/validation';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { Theme } from '@theme';
import { Space } from '@app/components/Space';

const DEFAULT_GOALS = { calories: 2000, protein: 80 };

export const GoalsScreen: RootStackScreen<'Goals'> = () => {
  const { styles } = useThemedStyles(stylesFn);

  const updateGoals = useGoals((state) => state.updateGoals);
  const currentGoals = useGoals((state) => ({ calories: state.calories, protein: state.protein }), shallow);

  const [inputs, setInputs] = useState<Goals>(currentGoals || DEFAULT_GOALS);

  const handleChange = (name: keyof Goals, value: string) => {
    /* Prevent entering non-numbers */
    if (!isInputNumber(value)) {
      return;
    }

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: Number(value),
    }));
  };

  const handleSaveUpdatedGoals = () => {
    updateGoals(inputs);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Calories"
            // placeholder="74"
            onInputChange={(text: string) => handleChange('calories', text)}
            value={String(inputs.calories)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-calories-input"
          />
        </View>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Protein"
            // placeholder="74"
            onInputChange={(text: string) => handleChange('protein', text)}
            value={String(inputs.protein)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-protein-input"
          />
        </View>
      </View>
      <Space units={4} />
      <Text>Goals will automatically update and are used to track your progress in the journal and weekly overview.</Text>
    </View>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    input: {
      padding: 10,
      borderRadius: 6,
      fontSize: 18,
      backgroundColor: theme.colours.palette.neutral200,
      color: theme.colours.palette.neutral800,
      marginTop: 10,
      marginBottom: 10,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: '#fff',
      ...theme.spacing.screen,
    },
    inputsContainer: {
      ...theme.layout.spaceBetweenRow,
    },
    inputContainer: {
      width: '48%',
      justifyContent: 'center',
    },
  });
