import type { StackScreenProps } from '@react-navigation/stack';
import i18n from 'i18n-js';
import React, { useCallback, useEffect, useRef } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { InputWithLabel } from '@app/components/InputWithLabel';
import { Space } from '@app/components/Space';
import { Text } from '@app/components/Text';
import { useMacroGoals } from '@app/hooks/useMacroGoals';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import type { RootStackParamList } from '@app/navigation';
import { DefaultGoals } from '@app/store/goals';
import { Theme } from '@app/theme';

type Props = StackScreenProps<RootStackParamList, 'Goals'>;

export function GoalsScreen({ navigation }: Props) {
  const {
    styles,
    theme: { spacing },
  } = useThemedStyles(stylesFn);

  const goalInputs = useRef(DefaultGoals);

  const { goalCalories, goalProtein, goalCarbohydrates, goalFat, updateGoals } = useMacroGoals();

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.flex}>
          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <InputWithLabel
                label={i18n.t('macros.calories')}
                accessibilityLabel={i18n.t('macros.calories')}
                onInputChange={text => onChangeGoals('calories', text)}
                keyboardType="number-pad"
                onBlur={handleSaveUpdatedGoals}
                testID="goals-screen-calories-input"
                defaultValue={String(goalCalories)}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputWithLabel
                label={i18n.t('macros.protein')}
                accessibilityLabel={i18n.t('macros.protein')}
                onInputChange={text => onChangeGoals('protein', text)}
                keyboardType="number-pad"
                onBlur={handleSaveUpdatedGoals}
                testID="goals-screen-protein-input"
                defaultValue={String(goalProtein)}
              />
            </View>
          </View>
          <View style={[styles.inputsContainer, { marginTop: spacing.small }]}>
            <View style={styles.inputContainer}>
              <InputWithLabel
                label={i18n.t('macros.carbohydrates')}
                accessibilityLabel={i18n.t('macros.carbohydrates')}
                onInputChange={text => onChangeGoals('carbohydrates', text)}
                keyboardType="number-pad"
                onBlur={handleSaveUpdatedGoals}
                testID="goals-screen-carbohydrates-input"
                defaultValue={String(goalCarbohydrates)}
              />
            </View>
            <View style={styles.inputContainer}>
              <InputWithLabel
                label={i18n.t('macros.fat')}
                accessibilityLabel={i18n.t('macros.fat')}
                onInputChange={text => onChangeGoals('fat', text)}
                keyboardType="number-pad"
                onBlur={handleSaveUpdatedGoals}
                testID="goals-screen-fat-input"
                defaultValue={String(goalFat)}
              />
            </View>
          </View>
          <Space units={4} />
          <Text>{i18n.t('screens.goals.about')}</Text>
        </View>
      </TouchableWithoutFeedback>
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
    flex: { flex: 1 },
  });
