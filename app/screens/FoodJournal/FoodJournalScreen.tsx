import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, ViewStyle } from 'react-native';
import shallow from 'zustand/shallow';

import { Space } from '@app/components/Space';
import { Text } from '@app/components/Text';
import { Theme } from '@theme';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { RootStackScreen } from '@app/navigation/types';
import { useGoals } from '@app/store/goals';
import { useJournal } from '@app/store/journal';
import { JournalEntry } from '@app/types';
import { getCurrentCalories, getCurrentProtein } from '@app/lib/macros';

import { AddEntryFAB, DaySwitcher, FoodEntryRow, ListHeader, NewEntrySheet, Stat } from './components';
import { useDaySwitcher } from './hooks/useDaySwitcher';
import { useDropdownHeader } from './hooks/useDropdownHeader';

const EMPTY_ARRAY = [] as const;
const LIST_CONTENT_CONTAINER_STYLE = { paddingBottom: 50 };
const STICKY_HEADER_INDICES = [0];

const DEFAULT_ENTRY_DETAILS = {
  name: '',
  calories: '',
  protein: '',
  id: '',
} as unknown as JournalEntry;

export const FoodJournalScreen: RootStackScreen<'FoodJournal'> = () => {
  const { styles } = useThemedStyles(stylesFn);
  const { currentDay, handleDayChange } = useDaySwitcher();

  const { calories: caloriesGoal, protein: proteinGoal } = useGoals(({ calories, protein }) => ({ calories, protein }));

  const { journalData, removeItem } = useJournal((state) => ({ ...state }), shallow);

  const [showAddEntryButton, setShowAddEntryButton] = useState(true);
  const [entryBeingUpdated, setEntryBeingUpdated] = useState(false);

  const newEntrySheetRef = useRef<BottomSheet>(null);
  const listRef = useRef<FlatList>(null);

  const currentDayEntries: JournalEntry[] = useMemo(() => journalData[currentDay] ?? EMPTY_ARRAY, [currentDay, journalData]);

  useDropdownHeader(currentDay);

  const [entryDetails, setEntryDetails] = useState<JournalEntry>(DEFAULT_ENTRY_DETAILS);

  const onChangeEntryDetails = (key: keyof JournalEntry, value: string) => {
    setEntryDetails((prevDetails) => ({ ...prevDetails, [key]: value }));
  };

  const onNewEntryPress = () => {
    setEntryDetails(DEFAULT_ENTRY_DETAILS);
    newEntrySheetRef?.current?.expand();
  };

  /* Deletes an item from the list by filtering out the item with the matching ID */
  const removeItemFromList = useCallback(
    (id: string) => {
      removeItem(id, currentDay);
    },
    [currentDay, removeItem],
  );

  const onEntryPress = useCallback((entry: JournalEntry) => {
    setEntryBeingUpdated(true);
    setEntryDetails(entry);
    newEntrySheetRef?.current?.expand();
  }, []);

  /**
   * Handles the hiding/showing of the FAB when scrolling.
   * This is to prevent it covering entries when scrolling.
   */
  const listScrollHandler = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const scrollOffsetY = event.nativeEvent.contentOffset.y;

      // If there is enough entries to reach the FAB and the user srolls
      if (currentDayEntries.length > 6 && scrollOffsetY > 5) {
        setShowAddEntryButton(false);
      } else if (!showAddEntryButton && scrollOffsetY < 150) {
        setShowAddEntryButton(true);
      } else {
        setShowAddEntryButton(true);
      }
    },
    [showAddEntryButton, currentDayEntries],
  );

  /* Scroll to the top of the list when pressing the header */
  const scrollListToTop = useCallback(() => {
    setShowAddEntryButton(true);
    listRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  // TODO optimise component props
  const renderJournalEntry: ListRenderItem<JournalEntry> = useCallback(
    ({ item }) => <FoodEntryRow entry={item} onEntryPress={onEntryPress} onDeletePress={removeItemFromList} />,
    [onEntryPress, removeItemFromList],
  );

  const ListHeaderComponent = useMemo(() => {
    return currentDayEntries.length > 0 ? <ListHeader onHeadingsPress={scrollListToTop} /> : null;
  }, [scrollListToTop, currentDayEntries.length]);

  const currentCalories = getCurrentCalories(journalData[currentDay]);
  const currentProtein = getCurrentProtein(journalData[currentDay]);

  return (
    <>
      <View style={styles.offWhiteContainer}>
        <DaySwitcher currentDay={currentDay} changeDay={handleDayChange} />
        <Space units={3} />
        <View style={styles.statsContainer}>
          <Stat name="Calories" currentAmount={currentCalories} max={caloriesGoal} />
          <Space units={3} />
          <Stat name="Protein" currentAmount={currentProtein} max={proteinGoal} />
        </View>
        <Space units={3} />
      </View>

      <View style={styles.mealRowsContainer}>
        <FlatList
          ListHeaderComponent={ListHeaderComponent}
          data={currentDayEntries}
          renderItem={renderJournalEntry}
          onScroll={listScrollHandler}
          ref={listRef}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={LIST_CONTENT_CONTAINER_STYLE}
          stickyHeaderIndices={STICKY_HEADER_INDICES}
          initialNumToRender={15}
        />
        <AddEntryFAB buttonVisible={showAddEntryButton} onPress={onNewEntryPress} />
      </View>

      <NewEntrySheet
        ref={newEntrySheetRef}
        currentDay={currentDay}
        entryBeingUpdated={entryBeingUpdated}
        setEntryBeingUpdated={setEntryBeingUpdated}
        onChangeEntryDetails={onChangeEntryDetails}
        entryDetails={entryDetails}
      />
    </>
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
    offWhiteContainer: {
      backgroundColor: colours.palette.neutral200,
    },
    statsContainer: {
      paddingHorizontal: spacing.small,
    },
    mealRowsContainer: {
      backgroundColor: '#fff',
      flex: 1,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingVertical: spacing.base,
      paddingHorizontal: spacing.small,
    },
    emptyListContainer: {
      ...layout.centerAlignedRow,
      height: '100%',
      flex: 1,
      paddingTop: 100,
    },
  });
