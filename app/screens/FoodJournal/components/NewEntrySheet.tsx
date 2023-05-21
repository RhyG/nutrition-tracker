import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { RadioButton } from '@app/components/RadioButton';
import { Text } from '@app/components/Text';
import { JournalEntry } from '@app/types';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@theme';
import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';

type Props = {
  onClosePress: () => void;
  onSaveItem: (item: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (item: JournalEntry) => void;
  entryDetails: JournalEntry;
  onChangeEntryDetails: (key: keyof JournalEntry, value: string) => void;
  clearEntryDetails: () => void;
  toggleAddAnotherEntry: () => void;
  addAnotherEntrySelected: boolean;
};

const bottomSheetStyle = { zIndex: 2 };

export const NewEntrySheet = React.forwardRef<BottomSheet, Props>(
  ({ onClosePress, onSaveItem, clearEntryDetails, updateEntry, entryDetails, onChangeEntryDetails, addAnotherEntrySelected, toggleAddAnotherEntry }, ref) => {
    const {
      styles,
      theme: { colours },
    } = useThemedStyles(stylesFn);
    const snapPoints = useSafeAreaSnapPoints();

    const entryNameInputRef = useRef<TextInput>(null);
    const caloriesInputRef = useRef<TextInput>(null);
    const proteinInputRef = useRef<TextInput>(null);

    const { name, calories, protein, id } = entryDetails;
    const entryBeingUpdated = !!id;

    /* Renders the darkened backdrop behind the sheet */
    const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        /* Clear and blur all inputs when sheet is closed */
        if (index === -1) {
          clearEntryDetails();
          entryNameInputRef?.current?.blur();
          caloriesInputRef?.current?.blur();
          proteinInputRef?.current?.blur();
        }
      },
      [clearEntryDetails],
    );

    const onSaveButtonPress = () => {
      const newEntryDetails = {
        name,
        calories: Number(calories ?? 0),
        protein: Number(protein ?? 0),
      };

      if (!name) {
        return;
      }

      entryBeingUpdated
        ? updateEntry({
            ...entryDetails,
            ...newEntryDetails,
          })
        : onSaveItem({
            ...newEntryDetails,
          });

      if (addAnotherEntrySelected) {
        entryNameInputRef?.current?.focus();
      }
    };

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
            // @ts-ignore this type is gross, not sure how to fix
            ref={entryNameInputRef}
            placeholderTextColor={colours.palette.neutral300}
            testID="name-input"
          />
          <BottomSheetTextInput
            style={[styles.input, styles.marginTop]}
            placeholder="Calories"
            onChangeText={(text) => onChangeEntryDetails('calories', text)}
            value={String(calories)}
            // @ts-ignore this type is gross, not sure how to fix
            ref={caloriesInputRef}
            placeholderTextColor={colours.palette.neutral300}
            keyboardType="numeric"
            testID="calories-input"
          />
          <BottomSheetTextInput
            style={[styles.input, styles.marginTop]}
            placeholder="Protein"
            onChangeText={(text) => onChangeEntryDetails('protein', text)}
            value={String(protein)}
            // @ts-ignore this type is gross, not sure how to fix
            ref={proteinInputRef}
            placeholderTextColor={colours.palette.neutral300}
            keyboardType="numeric"
            testID="protein-input"
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSaveButtonPress}>
              <Text colour="#fff">Add Entry</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClosePress}>
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
      // marginTop: 3,
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
