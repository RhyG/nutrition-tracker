import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { Dimensions, ListRenderItem, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { isInputNumber } from '@app/lib/validation';
import { useDayStore } from '@app/store/day';
import { useJournalStore } from '@app/store/journal';
import { Theme } from '@app/theme';

import { Text } from '../Text';
import { EntryDetailsInputs } from '../edit-entry/EntryDetailsInputs';
import { Tab, Tabs, sections } from '../edit-entry/Tabs';

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

export const Component = () => {
  const {
    styles,
    theme: { spacing },
  } = useThemedStyles(stylesFn);

  const currentDay = useDayStore(state => state.currentDay);

  const saveItem = useJournalStore(state => state.saveItem);

  const logEntryDetails = useRef(defaultValues);

  const listRef = useRef<FlatList<Tab>>(null);

  function scrollToTab(tab: Tab) {
    listRef.current?.scrollToIndex({ index: tab === 'QUICK_ADD' ? 0 : 1, animated: true });
  }

  function saveEntry() {
    const newDetails = logEntryDetails.current;
    if (!inputsValid(newDetails)) {
      return;
    }

    const detailsToSave = {
      id: nanoid(),
      name: newDetails.name,
      calories: Number(newDetails.calories ?? 0),
      protein: Number(newDetails.protein ?? 0),
      carbohydrates: Number(newDetails.carbohydrates ?? 0),
      fat: Number(newDetails.fat ?? 0),
      timestamp: Date.now(),
    };

    saveItem(detailsToSave, currentDay);

    logEntryDetails.current = defaultValues;
  }

  function onChangeEntryDetails(key: string, value: string) {
    logEntryDetails.current = {
      ...logEntryDetails.current,
      [key]: value,
    };
  }

  const renderItem: ListRenderItem<Tab> = ({ item }) => {
    switch (item) {
      case 'QUICK_ADD':
        return (
          <View style={styles.selectionContainer}>
            <EntryDetailsInputs onChangeText={onChangeEntryDetails} onSavePress={saveEntry} />
          </View>
        );
      case 'SAVED':
        return (
          <View style={styles.selectionContainer}>
            <View style={{ marginHorizontal: spacing.base, flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
              <Text>SAVED</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Tabs onTabSelected={scrollToTab} />
      <FlatList
        bounces={false}
        data={sections}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        ref={listRef}
      />
    </>
  );
};

export const snapPoints = ['63%'];

const stylesFn = ({ spacing }: Theme) =>
  StyleSheet.create({
    selectionContainer: { width, paddingTop: spacing.medium, paddingHorizontal: spacing.base },
  });
