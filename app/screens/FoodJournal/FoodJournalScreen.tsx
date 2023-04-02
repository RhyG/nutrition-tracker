import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react';
import { FlatList, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View, ViewStyle } from 'react-native';
import { nanoid } from 'nanoid';
import shallow from 'zustand/shallow';

import { Space } from '@app/components/Space';
import { Text } from '@app/components/Text';
import { HeaderStyle, Theme } from '@theme';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { RootStackScreen } from '@app/navigation/types';
import { useGoals } from '@app/store/goals';
import { useJournal } from '@app/store/journal';
import { JournalEntry } from '@app/types';
import { isInputNumber } from '@app/lib/validation';
import { getCurrentCalories, getCurrentProtein } from '@app/lib/macros';

import { AddEntryFAB, DaySwitcher, DropdownMenu, FoodEntryRow, ListHeader, NewEntrySheet, Stat } from './components';
import { useDaySwitcher } from './hooks/useDaySwitcher';

const EMPTY_ARRAY = [] as const;
const LIST_CONTENT_CONTAINER_STYLE = { paddingBottom: 50 };
const STICKY_HEADER_INDICES = [0];

const DEFAULT_ENTRY_DETAILS = {
  name: '',
  calories: '',
  protein: '',
  id: '',
} as unknown as JournalEntry;

export const FoodJournalScreen: RootStackScreen<'FoodJournal'> = ({ navigation }) => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);
  const { currentDay, handleDayChange } = useDaySwitcher();

  const { calories: caloriesGoal, protein: proteinGoal } = useGoals(({ calories, protein }) => ({ calories, protein }));

  const { journalData, saveItem, removeItem, updateItem, fillDay } = useJournal((state) => ({ ...state }), shallow);

  const [showAddEntryButton, setShowAddEntryButton] = useState(true);
  const [entryDetails, setEntryDetails] = useState(DEFAULT_ENTRY_DETAILS);
  const [addAnotherEntrySelected, toggleAddAnotherEntry] = useReducer((prev) => !prev, false);

  const newEntrySheetRef = useRef<BottomSheet>(null);
  const listRef = useRef<FlatList>(null);

  const currentDayEntries: JournalEntry[] = useMemo(() => journalData[currentDay] ?? EMPTY_ARRAY, [currentDay, journalData]);

  /* Sets the dropdown menu in the right side of the header */
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        ...HeaderStyle,
        backgroundColor: colours.palette.neutral200,
      },
      headerRight: () => <DropdownMenu currentDay={currentDay} />,
    });
  }, [colours.palette.neutral200, navigation, currentDay, fillDay, currentDayEntries]);

  const onChangeEntryDetails = (key: keyof JournalEntry, value: string) => {
    // Only allow numbers and a maxmimum of 9999 when updating calories or protein
    if (key === 'calories' || key === 'protein') {
      if (!isInputNumber(value) || value.length > 4) {
        return;
      }
    }

    setEntryDetails((prevDetails) => ({ ...prevDetails, [key]: value }));
  };

  const clearEntryDetails = () => setEntryDetails(DEFAULT_ENTRY_DETAILS);

  const onCloseSheetPress = () => {
    newEntrySheetRef?.current?.close();
    setEntryDetails(DEFAULT_ENTRY_DETAILS);

    if (addAnotherEntrySelected) {
      toggleAddAnotherEntry();
    }
  };

  const onAddEntryPress = () => {
    newEntrySheetRef?.current?.expand();
  };

  /* Saves a new item to the journal */
  const onSaveItemPress = (item: Omit<JournalEntry, 'id'>) => {
    const newItem = { id: nanoid(), ...item };
    saveItem(newItem, currentDay);

    setEntryDetails(DEFAULT_ENTRY_DETAILS);
    toggleAddAnotherEntry();

    // Close the sheet if user isn't adding another entry
    if (!addAnotherEntrySelected) {
      newEntrySheetRef?.current?.close?.();
    }
  };

  /* Deletes an item from the list by filtering out the item with the matching ID */
  const removeItemFromList = useCallback(
    (id: string) => {
      removeItem(id, currentDay);
    },
    [currentDay, removeItem],
  );

  const updateEntry = (updatedItem: JournalEntry) => {
    updateItem(updatedItem, currentDay);

    // Close the sheet and set default state
    newEntrySheetRef?.current?.close?.();
    setEntryDetails(DEFAULT_ENTRY_DETAILS);
  };

  const onEntryPress = useCallback((entry: JournalEntry) => {
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
        <AddEntryFAB buttonVisible={showAddEntryButton} onPress={onAddEntryPress} />
      </View>

      <NewEntrySheet
        onSaveItem={onSaveItemPress}
        onClosePress={onCloseSheetPress}
        ref={newEntrySheetRef}
        updateEntry={updateEntry}
        entryDetails={entryDetails}
        onChangeEntryDetails={onChangeEntryDetails}
        clearEntryDetails={clearEntryDetails}
        toggleAddAnotherEntry={toggleAddAnotherEntry}
        addAnotherEntrySelected={addAnotherEntrySelected}
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
