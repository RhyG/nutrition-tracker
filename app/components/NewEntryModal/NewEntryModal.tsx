import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { Dimensions, ListRenderItem, StyleSheet, TextInput, View } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@app/theme';

import { Text } from '../Text';
import { Tab, Tabs, sections } from './Tabs';

const { width } = Dimensions.get('window');

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />;

export const NewEntryModal = React.forwardRef<BottomSheet, Record<string, unknown>>((_, ref) => {
  const {
    styles,
    theme: { colours, spacing },
  } = useThemedStyles(stylesFn);

  const snapPoints = useSafeAreaSnapPoints();

  const entryNameInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);
  const proteinInputRef = useRef<TextInput>(null);

  const listRef = useRef<FlatList<Tab>>(null);

  const scrollToTab = (tab: Tab) => {
    listRef.current?.scrollToIndex({ index: tab === 'QUICK_ADD' ? 0 : 1, animated: true });
  };

  const renderItem: ListRenderItem<Tab> = ({ item }) => {
    switch (item) {
      case 'QUICK_ADD':
        return (
          <View style={styles.selectionContainer}>
            <View style={styles.quickAddInnerContainer}>
              <BottomSheetTextInput
                style={styles.input}
                placeholder="Name"
                // onChangeText={(text) => onChangeEntryDetails('name', text)}
                // value={name}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={entryNameInputRef}
                placeholderTextColor={colours.palette.neutral300}
                testID="name-input"
              />
              <BottomSheetTextInput
                style={[styles.input, styles.marginTop]}
                placeholder="Calories"
                // value={String(calories)}
                // onChangeText={(text) => onChangeEntryDetails('calories', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={caloriesInputRef}
                placeholderTextColor={colours.palette.neutral300}
                keyboardType="numeric"
                testID="calories-input"
              />
              <BottomSheetTextInput
                style={[styles.input, styles.marginTop]}
                placeholder="Protein"
                // onChangeText={(text) => onChangeEntryDetails('protein', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={proteinInputRef}
                placeholderTextColor={colours.palette.neutral300}
                // value={String(protein)}
                keyboardType="numeric"
                testID="protein-input"
              />
              <BottomSheetTextInput
                style={[styles.input, styles.marginTop]}
                placeholder="Carbohydrates"
                // onChangeText={(text) => onChangeEntryDetails('protein', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={proteinInputRef}
                placeholderTextColor={colours.palette.neutral300}
                // value={String(protein)}
                keyboardType="numeric"
                testID="carbohydrates-input"
              />
              <BottomSheetTextInput
                style={[styles.input, styles.marginTop]}
                placeholder="Fat"
                // onChangeText={(text) => onChangeEntryDetails('protein', text)}
                // @ts-expect-error this type is gross, not sure how to fix
                ref={proteinInputRef}
                placeholderTextColor={colours.palette.neutral300}
                // value={String(protein)}
                keyboardType="numeric"
                testID="fat-input"
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => {}}>
                  <Text colour={colours.palette.neutral100}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => {}}>
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

const stylesFn = ({ spacing, colours }: Theme) =>
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
      borderRadius: 5,
      fontSize: 15,
      padding: 8,
      color: '#000',
    },
    marginTop: { marginTop: 15 },
    quickAddInnerContainer: {
      marginHorizontal: spacing.base,
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'center',
    },
    selectionContainer: { width },
  });