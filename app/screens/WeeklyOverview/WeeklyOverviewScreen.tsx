import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

import { Space } from '@components/Space';
import { Text } from '@components/Text';
import { DAYS } from '@config/constants';
import { Theme } from '@theme';
import { useGoals } from '@app/store/goals';
import { useJournal } from '@app/store/journal';
import { getCurrentCalories, getCurrentProtein } from '@app/lib/macros';
import { RootStackScreen } from '@app/navigation/types';

import { Bar } from './components';
import { useWeeklyAverages } from './hooks/useWeeklyAverages';
import { useThemedStyles } from '@app/hooks/useThemedStyles';

export const WeeklyOverviewScreen: RootStackScreen<'WeeklyOverview'> = () => {
  const { styles } = useThemedStyles(stylesFn);

  const { averageProtein, averageCalories } = useWeeklyAverages();

  const calorieGoal = useGoals((state) => state.calories);
  const proteinGoal = useGoals((state) => state.protein);

  const journalData = useJournal((state) => state.journalData);

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View>
          <View style={styles.statsNumbers}>
            <Text size="xxl" weight="bold" style={styles.macroHeading}>
              Calories
            </Text>
            <View style={styles.titleAndNumberContainer}>
              <Text style={styles.heading} size="md">
                Average
              </Text>
              <Text size="xl" weight="bold">
                {averageCalories}
              </Text>
            </View>
            <View style={styles.titleAndNumberContainer}>
              <Text style={styles.heading} size="md">
                Goal
              </Text>
              <Text size="xl" weight="bold">
                {calorieGoal}
              </Text>
            </View>
          </View>
          <View style={styles.barsContainer}>
            <View style={styles.bars}>
              {DAYS.map((day) => {
                return <Bar amount={getCurrentCalories(journalData[day])} goal={calorieGoal} day={day} key={day} type="calories" />;
              })}
            </View>
          </View>
        </View>
        <>
          <Space units={4} />
          <View style={styles.statsNumbers}>
            <Text size="xxl" weight="bold" style={styles.macroHeading}>
              Protein
            </Text>
            <View style={styles.titleAndNumberContainer}>
              <Text style={styles.heading} size="lg">
                Average
              </Text>
              <Text size="xl" weight="bold">
                {averageProtein}
              </Text>
            </View>
            <View style={styles.titleAndNumberContainer}>
              <Text style={styles.heading} size="lg">
                Goal
              </Text>
              <Text size="xl" weight="bold">
                {proteinGoal}
              </Text>
            </View>
          </View>
          <View style={styles.barsContainer}>
            <View style={styles.bars}>
              {DAYS.map((day) => {
                return <Bar amount={getCurrentProtein(journalData[day])} goal={proteinGoal} day={day} key={day} type="protein" />;
              })}
            </View>
          </View>
        </>
      </View>
    </MenuProvider>
  );
};

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
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
    heading: {
      color: theme.colours.palette.neutral400,
    },
    titleAndNumberContainer: {
      alignItems: 'flex-end',
    },
  });
