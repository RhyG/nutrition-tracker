import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useReducer, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RadioButton } from '@app/components/RadioButton';
import { Text } from '@app/components/Text';
import { JournalEntry, Day } from '@app/types';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { Theme } from '@theme';
import { useJournal } from '@app/store/journal';
import { isInputNumber } from '@app/lib/validation';

import { nanoid } from 'nanoid';
import { useEvent } from '@app/hooks/useEvent';

type Props = {
  currentDay: Day;
  entryBeingUpdated: boolean;
  setEntryBeingUpdated: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeEntryDetails: (key: keyof JournalEntry, value: string) => void;
  entryDetails: JournalEntry;
};

const bottomSheetStyle = { zIndex: 2 };

const inputsValid = (name: string, calories: number, protein: number) => {
  const nameIsValid = name.length > 0;
  const caloriesIsValid = isInputNumber(String(calories));
  const proteinIsValid = isInputNumber(String(protein));

  return nameIsValid && caloriesIsValid && proteinIsValid;
};

export const NewEntrySheet = React.forwardRef<BottomSheet, Props>(
  ({ currentDay, entryBeingUpdated, setEntryBeingUpdated, onChangeEntryDetails, entryDetails }, ref) => {
    const {
      styles,
      theme: { colours },
    } = useThemedStyles(stylesFn);
    const { bottom: bottomInset } = useSafeAreaInsets();

    const saveItem = useJournal((state) => state.saveItem);
    const updateItem = useJournal((state) => state.updateItem);

    const [addAnotherEntrySelected, toggleAddAnotherEntry] = useReducer((prev) => !prev, false);

    const snapPoints = useSafeAreaSnapPoints();

    const entryNameInputRef = useRef<TextInput>(null);
    const caloriesInputRef = useRef<TextInput>(null);
    const proteinInputRef = useRef<TextInput>(null);

    const { name, calories, protein } = entryDetails;

    /* Renders the darkened backdrop behind the sheet */
    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, []);

    const handleSheetChanges = useEvent((index: number) => {
      /* Clear and blur all inputs when sheet is closed */
      if (index === -1) {
        resetSheetState();
      }
    });

    /* Saves a new item to the journal */
    const onSaveItemPress = () => {
      if (!inputsValid(name, calories, protein)) {
        return;
      }

      const newEntryDetails = {
        name,
        calories: Number(calories ?? 0),
        protein: Number(protein ?? 0),
      };

      // If there is an entry being update, call the `updateItem` function
      entryBeingUpdated
        ? updateItem(
            {
              ...entryDetails,
              ...newEntryDetails,
            },
            currentDay,
          )
        : saveItem({ id: nanoid(), ...newEntryDetails }, currentDay);

      toggleAddAnotherEntry();

      // Close the sheet if user isn't adding another entry
      if (!addAnotherEntrySelected) {
        closeSheet();
      }
    };

    function blurInputs() {
      entryNameInputRef?.current?.blur();
      caloriesInputRef?.current?.blur();
      proteinInputRef?.current?.blur();
    }

    function closeSheet() {
      // @ts-expect-error refs are hard
      ref?.current?.close?.();
      resetSheetState();
    }

    function resetSheetState() {
      blurInputs();
      setEntryBeingUpdated(false);
    }

    return (
      <BottomSheet
        index={-1}
        snapPoints={snapPoints}
        ref={ref}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        style={bottomSheetStyle}
        backdropComponent={renderBackdrop}>
        <View style={styles.sheetContainer}>
          <Text preset="subheading" style={styles.sheetHeading}>
            {entryBeingUpdated ? 'Update' : 'Add New'} Entry
          </Text>
          <BottomSheetTextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => onChangeEntryDetails('name', text)}
            value={name}
            // @ts-expect-error this type is gross, not sure how to fix
            ref={entryNameInputRef}
            placeholderTextColor={colours.palette.neutral300}
            testID="name-input"
          />
          <BottomSheetTextInput
            style={[styles.input, styles.marginTop]}
            placeholder="Calories"
            value={String(calories)}
            onChangeText={(text) => onChangeEntryDetails('calories', text)}
            // @ts-expect-error this type is gross, not sure how to fix
            ref={caloriesInputRef}
            placeholderTextColor={colours.palette.neutral300}
            keyboardType="numeric"
            testID="calories-input"
          />
          <BottomSheetTextInput
            style={[styles.input, styles.marginTop]}
            placeholder="Protein"
            onChangeText={(text) => onChangeEntryDetails('protein', text)}
            // @ts-expect-error this type is gross, not sure how to fix
            ref={proteinInputRef}
            placeholderTextColor={colours.palette.neutral300}
            value={String(protein)}
            keyboardType="numeric"
            testID="protein-input"
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSaveItemPress}>
              <Text colour="#fff">{entryBeingUpdated ? 'Update Entry' : 'Add Entry'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={closeSheet}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            {!entryBeingUpdated ? (
              <RadioButton
                label="Add another"
                onPress={toggleAddAnotherEntry}
                selected={addAnotherEntrySelected}
                containerStyle={styles.radioButtonContainer}
              />
            ) : null}
          </View>
        </View>
      </BottomSheet>
    );
  },
);

const stylesFn = ({ spacing, colours }: Theme) =>
  StyleSheet.create({
    box: {
      width: '100%',
    },
    sheetContainer: {
      flex: 1,
      paddingHorizontal: spacing.base,
      paddingTop: spacing.small,
    },
    sheetHeading: {
      marginBottom: 8,
    },
    saveButton: {
      backgroundColor: colours.palette.green,
      padding: spacing.small,
      borderRadius: 5,
    },
    addEntryButtonText: {
      color: '#fff',
    },
    cancelButton: {
      backgroundColor: '#fff',
      padding: spacing.small,
      borderRadius: 5,
    },
    buttonsContainer: {
      flexDirection: 'row',
      marginTop: spacing.medium,
    },
    input: {
      backgroundColor: '#f5f5f5',
      borderRadius: 5,
      fontSize: 18,
      paddingVertical: 10,
      paddingHorizontal: 10,
      color: '#000',
    },
    marginTop: { marginTop: 15 },
    radioButtonContainer: { marginLeft: 'auto' },
  });
