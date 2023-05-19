import { HeaderStyle } from '@app/theme';
import { Day } from '@app/types';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@app/theme';
import { DropdownMenu } from '../components';

/* Sets the dropdown menu in the right side of the header */
export const useDropdownHeader = (currentDay: Day) => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        ...HeaderStyle,
        backgroundColor: theme.colours.palette.neutral200,
      },
      headerRight: () => <DropdownMenu currentDay={currentDay} />,
    });
  }, [navigation, currentDay]);
};
