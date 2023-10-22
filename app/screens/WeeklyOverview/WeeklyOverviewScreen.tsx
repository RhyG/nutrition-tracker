import { Space } from '@components/Space';
import { Text } from '@components/Text';
import { DAYS } from '@config/constants';
import { Theme } from '@theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { getCurrentMacroTotal } from '@app/lib/macros';
import { RootStackScreen } from '@app/navigation';
import { useGoalsStore } from '@app/store/goals';
import { useJournalStore } from '@app/store/journal';

import { Bar } from './components';
import { useWeeklyAverages } from './hooks/useWeeklyAverages';

export const WeeklyOverviewScreen: RootStackScreen<'Overview'> = () => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const { averageProtein, averageCalories } = useWeeklyAverages();

  const calorieGoal = useGoalsStore(state => state.calories);
  const proteinGoal = useGoalsStore(state => state.protein);

  const journalData = useJournalStore(state => state.journalData);

  return (
    <View style={styles.screenContainer}>
      <View>
        <View style={styles.statsNumbers}>
          <Text size="xxl" weight="semiBold" style={styles.macroHeading}>
            Calories
          </Text>
          <View style={styles.titleAndNumberContainer}>
            <Text colour={colours.palette.neutral400} size="md">
              Average
            </Text>
            <Text size="xl" weight="semiBold">
              {averageCalories}
            </Text>
          </View>
          <View style={styles.titleAndNumberContainer}>
            <Text colour={colours.palette.neutral400} size="md">
              Goal
            </Text>
            <Text size="xl" weight="semiBold">
              {calorieGoal}
            </Text>
          </View>
        </View>
        <View style={styles.barsContainer}>
          <View style={styles.bars}>
            {DAYS.map(day => {
              return <Bar amount={getCurrentMacroTotal('calories', journalData[day])} goal={calorieGoal} day={day} key={day} type="calories" />;
            })}
          </View>
        </View>
      </View>

      <Space units={4} />

      <View style={styles.statsNumbers}>
        <Text size="xxl" weight="semiBold" style={styles.macroHeading}>
          Protein
        </Text>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            Average
          </Text>
          <Text size="xl" weight="semiBold">
            {averageProtein}
          </Text>
        </View>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            Goal
          </Text>
          <Text size="xl" weight="semiBold">
            {proteinGoal}
          </Text>
        </View>
      </View>
      <View style={styles.barsContainer}>
        <View style={styles.bars}>
          {DAYS.map(day => (
            <Bar amount={getCurrentMacroTotal('protein', journalData[day])} goal={proteinGoal} day={day} key={day} type="protein" />
          ))}
        </View>
      </View>
    </View>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: theme.colours.background,
      ...theme.spacing.screen,
    },
    barsContainer: {
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    statsNumbers: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'flex-end',
    },
    bars: {
      ...theme.layout.spaceBetweenRow,
      alignItems: 'flex-end',
      width: '100%',
    },
    macroHeading: {
      width: '45%',
    },
    titleAndNumberContainer: {
      alignItems: 'flex-end',
    },
  });
