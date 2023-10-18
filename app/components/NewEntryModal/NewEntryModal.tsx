import Icon from '@expo/vector-icons/Entypo';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { Dimensions, ListRenderItem, StyleSheet, TextInput, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { isInputNumber } from '@app/lib/validation';
import { useDayStore } from '@app/store/day';
import { useJournal } from '@app/store/journal';
import { Theme } from '@app/theme';

import { Space } from '../Space';
import { Text } from '../Text';
import { Input } from './Input';
import { Tab, Tabs, sections } from './Tabs';

const { width } = Dimensions.get('window');

const defaultValues = { name: '', calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />;

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

export const NewEntryModal = React.forwardRef<BottomSheet, Record<string, unknown>>((_, ref) => {
  const {
    styles,
    theme: { spacing },
  } = useThemedStyles(stylesFn);

  const snapPoints = useSafeAreaSnapPoints();

  const currentDay = useDayStore(state => state.currentDay);

  const saveItem = useJournal(state => state.saveItem);

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
    clearInputs();
    entryNameInputRef?.current?.focus();
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

    logEntryDetails.current = defaultValues;
  }

  const renderItem: ListRenderItem<Tab> = ({ item }) => {
    switch (item) {
      case 'QUICK_ADD':
        return (
          <View style={styles.selectionContainer}>
            <View style={styles.quickAddInnerContainer}>
              <Input field="Name" onChangeText={onChangeEntryDetails} ref={entryNameInputRef} keyboardType="default" hideUnit />
              <Space units={2} />
              <Input field="Calories" onChangeText={onChangeEntryDetails} ref={caloriesInputRef} />
              <Space units={2} />
              <Input field="Protein" onChangeText={onChangeEntryDetails} ref={proteinInputRef} />
              <Space units={2} />
              <Input field="Carbohydrates" onChangeText={onChangeEntryDetails} ref={carbInputRef} />
              <Space units={2} />
              <Input field="Fat" onChangeText={onChangeEntryDetails} ref={fatInputRef} />
              <Space units={2} />

              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.buttonContainer} onPress={saveEntry}>
                  <Icon name="plus" color="#fff" size={30} />
                </TouchableOpacity>
              </View>
            </View>
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
    <BottomSheet snapPoints={snapPoints} ref={ref} backdropComponent={renderBackdrop} enablePanDownToClose={true}>
      <View style={styles.sheetContainer}>
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
      </View>
    </BottomSheet>
  );
});

const stylesFn = ({ spacing, colours, typography }: Theme) =>
  StyleSheet.create({
    sheetContainer: {
      flex: 1,
      paddingTop: spacing.small,
    },
    saveButton: {
      backgroundColor: colours.palette.green,
      padding: spacing.small,
      borderRadius: 5,
    },
    cancelButton: {
      backgroundColor: colours.palette.neutral100,
      padding: spacing.small,
      borderRadius: 5,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    input: {
      backgroundColor: colours.palette.neutral200,
      borderRadius: 6,
      fontSize: typography.sizes.sm,
      padding: 8,
      color: '#000',
      marginTop: spacing.medium,
    },
    marginTop: { marginTop: 15 },
    quickAddInnerContainer: {
      marginHorizontal: spacing.base,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    selectionContainer: { width, paddingTop: spacing.medium },
    buttonContainer: {
      backgroundColor: colours.palette.green,
      height: 40,
      width: 40,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
