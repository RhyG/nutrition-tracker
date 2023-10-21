import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';
import { useThemedStyles } from '@hooks/useThemedStyles';
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
import { useJournalStore } from '@app/store/journal';
import { JournalEntry } from '@app/types';

import { DaySwitcher } from './components/DaySwitcher';
import { EditEntryModal } from './components/EditEntryModal';
import { FoodRow } from './components/FoodRow';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { Stat } from './components/Stat';
import { useDaySwitcher } from './hooks/useDaySwitcher';
import { useDropdownHeader } from './hooks/useDropdownHeader';

const EMPTY_ARRAY = [] as const;
const LIST_CONTENT_CONTAINER_STYLE = { paddingBottom: 50 };

export const FoodLogScreen: RootStackScreen<'Food Log'> = () => {
  const { styles } = useThemedStyles(stylesFn);
  const { currentDay, handleDayChange } = useDaySwitcher();

  const caloriesGoal = useGoalsStore(state => state.calories);
  const proteinGoal = useGoalsStore(state => state.protein);

  const journalData = useJournalStore(state => state.journalData);

  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  const editEntryModalRef = useRef<BottomSheet>(null);
  const listRef = useRef<FlatList>(null);

  const currentDayEntries: JournalEntry[] = useMemo(() => journalData[currentDay] ?? EMPTY_ARRAY, [currentDay, journalData]);

  useDropdownHeader(currentDay);
  useSetDayOnForeground();

  /**
   * Handles the hiding/showing of the FAB when scrolling.
   * This is to prevent it covering entries when scrolling.
   */
  const listScrollHandler = useEvent((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffsetY = event.nativeEvent.contentOffset.y;

    // If there is enough entries to reach the FAB and the user srolls
    if (currentDayEntries.length > 6 && scrollOffsetY > 5) {
      setShowScrollToTopButton(false);
    } else if (!showScrollToTopButton && scrollOffsetY < 150) {
      setShowScrollToTopButton(true);
    } else {
      setShowScrollToTopButton(true);
    }
  });

  /* Scroll to the top of the list when pressing the header */
  const scrollListToTop = useCallback(() => {
    setShowScrollToTopButton(false);
    listRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  // TODO optimise component props
  const renderJournalEntry: ListRenderItem<JournalEntry> = useCallback(({ item }) => <FoodRow entry={item} day={currentDay} />, [currentDay]);

  const {
    calories: currentCalories,
    protein: currentProtein,
    fat: currentFat,
    carbohydrates: currentCarbohydrates,
  } = getCurrentMacroTotals(journalData[currentDay]);

  return (
    <View style={styles.screenContainer}>
      <View>
        <DaySwitcher currentDay={currentDay} changeDay={handleDayChange} />
        <Space units={3} />

        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <Stat name="Calories" currentAmount={currentCalories} max={caloriesGoal} />
            <Space horizontal units={3} />
            <Stat name="Protein" currentAmount={currentProtein} max={proteinGoal} />
          </View>
          <Space units={3} />
          <View style={styles.statsRow}>
            <Stat name="Carbs" currentAmount={currentCarbohydrates} max={200} />
            <Space horizontal units={3} />
            <Stat name="Fat" currentAmount={currentFat} max={proteinGoal} />
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
          ref={listRef}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={LIST_CONTENT_CONTAINER_STYLE}
          initialNumToRender={15}
        />
        <ScrollToTopButton buttonVisible={showScrollToTopButton} onPress={scrollListToTop} />
      </View>

      <EditEntryModal ref={editEntryModalRef} />
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
      ...spacing.screen,
      paddingTop: 0,
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
