import { InputWithLabel } from '@components/InputWithLabel';
import { Text } from '@components/Text';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { Goals, useGoals } from '@store/goals';
import { Theme } from '@theme';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import shallow from 'zustand/shallow';

import { Space } from '@app/components/Space';
import { isInputNumber } from '@app/lib/validation';
import { RootStackScreen } from '@app/navigation/types';

const DEFAULT_GOALS = { calories: 2000, protein: 80 };

export const GoalsScreen: RootStackScreen<'Goals'> = () => {
  const { styles } = useThemedStyles(stylesFn);

  const updateGoals = useGoals(state => state.updateGoals);
  const currentGoals = useGoals(state => ({ calories: state.calories, protein: state.protein }), shallow);

  const [inputs, setInputs] = useState<Goals>(currentGoals || DEFAULT_GOALS);

  const [calories, setCalories] = useState(String(currentGoals.calories || DEFAULT_GOALS.calories));
  const [protein, setProtein] = useState(String(currentGoals.protein || DEFAULT_GOALS.protein));

  const handleChange = (name: keyof Goals, value: string) => {
    /* Prevent entering non-numbers */
    if (!isInputNumber(value)) {
      return;
    }

    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: Number(value),
    }));
  };

  const handleSaveUpdatedGoals = () => {
    const newGoals = {
      calories: Number(calories),
      protein: Number(protein),
    };

    // updateGoals(inputs);
    updateGoals(newGoals);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Calories"
            // placeholder="74"
            onInputChange={setCalories}
            // onInputChange={(text: string) => handleChange('calories', text)}
            value={calories}
            // value={String(inputs.calories)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-calories-input"
          />
        </View>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Protein"
            // placeholder="74"
            onInputChange={setProtein}
            // onInputChange={(text: string) => handleChange('protein', text)}
            value={protein}
            // value={String(inputs.protein)}
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
