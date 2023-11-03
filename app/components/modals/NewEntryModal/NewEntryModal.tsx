import { useNavigation } from '@react-navigation/native';
import i18n from 'i18n-js';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { Dimensions, ListRenderItem, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { Space } from '@app/components/Space';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { isInputNumber } from '@app/lib/validation';
import { useDayStore } from '@app/store/day';
import { useJournalStore } from '@app/store/journal';
import { Theme } from '@app/theme';

import { Text } from '../../Text';
import { Input } from './Input';
import { SavedFoods } from './SavedFoods';
import { Tab, Tabs, sections } from './Tabs';

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
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const navigation = useNavigation();

  const currentDay = useDayStore(state => state.currentDay);

  const saveItem = useJournalStore(state => state.saveItem);

  const logEntryDetails = useRef(defaultValues);

  const entryNameInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);
  const proteinInputRef = useRef<TextInput>(null);
  const carbInputRef = useRef<TextInput>(null);
  const fatInputRef = useRef<TextInput>(null);

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
    clearInputs();
    entryNameInputRef?.current?.focus();

    // react-navigation types are stupid in places, this is one of them
    navigation.navigate('Food Log' as never);
  }

  function onChangeEntryDetails(key: string, value: string) {
    logEntryDetails.current = {
      ...logEntryDetails.current,
      [key]: value,
    };
  }

  function clearInputs() {
    entryNameInputRef?.current?.clear();
    caloriesInputRef?.current?.clear();
    proteinInputRef?.current?.clear();
    carbInputRef?.current?.clear();
    fatInputRef?.current?.clear();

    entryNameInputRef?.current?.focus();
  }

  const renderItem: ListRenderItem<Tab> = ({ item }) => {
    switch (item) {
      case 'QUICK_ADD':
        return (
          <View style={styles.selectionContainer}>
            <View style={styles.container}>
              <Input field="name" label={i18n.t('name')} onChangeText={onChangeEntryDetails} ref={entryNameInputRef} keyboardType="default" hideUnit />
              <Space units={2} />
              <Input field="calories" label={i18n.t('macros.calories')} onChangeText={onChangeEntryDetails} ref={caloriesInputRef} />
              <Space units={2} />
              <Input field="protein" label={i18n.t('macros.protein')} onChangeText={onChangeEntryDetails} ref={proteinInputRef} />
              <Space units={2} />
              <Input field="carbohydrates" label={i18n.t('macros.carbohydrates')} onChangeText={onChangeEntryDetails} ref={carbInputRef} />
              <Space units={2} />
              <Input field="fat" label={i18n.t('macros.fat')} onChangeText={onChangeEntryDetails} ref={fatInputRef} />
              <Space units={2} />
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.addButton} onPress={saveEntry}>
                <Text colour={colours.palette.neutral200}>{i18n.t('done')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'SAVED':
        return (
          <View style={styles.selectionContainer}>
            <SavedFoods />
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

export const snapPoints = ['56%'];

const stylesFn = ({ spacing, colours }: Theme) =>
  StyleSheet.create({
    selectionContainer: { width, paddingTop: spacing.medium, paddingHorizontal: spacing.base },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    addButton: {
      backgroundColor: colours.palette.green,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.medium,
      paddingVertical: spacing.extraSmall,
      borderRadius: 6,
    },
    barsContainer: {
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    container: {
      // marginHorizontal: spacing.base,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    buttonContainer: {
      backgroundColor: colours.palette.green,
      height: 40,
      width: 40,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
