import { DAYS } from '@config/constants';
import { Theme } from '@theme';
import i18n from 'i18n-js';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { useMacroGoals } from '@app/hooks/useMacroGoals';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { getCurrentMacroTotal } from '@app/lib/macros';
import { RootStackScreen } from '@app/navigation';
import { useFoodLogStore } from '@app/store/journal';

import { Space } from '@components/Space';
import { Text } from '@components/Text';

import { Bar } from './components';
import { useWeeklyAverages } from './hooks/useWeeklyAverages';

export const WeeklyOverviewScreen: RootStackScreen<'Overview'> = () => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const { averageProtein, averageCalories, averageCarbohydrates, averageFat } = useWeeklyAverages();

  const { goalCalories, goalProtein, goalCarbohydrates, goalFat } = useMacroGoals();

  const foodLogData = useFoodLogStore(state => state.foodLogData);

  return (
    <ScrollView style={styles.screenContainer}>
      <View>
        <View style={styles.statsNumbers}>
          <Text size="xxl" weight="semiBold" style={styles.macroHeading}>
            {i18n.t('macros.calories')}
          </Text>
          <View style={styles.titleAndNumberContainer}>
            <Text colour={colours.palette.neutral400} size="md">
              {i18n.t('screens.weeklyOverview.average')}
            </Text>
            <Text size="xl" weight="semiBold">
              {averageCalories}
            </Text>
          </View>
          <View style={styles.titleAndNumberContainer}>
            <Text colour={colours.palette.neutral400} size="md">
              {i18n.t('screens.weeklyOverview.goal')}
            </Text>
            <Text size="xl" weight="semiBold">
              {goalCalories}
            </Text>
          </View>
        </View>
        <View style={styles.barsContainer}>
          <View style={styles.bars}>
            {DAYS.map(day => {
              return <Bar amount={getCurrentMacroTotal('calories', foodLogData[day])} goal={goalCalories} day={day} key={day} type="calories" />;
            })}
          </View>
        </View>
      </View>

      <Space units={4} />

      <View style={styles.statsNumbers}>
        <Text size="xxl" weight="semiBold" style={styles.macroHeading}>
          {i18n.t('macros.protein')}
        </Text>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            {i18n.t('screens.weeklyOverview.average')}
          </Text>
          <Text size="xl" weight="semiBold">
            {averageProtein}
          </Text>
        </View>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            {i18n.t('screens.weeklyOverview.goal')}
          </Text>
          <Text size="xl" weight="semiBold">
            {goalProtein}
          </Text>
        </View>
      </View>
      <View style={styles.barsContainer}>
        <View style={styles.bars}>
          {DAYS.map(day => (
            <Bar amount={getCurrentMacroTotal('protein', foodLogData[day])} goal={goalProtein} day={day} key={day} type="protein" />
          ))}
        </View>
      </View>

      <Space units={4} />

      <View style={styles.statsNumbers}>
        <Text size="xxl" weight="semiBold" style={styles.macroHeading}>
          {i18n.t('macros.carbs')}
        </Text>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            {i18n.t('screens.weeklyOverview.average')}
          </Text>
          <Text size="xl" weight="semiBold">
            {averageCarbohydrates}
          </Text>
        </View>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            {i18n.t('screens.weeklyOverview.goal')}
          </Text>
          <Text size="xl" weight="semiBold">
            {goalCarbohydrates}
          </Text>
        </View>
      </View>
      <View style={styles.barsContainer}>
        <View style={styles.bars}>
          {DAYS.map(day => (
            <Bar amount={getCurrentMacroTotal('carbohydrates', foodLogData[day])} goal={goalCarbohydrates} day={day} key={day} type="protein" />
          ))}
        </View>
      </View>

      <Space units={4} />

      <View style={styles.statsNumbers}>
        <Text size="xxl" weight="semiBold" style={styles.macroHeading}>
          {i18n.t('macros.fat')}
        </Text>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            {i18n.t('screens.weeklyOverview.average')}
          </Text>
          <Text size="xl" weight="semiBold">
            {averageFat}
          </Text>
        </View>
        <View style={styles.titleAndNumberContainer}>
          <Text colour={colours.palette.neutral400} size="md">
            {i18n.t('screens.weeklyOverview.goal')}
          </Text>
          <Text size="xl" weight="semiBold">
            {goalFat}
          </Text>
        </View>
      </View>
      <View style={[styles.barsContainer, styles.bottomSpacing]}>
        <View style={styles.bars}>
          {DAYS.map(day => (
            <Bar amount={getCurrentMacroTotal('fat', foodLogData[day])} goal={goalFat} day={day} key={day} type="protein" />
          ))}
        </View>
      </View>
    </ScrollView>
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
    bottomSpacing: { marginBottom: 30 },
  });
