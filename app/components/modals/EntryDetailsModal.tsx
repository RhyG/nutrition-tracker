import Icon from '@expo/vector-icons/Feather';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { isInputNumber } from '@app/lib/validation';
import { useGoalsStore } from '@app/store/goals';
import { useJournalStore } from '@app/store/journal';
import { useModalStore } from '@app/store/modal';
import { Theme } from '@app/theme';
import { Day, JournalEntry } from '@app/types';

import { Space } from '../Space';
import { Text } from '../Text';
import { ProgressIndicator } from '../edit-entry/ProgressIndicator';

const { width } = Dimensions.get('window');

const defaultValues = { name: '', calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

function inputsValid({ name, calories, protein, carbohydrates, fat }: { name: string; calories: number; protein: number; carbohydrates: number; fat: number }) {
  // Check if value of name is not empty.
  const nameIsValid = name.length > 0;

  // Check all macros are valid numbers.
  const caloriesIsValid = isInputNumber(String(calories));
  const proteinIsValid = isInputNumber(String(protein));
  const carbohydratesIsValid = isInputNumber(String(carbohydrates));
  const fatIsValid = isInputNumber(String(fat));

  return nameIsValid && caloriesIsValid && proteinIsValid && carbohydratesIsValid && fatIsValid;
}

type Props = {
  entry: JournalEntry;
  day: Day;
};

export const Component = (props: Props) => {
  const { entry, day } = props;
  const { styles } = useThemedStyles(stylesFn);

  const closeModal = useModalStore(state => state.closeModal);

  const { calories: goalCalories, protein: goalProtein, carbohydrates: goalCarbohydrates, fat: goalFat } = useGoalsStore(useShallow(state => ({ ...state })));

  const removeItem = useJournalStore(state => state.removeItem);

  function calculatePercentage(current: number, max: number): number {
    // The formula to calculate percentage is (current / max) * 100
    const percentage = (current / max) * 100;

    // Rounding to 2 decimal places for better readability
    return Math.round((percentage + Number.EPSILON) * 100) / 100;
  }

  function onDeletePress() {
    removeItem(entry.id, day);
    closeModal();
  }

  return (
    <View style={styles.container}>
      <Text preset="subheading" style={styles.name} numberOfLines={2}>
        {entry.name}
      </Text>

      <Space units={2} />

      <View style={styles.statsNumbers}>
        <Macro title="Calories" amount={entry.calories} />
        <Macro title="Protein" amount={entry.protein} />
        <Macro title="Carbs" amount={entry.carbohydrates} />
        <Macro title="Fat" amount={entry.fat} />
      </View>

      <View style={styles.divider} />

      <Text preset="subheading">Progress to Goals</Text>
      <View style={styles.progressIndicatorsContainer}>
        <ProgressIndicator progress={calculatePercentage(entry.calories, goalCalories)} />
        <ProgressIndicator progress={calculatePercentage(entry.protein, goalProtein)} />
        <ProgressIndicator progress={calculatePercentage(entry.carbohydrates, goalCarbohydrates)} />
        <ProgressIndicator progress={calculatePercentage(entry.fat, goalFat)} />
      </View>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => {}}>
          <Icon name="save" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={onDeletePress}>
          <Icon name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

function Macro({ title, amount }: { title: string; amount: number }) {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  return (
    <View style={styles.titleAndNumberContainer}>
      <Text colour={colours.palette.neutral400} size="sm">
        {title}
      </Text>
      <Text size="lg" weight="semiBold">
        {amount}
      </Text>
    </View>
  );
}

export const snapPoints = ['42%'];

const stylesFn = ({ spacing, colours, layout }: Theme) =>
  StyleSheet.create({
    container: {
      width,
      paddingHorizontal: spacing.base,
    },
    name: {
      textAlign: 'center',
    },
    macrosContainer: {},
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    button: {
      height: 40,
      width: 40,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButton: {
      backgroundColor: colours.palette.green,
    },
    removeButton: {
      backgroundColor: colours.palette.angry500,
      marginLeft: spacing.small,
    },
    barsContainer: {
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    statsNumbers: {
      ...layout.spaceBetweenRow,
      paddingHorizontal: spacing.massive,
    },
    bars: {
      ...layout.spaceBetweenRow,
      alignItems: 'flex-end',
      width: '100%',
    },
    macroHeading: {
      width: '45%',
    },
    titleAndNumberContainer: {
      alignItems: 'flex-end',
    },
    divider: {
      height: 1,
      backgroundColor: colours.palette.neutral200,
      marginVertical: spacing.small,
    },
    actionButtonsContainer: {
      marginTop: spacing.medium,
      flexDirection: 'row',
    },
    progressIndicatorsContainer: {
      ...layout.spaceBetweenRow,
      paddingTop: spacing.medium,
    },
  });
