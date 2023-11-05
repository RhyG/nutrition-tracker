import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import { ModalNames, useModalStore } from '@app/store/modal';

/* Sets the dropdown menu in the right side of the header */
export const useDropdownHeader = () => {
  const navigation = useNavigation();

  const openModal = useModalStore(state => state.openModal);

  useLayoutEffect(() => {
    navigation.setOptions({
      // TODO: share these values with the header style in app/navigation/index.tsx
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        borderWidth: 0,
        shadowOffset: { height: 0, width: 0 },
      },
      headerRight: () => (
        <TouchableOpacity onPress={() => openModal({ name: ModalNames.FOOD_LOG_MENU })} style={styles}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [openModal, navigation]);
};

const styles = {
  paddingRight: 12.5,
};
