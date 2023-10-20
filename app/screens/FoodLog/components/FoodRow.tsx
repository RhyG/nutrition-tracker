import Icon from '@expo/vector-icons/MaterialIcons';
import { format } from 'date-fns';
import React, { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Text } from '@app/components/Text';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { useJournal } from '@app/store/journal';
import { ModalNames, useModalStore } from '@app/store/modal';
import { Theme } from '@app/theme';
import { Day, JournalEntry } from '@app/types';

type Props = {
  entry: JournalEntry;
  day: Day;
};

function _FoodRow({ entry, day }: Props) {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const { name, calories, protein, carbohydrates, fat, id, timestamp } = entry;

  const setActiveModal = useModalStore(state => state.setActiveModal);

  const removeItem = useJournal(state => state.removeItem);

  const onDeleteButtonPress = () => {
    removeItem(id, day);
  };

  const onPress = () => {
    setActiveModal({ name: ModalNames.EDIT_ENTRY, params: { entry, day } });
  };

  /* Renders the delete button when swiping right */
  const renderRightActions = (progress: Animated.AnimatedInterpolation<0>) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });

    return (
      <Animated.View
        style={[
          styles.deleteButton,
          {
            transform: [{ translateX }],
          },
        ]}>
        <RectButton onPress={onDeleteButtonPress} style={styles.button}>
          <Icon name="delete" color="#fff" size={26} />
        </RectButton>
      </Animated.View>
    );
  };

  return (
    <Swipeable friction={2} leftThreshold={40} rightThreshold={40} overshootLeft={false} overshootRight={false} renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <View style={styles.leftColumn}>
          <View style={styles.nameContainer}>
            <Text size="sm">{name ?? ''}</Text>
          </View>
          {Boolean(timestamp) && (
            <Text size="xs" colour={colours.palette.neutral400}>
              {format(timestamp, 'h:mmaaa')}
            </Text>
          )}
        </View>
        <View style={styles.rightColumn}>
          <View style={styles.valueContainer}>
            <Text size="sm">{calories ?? ''}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text size="sm">{protein ?? ''}P</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text size="sm">{carbohydrates ?? ''}C</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text size="sm">{fat ?? ''}F</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

export const FoodRow = memo(_FoodRow);

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    container: {
      ...theme.layout.spaceBetweenRow,
      paddingVertical: theme.spacing.extraSmall,
      alignItems: 'center',
    },
    nameContainer: {
      flex: 2,
    },
    valueContainer: {
      marginLeft: 20,
    },
    deleteButton: {
      backgroundColor: theme.colours.palette.angry500,
      ...theme.layout.fullyCentred,
      width: 80,
    },
    leftColumn: {
      flex: 1,
    },
    rightColumn: {
      ...theme.layout.spaceBetweenRow,
      flex: 1.5,
      alignItems: 'flex-end',
    },
    button: {
      flex: 1,
      width: '100%',
      ...theme.layout.fullyCentred,
    },
  });
