import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@app/theme';

import { Space } from '../../Space';
import { Input } from './Input';

type Props = {
  onChangeText: (key: string, value: string) => void;
  onSavePress: () => void;
};

export function EntryDetailsInputs({ onChangeText, onSavePress: _onSavePress }: Props) {
  const { styles } = useThemedStyles(stylesFn);

  const entryNameInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);
  const proteinInputRef = useRef<TextInput>(null);
  const carbInputRef = useRef<TextInput>(null);
  const fatInputRef = useRef<TextInput>(null);

  function clearInputs() {
    entryNameInputRef?.current?.clear();
    caloriesInputRef?.current?.clear();
    proteinInputRef?.current?.clear();
    carbInputRef?.current?.clear();
    fatInputRef?.current?.clear();

    entryNameInputRef?.current?.focus();
  }

  return (
    <View style={styles.container}>
      <Input field="Name" onChangeText={onChangeText} ref={entryNameInputRef} keyboardType="default" hideUnit />
      <Space units={2} />
      <Input field="Calories" onChangeText={onChangeText} ref={caloriesInputRef} />
      <Space units={2} />
      <Input field="Protein" onChangeText={onChangeText} ref={proteinInputRef} />
      <Space units={2} />
      <Input field="Carbohydrates" onChangeText={onChangeText} ref={carbInputRef} />
      <Space units={2} />
      <Input field="Fat" onChangeText={onChangeText} ref={fatInputRef} />
      <Space units={2} />
    </View>
  );
}

const stylesFn = ({ colours }: Theme) =>
  StyleSheet.create({
    container: {
      // marginHorizontal: spacing.base,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
