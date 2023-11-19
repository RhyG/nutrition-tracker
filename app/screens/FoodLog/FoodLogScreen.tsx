import { Theme } from '@theme';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, ViewStyle } from 'react-native';

import { Space } from '@app/components/Space';
import { Text } from '@app/components/Text';
import { useEvent } from '@app/hooks/useEvent';
import { useSetDayOnForeground } from '@app/hooks/useSetDayOnForeground';
import { getCurrentMacroTotals } from '@app/lib/macros';
import { RootStackScreen } from '@app/navigation';
import { useGoalsStore } from '@app/store/goals';
import { useFoodLogStore } from '@app/store/journal';
import { ModalNames, useModalStore } from '@app/store/modal';
import { FoodLogEntry } from '@app/types';

import { useThemedStyles } from '@hooks/useThemedStyles';

import { DaySwitcher } from './components/DaySwitcher';
import { FoodRow } from './components/FoodRow';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { Stat } from './components/Stat';
import { useDaySwitcher } from './hooks/useDaySwitcher';
import { useDropdownHeader } from './hooks/useDropdownHeader';

const EMPTY_ARRAY = [] as const;
const LIST_CONTENT_CONTAINER_STYLE = { paddingBottom: 50 };

export const FoodLogScreen: RootStackScreen<'Food Log'> = () => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);
  const { currentDay, handleDayChange } = useDaySwitcher();

  const caloriesGoal = useGoalsStore(state => state.calories);
  const proteinGoal = useGoalsStore(state => state.protein);
  const carbohydratesGoal = useGoalsStore(state => state.carbohydrates);
  const fatGoal = useGoalsStore(state => state.fat);

  const foodLogData = useFoodLogStore(state => state.foodLogData);

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  const listRef = useRef<FlatList>(null);

  const currentDayEntries: FoodLogEntry[] = useMemo(() => foodLogData[currentDay] ?? EMPTY_ARRAY, [currentDay, foodLogData]);

  useDropdownHeader();
  useSetDayOnForeground();

  /**
   * Handles the hiding/showing of the FAB when scrolling.
   * This is to prevent it covering entries when scrolling.
   */
  const listScrollHandler = useEvent((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;

    if (scrollOffsetY > 100) {
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(false);
    }
  });

  /* Scroll to the top of the list when pressing the header */
  const scrollListToTop = useCallback(() => {
    setShowScrollToTopButton(false);
    listRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  // TODO optimise component props
  const renderJournalEntry: ListRenderItem<FoodLogEntry> = useCallback(
    ({ item }) => {
      const onRowPress = function () {
        useModalStore.getState().openModal({ name: ModalNames.EDIT_ENTRY, params: { entry: item, day: currentDay } });
      };

      function onDeleteButtonPress(id: string) {
        useFoodLogStore.getState().removeItem(id, currentDay);
      }

      return <FoodRow entry={item} onPress={onRowPress} onDeleteButtonPress={onDeleteButtonPress} />;
    },
    [currentDay],
  );

  const {
    calories: currentCalories,
    protein: currentProtein,
    fat: currentFat,
    carbohydrates: currentCarbohydrates,
  } = getCurrentMacroTotals(foodLogData[currentDay]);

  return (
    <View style={styles.screenContainer}>
      <View>
        <DaySwitcher currentDay={currentDay} changeDay={handleDayChange} />
        <Space units={3} />

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Stat name="Calories" currentAmount={currentCalories} max={caloriesGoal} progressColour={colours.palette.green} />
            <Space horizontal units={3} />
            <Stat name="Protein" currentAmount={currentProtein} max={proteinGoal} progressColour={colours.palette.orange} />
          </View>
          <Space units={3} />
          <View style={styles.statsRow}>
            <Stat name="Carbs" currentAmount={currentCarbohydrates} max={carbohydratesGoal} progressColour={colours.palette.accent400} />
            <Space horizontal units={3} />
            <Stat name="Fat" currentAmount={currentFat} max={fatGoal} progressColour={colours.palette.blue} />
          </View>
        </View>

        <Space units={3} />
      </View>

      <View style={styles.divider} />

      <View style={styles.mealRowsContainer}>
        <FlatList
          data={currentDayEntries}
          renderItem={renderJournalEntry}
          onScroll={listScrollHandler}
          scrollEventThrottle={16}
          ref={listRef}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={LIST_CONTENT_CONTAINER_STYLE}
          initialNumToRender={15}
        />
        <ScrollToTopButton buttonVisible={showScrollToTopButton} onPress={scrollListToTop} />
      </View>
    </View>
  );
};

const ListEmptyComponent = () => (
  <View style={listEmptyComponentStyles}>
    <Text preset="subheading">Eat something</Text>
  </View>
);

const listEmptyComponentStyles = {
  height: '100%',
  flex: 1,
  paddingTop: 100,
  justifyContent: 'center',
  alignItems: 'center',
} as ViewStyle;

const stylesFn = ({ colours, spacing, layout }: Theme) =>
  StyleSheet.create({
    screenContainer: {
      flex: 1,
      backgroundColor: colours.background,
      paddingHorizontal: spacing.screen.padding,
      paddingVertical: 0,
    },
    statsContainer: {},
    statsRow: {
      ...layout.spaceBetweenRow,
    },
    divider: {
      height: 1,
      backgroundColor: colours.palette.neutral200,
    },
    mealRowsContainer: {
      flex: 1,
    },
    emptyListContainer: {
      ...layout.centerAlignedRow,
      height: '100%',
      flex: 1,
      paddingTop: 100,
    },
  });
