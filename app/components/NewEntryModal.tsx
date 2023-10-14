import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { Text } from './Text';
import { Theme } from '@app/theme';
import { StyleSheet, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />;

export const NewEntryModal = React.forwardRef<BottomSheet, {}>((props, ref) => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const snapPoints = useSafeAreaSnapPoints();

  const entryNameInputRef = useRef<TextInput>(null);
  const caloriesInputRef = useRef<TextInput>(null);
  const proteinInputRef = useRef<TextInput>(null);

  return (
    <BottomSheet snapPoints={snapPoints} ref={ref} backdropComponent={renderBackdrop} enablePanDownToClose={true}>
      <View style={styles.sheetContainer}>
        <Text preset="subheading" style={styles.sheetHeading}>
          New Entry
        </Text>
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
    </BottomSheet>
  );
});

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
      fontSize: 15,
      paddingVertical: 8,
      paddingHorizontal: 8,
      color: '#000',
    },
    marginTop: { marginTop: 15 },
    radioButtonContainer: { marginLeft: 'auto' },
  });
