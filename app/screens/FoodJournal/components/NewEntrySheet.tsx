import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RadioButton } from '@app/components/RadioButton';
import { Text } from '@app/components/Text';
import { JournalEntry } from '@app/types';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@theme';

import { NewEntryTabs } from './NewEntryTabs';

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
    const { bottom: bottomInset } = useSafeAreaInsets();

    /* The bottom sheet is slightly higher on phones with a bottom bar */
    const snapPoints = useMemo(() => {
      const snapPoint = bottomInset > 0 ? '50%' : '53%';

      return [snapPoint];
    }, [bottomInset]);

    const entryNameInputRef = useRef<TextInput>(null);
    const caloriesInputRef = useRef<TextInput>(null);
    const proteinInputRef = useRef<TextInput>(null);

    const flatListRef = useRef<FlatList>(null);

    const { name, calories, protein, id } = entryDetails;
    const entryBeingUpdated = !!id;

    /* Renders the darkened backdrop behind the sheet */
    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />, []);

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

    const scrollToIndex = (screen: 'new-entry' | 'saved-entry') => {
      const index = screen === 'new-entry' ? 0 : 1;

      flatListRef?.current?.scrollToIndex({
        index,
        animated: true,
      });
    };

    const renderItems = useCallback(({ item, index }) => {
      if (item === 'new-entry') {
        return (
          <View style={styles.box}>
            <Text preset="heading" marginBottom={3} marginTop={3}>
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
            />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={onSaveButtonPress}>
                <Text color="#fff" preset="heading">
                  Add Entry
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onClosePress}>
                <Text preset="heading">Cancel</Text>
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
        );
      } else
        return (
          <View style={styles.box}>
            <Text>SECOND</Text>
          </View>
        );
    }, []);

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
          <NewEntryTabs currentIndex={1} scrollToThing={scrollToIndex} />
          <FlatList
            data={LIST_DATA}
            renderItem={renderItems}
            horizontal={true}
            contentContainerStyle={{ width: '100%' }}
            ref={flatListRef}
            pagingEnabled
            initialScrollIndex={0}
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={(e) => console.log(e)}
          />
        </View>
      </BottomSheet>
    );
  },
);

const LIST_DATA = ['new-entry', 'saved-entries'];

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
    saveButton: {
      backgroundColor: colours.palette.green,
      padding: spacing.small,
      borderRadius: 5,
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
