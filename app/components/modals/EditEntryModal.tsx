import Icon from '@expo/vector-icons/Entypo';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { isInputNumber } from '@app/lib/validation';
import { useJournalStore } from '@app/store/journal';
import { Theme } from '@app/theme';
import { Day, JournalEntry } from '@app/types';

import { Text } from '../Text';
import { EntryDetailsInputs } from '../edit-entry/EntryDetailsInputs';

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

type Props = {
  entry: JournalEntry;
  day: Day;
};

export const Component = (props: Props) => {
  console.log({ props });
  const { entry, day } = props;
  const { styles } = useThemedStyles(stylesFn);

  const updateItem = useJournalStore(state => state.updateItem);

  const logEntryDetails = useRef(defaultValues);

  function updateEntry() {
    const newDetails = logEntryDetails.current;
    if (!inputsValid(newDetails)) {
      return;
    }
  }

  function onChangeEntryDetails(key: string, value: string) {
    logEntryDetails.current = {
      ...logEntryDetails.current,
      [key]: value,
    };
  }

  return (
    <View style={styles.selectionContainer}>
      <Text preset="subheading">{entry.name}</Text>
      <View style={styles.macrosContainer}></View>
      <EntryDetailsInputs onChangeText={onChangeEntryDetails} onSavePress={updateEntry} />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Icon name="plus" color="#fff" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export const snapPoints = ['60%'];

const stylesFn = ({ spacing, colours, typography }: Theme) =>
  StyleSheet.create({
    selectionContainer: {
      width,
      paddingHorizontal: spacing.base,
    },
    macrosContainer: {},
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    addButton: {
      backgroundColor: colours.palette.green,
      height: 40,
      width: 40,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
