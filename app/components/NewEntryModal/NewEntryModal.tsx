import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { Dimensions, ListRenderItem, StyleSheet, TextInput, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { isInputNumber } from '@app/lib/validation';
import { useJournal } from '@app/store/journal';
import { Theme } from '@app/theme';

import { Text } from '../Text';
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
    theme: { colours, spacing },
  } = useThemedStyles(stylesFn);

  const snapPoints = useSafeAreaSnapPoints();

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

  function closeSheet() {
    // @ts-expect-error ref types will be why I suck start a 9mm
    ref?.current?.close();
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
      timestamp: Date.now().toString(),
    };

    saveItem(detailsToSave, 'Monday');
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
  }

  const renderItem: ListRenderItem<Tab> = ({ item }) => {
    switch (item) {
      case 'QUICK_ADD':
        return (
          <View style={styles.selectionContainer}>
            <View style={styles.quickAddInnerContainer}>
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={text => onChangeEntryDetails('name', text)}
                // value={name}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={entryNameInputRef}
                placeholderTextColor={colours.palette.neutral300}
                testID="name-input"
              />
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Calories"
                // value={String(calories)}
                onChangeText={text => onChangeEntryDetails('calories', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={caloriesInputRef}
                placeholderTextColor={colours.palette.neutral300}
                keyboardType="numeric"
                testID="calories-input"
              />
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Protein"
                onChangeText={text => onChangeEntryDetails('protein', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={proteinInputRef}
                placeholderTextColor={colours.palette.neutral300}
                // value={String(protein)}
                keyboardType="numeric"
                testID="protein-input"
              />
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Carbohydrates"
                onChangeText={text => onChangeEntryDetails('carbohydrates', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={carbInputRef}
                placeholderTextColor={colours.palette.neutral300}
                // value={String(protein)}
                keyboardType="numeric"
                testID="carbohydrates-input"
              />
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Fat"
                onChangeText={text => onChangeEntryDetails('fat', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={fatInputRef}
                placeholderTextColor={colours.palette.neutral300}
                // value={String(protein)}
                keyboardType="numeric"
                testID="fat-input"
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
                  <Text colour={colours.palette.neutral100}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={closeSheet}>
                  <Text>Cancel</Text>
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
      marginTop: spacing.medium,
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
    selectionContainer: { width },
  });
