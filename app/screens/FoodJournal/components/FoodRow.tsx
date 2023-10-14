import React, { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from '@expo/vector-icons/MaterialIcons';

import { Text } from '@app/components/Text';
import { JournalEntry } from '@app/types';
import { Theme } from '@app/theme';
import { useThemedStyles } from '@app/hooks/useThemedStyles';

type Props = {
  entry: JournalEntry;
};

function _FoodRow({ entry }: Props) {
  const { styles } = useThemedStyles(stylesFn);

  const { name, calories, protein, id } = entry;

  const onDeleteButtonPress = () => {};

  const onPress = () => {};

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
        <View style={styles.nameContainer}>
          <Text size="md">{name ?? ''}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text size="md">{calories ?? ''}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text size="md">{protein ?? ''}</Text>
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
      paddingVertical: 15,
      paddingHorizontal: theme.spacing.small,
    },
    nameContainer: {
      flex: 2,
    },
    valueContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    deleteButton: {
      backgroundColor: theme.colours.palette.angry500,
      ...theme.layout.fullyCentred,
      width: 80,
    },
    button: {
      flex: 1,
      width: '100%',
      ...theme.layout.fullyCentred,
    },
  });
