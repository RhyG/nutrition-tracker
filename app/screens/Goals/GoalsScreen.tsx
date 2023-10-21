import type { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { InputWithLabel } from '@app/components/InputWithLabel';
import { Space } from '@app/components/Space';
import { Text } from '@app/components/Text';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import type { RootStackParamList } from '@app/navigation';
import { DefaultGoals, useGoalsStore } from '@app/store/goals';
import { Theme } from '@app/theme';

type Props = StackScreenProps<RootStackParamList, 'Goals'>;

export function GoalsScreen({ navigation }: Props) {
  const {
    styles,
    theme: { spacing },
  } = useThemedStyles(stylesFn);

  const goalInputs = useRef(DefaultGoals);

  const { calories, protein, carbohydrates, fat, updateGoals } = useGoalsStore(useShallow(state => ({ ...state })));

  const handleSaveUpdatedGoals = useCallback(() => {
    const values = goalInputs.current;
    const newGoals = {
      calories: Number(values.calories),
      protein: Number(values.protein),
      carbohydrates: Number(values.carbohydrates),
      fat: Number(values.fat),
    };

    updateGoals(newGoals);
  }, [updateGoals]);

  function onChangeGoals(key: string, value: string) {
    goalInputs.current = {
      ...goalInputs.current,
      [key]: value,
    };
  }

  useEffect(
    function saveGoalsOnBlur() {
      const unsubscribe = navigation.addListener('blur', handleSaveUpdatedGoals);

      return unsubscribe;
    },
    [navigation, handleSaveUpdatedGoals],
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.inputsContainer}>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Calories"
            onInputChange={text => onChangeGoals('calories', text)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-calories-input"
            defaultValue={String(calories)}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Protein"
            onInputChange={text => onChangeGoals('protein', text)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-protein-input"
            defaultValue={String(protein)}
          />
        </View>
      </View>
      <View style={[styles.inputsContainer, { marginTop: spacing.small }]}>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Carbohydrates"
            onInputChange={text => onChangeGoals('carbohydrates', text)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-calories-input"
            defaultValue={String(carbohydrates)}
          />
        </View>
        <View style={styles.inputContainer}>
          <InputWithLabel
            label="Fat"
            onInputChange={text => onChangeGoals('fat', text)}
            keyboardType="number-pad"
            onBlur={handleSaveUpdatedGoals}
            testID="goals-screen-protein-input"
            defaultValue={String(fat)}
          />
        </View>
      </View>
      <Space units={4} />
      <Text>Goals will automatically update and are used to track your progress in the journal and weekly overview.</Text>
    </View>
  );
}

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
      backgroundColor: theme.colours.background,
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
