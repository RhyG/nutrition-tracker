import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetTextInput, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View, Animated, ListRenderItem, Dimensions } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { Text } from '../Text';
import { Theme } from '@app/theme';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Tab = 'QUICK_ADD' | 'SAVED';

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />;

export const NewEntryModal = React.forwardRef<BottomSheet, {}>((props, ref) => {
  const {
    styles,
    theme: { colours, spacing },
  } = useThemedStyles(stylesFn);

  const scrollX = useRef(new Animated.Value(0)).current;

  const snapPoints = useSafeAreaSnapPoints();

  const entryNameInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);
  const proteinInputRef = useRef<TextInput>(null);

  const sections = ['QUICK_ADD', 'SAVED'];

  const listRef = useRef<FlatList<string>>(null);

  const scrollToTab = (tab: Tab) => {
    listRef.current?.scrollToIndex({ index: tab === 'QUICK_ADD' ? 0 : 1, animated: true });
  };

  const renderItem: ListRenderItem<string> = ({ item }) => {
    switch (item) {
      case 'QUICK_ADD':
        return (
          <View style={{ width }}>
            <View style={{ marginHorizontal: spacing.base, flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
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
                  <Text colour="#fff">Save</Text>
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
          <View style={{ width }}>
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
        <Tabs scrollX={scrollX} onTabSelected={scrollToTab} />
        <FlatList
          // onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
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

function Tabs({ onTabSelected }: { onTabSelected: (index: Tab) => void }) {
  const {
    styles,
    theme: { spacing, colours },
  } = useThemedStyles(stylesFn);
  const indicatorContainerWidth = width - spacing.base * 2;
  const indicatorWidth = indicatorContainerWidth / 2;

  /* 
    Yeah we could drive this via data and allow any number of tabs but bit early for that,
    and placing the state here also means it doesn't re-render the list in the parent when changing tabs.
  */
  const [selectedTab, setSelectedTab] = useState('QUICK_ADD');

  const selectionIndiicatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const newPosition = selectedTab === 'QUICK_ADD' ? 0 : indicatorContainerWidth - indicatorWidth;

    Animated.spring(selectionIndiicatorPosition, {
      toValue: newPosition,
      useNativeDriver: true,
      tension: 40,
      overshootClamping: true,
    }).start();
  }, [selectedTab]);

  const selectTab = (tab: Tab) => {
    setSelectedTab(tab);
    onTabSelected(tab);
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => selectTab('QUICK_ADD')} style={{ flexDirection: 'row' }}>
            <Feather name="plus" size={24} color="black" />
            <Text preset="formLabel" style={styles.sheetHeading}>
              Quick Add
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => selectTab('SAVED')} style={{ flexDirection: 'row' }}>
            <Feather name="save" size={24} color="black" />
            <Text preset="formLabel" style={styles.sheetHeading}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 5, width: indicatorContainerWidth }}>
        <Animated.View
          style={{ backgroundColor: colours.palette.accent400, width: indicatorWidth, height: 3, transform: [{ translateX: selectionIndiicatorPosition }] }}
        />
      </View>
    </View>
  );
}

const stylesFn = ({ spacing, colours }: Theme) =>
  StyleSheet.create({
    box: {
      width: '100%',
    },
    sheetContainer: {
      flex: 1,
      // paddingHorizontal: spacing.base,
      paddingTop: spacing.small,
    },
    sheetHeading: {
      marginBottom: 8,
      marginLeft: 8,
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
      fontSize: 15,
      padding: 8,
      color: '#000',
    },
    marginTop: { marginTop: 15 },
    radioButtonContainer: { marginLeft: 'auto' },
  });
