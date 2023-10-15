import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

import { theme } from '@app/theme';
import { Day } from '@app/types';

import { DropdownMenu } from '../components';

/* Sets the dropdown menu in the right side of the header */
export const useDropdownHeader = (currentDay: Day) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      // TODO: share these values with the header style in app/navigation/index.tsx
      headerStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        borderBottomWidth: 0,
        borderWidth: 0,
        shadowOffset: { height: 0, width: 0 },
        backgroundColor: theme.colours.palette.neutral200,
      },
      headerRight: () => <DropdownMenu currentDay={currentDay} />,
    });
  }, [navigation, currentDay]);
};
