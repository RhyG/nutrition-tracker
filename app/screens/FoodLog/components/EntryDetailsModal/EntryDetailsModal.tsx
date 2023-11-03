import Icon from '@expo/vector-icons/Feather';
import i18n from 'i18n-js';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

import { useMacroGoals } from '@app/hooks/useMacroGoals';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { useJournalStore } from '@app/store/journal';
import { useModalStore } from '@app/store/modal';
import { useSavedFoodsStore } from '@app/store/saved-foods';
import { Theme } from '@app/theme';
import { Day, JournalEntry } from '@app/types';

import { Space } from '../../../../components/Space';
import { Text } from '../../../../components/Text';
import { calculatePercentage } from './EntryDetailsModal.utils';
import { ProgressIndicator } from './ProgressIndicator';

const { width } = Dimensions.get('window');

type Props = {
  entry: JournalEntry;
  day: Day;
};

function Button({ iconName, onPress, buttonStyle }: { iconName: keyof typeof Icon.glyphMap; onPress: () => void; buttonStyle: ViewStyle }) {
  const { styles } = useThemedStyles(stylesFn);

  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Icon name={iconName} size={24} color="#fff" />
    </TouchableOpacity>
  );
}

export function Component(props: Props) {
  const { entry, day } = props;
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const closeModal = useModalStore(state => state.closeModal);

  const { goalCalories, goalProtein, goalCarbohydrates, goalFat } = useMacroGoals();

  const saveFood = useSavedFoodsStore(state => state.saveFood);

  const removeItem = useJournalStore(state => state.removeItem);
  const copyItem = useJournalStore(state => state.copyItem);

  function onDeletePress() {
    removeItem(entry.id, day);
    closeModal();
  }

  function onCopyPress() {
    copyItem(entry, day);
    closeModal();
  }

  function onSavePress() {
    const entryToSave = {
      id: entry.id,
      name: entry.name,
      calories: entry.calories,
      protein: entry.protein,
      carbohydrates: entry.carbohydrates,
      fat: entry.fat,
    };

    saveFood(entryToSave);
    closeModal();
  }

  return (
    <View style={styles.container}>
      <Text preset="subheading" style={styles.name} numberOfLines={2}>
        {entry.name}
      </Text>

      <Space units={2} />

      <View style={styles.statsNumbers}>
        <Macro title={i18n.t('macros.calories')} amount={entry.calories} />
        <Macro title={i18n.t('macros.protein')} amount={entry.protein} />
        <Macro title={i18n.t('macros.carbs')} amount={entry.carbohydrates} />
        <Macro title={i18n.t('macros.fat')} amount={entry.fat} />
      </View>

      <View style={styles.divider} />

      <Text preset="subheading">{i18n.t('screens.foodLog.progressToGoals')}</Text>
      <View style={styles.progressIndicatorsContainer}>
        <ProgressIndicator progress={calculatePercentage(entry.calories, goalCalories)} colour={colours.palette.green} />
        <ProgressIndicator progress={calculatePercentage(entry.protein, goalProtein)} colour={colours.palette.orange} />
        <ProgressIndicator progress={calculatePercentage(entry.carbohydrates, goalCarbohydrates)} colour={colours.palette.accent400} />
        <ProgressIndicator progress={calculatePercentage(entry.fat, goalFat)} colour={colours.palette.blue} />
      </View>

      <View style={styles.actionButtonsContainer}>
        <Button iconName="save" onPress={onSavePress} buttonStyle={styles.addButton} />
        <Button iconName="trash" onPress={onDeletePress} buttonStyle={styles.removeButton} />
        <Button iconName="copy" onPress={onCopyPress} buttonStyle={styles.copyButton} />
      </View>
    </View>
  );
}

function Macro({ title, amount }: { title: string; amount: number }) {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  // Prevents overflow issues on massive amounts
  const adjustedAmount = amount > 9999 ? `9999+` : amount;

  return (
    <View style={styles.titleAndNumberContainer}>
      <Text colour={colours.palette.neutral400} size="sm">
        {title}
      </Text>
      <Text size="lg" weight="semiBold">
        {adjustedAmount}
      </Text>
    </View>
  );
}

export const snapPoints = ['42%'];

const stylesFn = ({ spacing, colours, layout }: Theme) =>
  StyleSheet.create({
    container: {
      width,
      paddingHorizontal: spacing.base,
    },
    name: {
      textAlign: 'center',
    },
    macrosContainer: {},
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    button: {
      height: 45,
      width: 45,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButton: {
      backgroundColor: colours.palette.green,
    },
    copyButton: {
      backgroundColor: colours.palette.blue,
      marginLeft: spacing.small,
    },
    removeButton: {
      backgroundColor: colours.palette.angry500,
      marginLeft: spacing.small,
    },
    barsContainer: {
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
    },
    statsNumbers: {
      ...layout.spaceBetweenRow,
      paddingHorizontal: spacing.large,
    },
    bars: {
      ...layout.spaceBetweenRow,
      alignItems: 'flex-end',
      width: '100%',
    },
    macroHeading: {
      width: '45%',
    },
    titleAndNumberContainer: {
      alignItems: 'flex-end',
    },
    divider: {
      height: 1,
      backgroundColor: colours.palette.neutral200,
      marginVertical: spacing.small,
    },
    actionButtonsContainer: {
      marginTop: spacing.medium,
      flexDirection: 'row',
    },
    progressIndicatorsContainer: {
      ...layout.spaceBetweenRow,
      paddingTop: spacing.medium,
    },
  });
