import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { useSafeAreaSnapPoints } from '@app/hooks/useSafeAreaSnapPoints';
import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { ModalNames, useModalStore } from '@app/store/modal';
import { Theme } from '@app/theme';

import * as EditEntryModal from './EditEntryModal';
import * as NewEntryModal from './NewEntryModal';

const { width } = Dimensions.get('window');

const renderBackdrop = (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} />;

export const Modal = () => {
  const { styles } = useThemedStyles(stylesFn);

  const isModalActive = useModalStore(state => state.isModalActive);
  const activeModal = useModalStore(state => state.activeModal);
  const closeModal = useModalStore(state => state.closeModal);

  const sheetRef = useRef<BottomSheet>(null);

  const defaultSnapPoints = useSafeAreaSnapPoints();

  const onBottomSheetChange = async (snapPoint: number) => {
    if (snapPoint === -1) {
      closeModal();
    }
  };

  useEffect(
    function handleModalChange() {
      if (isModalActive) {
        sheetRef.current?.expand();
      } else {
        sheetRef.current?.close();
      }
    },
    [isModalActive],
  );

  if (!activeModal) return null;

  let snapPoints = defaultSnapPoints;
  let element: JSX.Element;

  if (activeModal.name === ModalNames.NEW_ENTRY) {
    snapPoints = NewEntryModal.snapPoints;
    element = <NewEntryModal.Component />;
  } else if (activeModal.name === ModalNames.EDIT_ENTRY) {
    snapPoints = EditEntryModal.snapPoints;
    element = <EditEntryModal.Component {...activeModal.params} />;
  } else {
    return null;
  }

  return (
    <BottomSheet snapPoints={snapPoints} ref={sheetRef} backdropComponent={renderBackdrop} enablePanDownToClose={true} onChange={onBottomSheetChange}>
      <View style={styles.sheetContainer}>{element}</View>
    </BottomSheet>
  );
};

const stylesFn = ({ spacing, colours, typography }: Theme) =>
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
      justifyContent: 'flex-end',
    },
    input: {
      backgroundColor: colours.palette.neutral200,
      borderRadius: 6,
      fontSize: typography.sizes.sm,
      padding: 8,
      color: '#000',
      marginTop: spacing.medium,
    },
    marginTop: { marginTop: 15 },
    quickAddInnerContainer: {
      marginHorizontal: spacing.base,
      flexDirection: 'column',
      justifyContent: 'center',
    },
    selectionContainer: { width, paddingTop: spacing.medium },
    buttonContainer: {
      backgroundColor: colours.palette.green,
      height: 40,
      width: 40,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
