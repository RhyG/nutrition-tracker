import { TouchableOpacity } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Text } from '@app/components/Text';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { fillDay, fillWeek } from '@app/lib/populate-journal';
import { useDayStore } from '@app/store/day';
import { useFoodLogStore } from '@app/store/journal';
import { useModalStore } from '@app/store/modal';
import { Theme } from '@app/theme';

export function Component() {
  const { styles } = useThemedStyles(stylesFn);

  const navigation = useNavigation();

  const currentDay = useDayStore(state => state.currentDay);

  const clearJournal = useFoodLogStore(state => state.clearFoodLog);
  const clearDay = useFoodLogStore(state => state.clearDay);
  const copyPreviousDay = useFoodLogStore(state => state.copyPreviousDay);

  // TODO figure out how to type navigation and remove cast to never.
  const navigateToGoalsScreen = () => {
    navigation.navigate('Goals' as never);
  };

  const _clearJournal = () => {
    Alert.alert('Clear all entries for this week?', `Are you sure you want to clear all items from each day this week?`, [
      { text: 'Cancel' },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: clearJournal,
      },
    ]);
  };

  const onPress = (cb: () => void) => () => {
    cb();
    useModalStore.getState().closeModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.row, styles.firstRow]} onPress={onPress(() => copyPreviousDay(currentDay))}>
        <Text>Copy previous day</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row} onPress={onPress(() => clearDay(currentDay))}>
        <Text>Clear day</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row} onPress={onPress(_clearJournal)}>
        <Text>Clear week</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.row} onPress={onPress(navigateToGoalsScreen)}>
        <Text>Set goals</Text>
      </TouchableOpacity>
      {__DEV__ ? (
        <>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={onPress(fillDay)}>
            <Text>Fill day</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={onPress(fillWeek)}>
            <Text>Fill week</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}

export const snapPoints = __DEV__ ? ['35%'] : ['23%'];

const stylesFn = ({ spacing, colours }: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.base,
    },
    row: {
      paddingVertical: spacing.small,
    },
    firstRow: {
      paddingTop: 0,
    },
    divider: {
      height: 1,
      backgroundColor: colours.palette.neutral200,
    },
  });
