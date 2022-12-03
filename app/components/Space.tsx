import { StyleSheet, View } from 'react-native';

import { theme } from '@theme';

type Props = {
  flex?: number;
  units?: number;
  horizontal?: boolean;
};

/**
 * A generic component for adding empty space to a layout.
 */
export const Space = (props: Props) => {
  const customStyles = {
    height: props.horizontal ? 0 : theme.spacing(props.units || 1),
    width: props.horizontal ? theme.spacing(props.units || 1) : 0,
  };

  return <View style={[styles.space, customStyles]} />;
};

const styles = StyleSheet.create({
  space: {
    flexGrow: 0,
    flexShring: 1,
    flexBasis: 'auto',
  },
});
