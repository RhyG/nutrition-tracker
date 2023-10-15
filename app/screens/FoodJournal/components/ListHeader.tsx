import { Theme } from '@theme';
import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

import { Text } from '@app/components/Text';
import { useThemedStyles } from '@app/hooks/useThemedStyles';

export const ListHeader = ({ onHeadingsPress }: { onHeadingsPress: () => void }) => {
  const { styles } = useThemedStyles(stylesFn);

  return (
    <TouchableHighlight style={styles.tableHeadingsContainer} onPress={onHeadingsPress} underlayColor="#fff">
      <>
        <View style={styles.nameHeadingContainer}>
          <Text weight="semiBold" size="lg">
            Food
          </Text>
        </View>
        <View style={styles.macroHeadingContainer}>
          <Text weight="semiBold" size="lg">
            Calories
          </Text>
        </View>
        <View style={styles.macroHeadingContainer}>
          <Text weight="semiBold" size="lg">
            Protein
          </Text>
        </View>
      </>
    </TouchableHighlight>
  );
};

const stylesFn = ({ layout, spacing }: Theme) =>
  StyleSheet.create({
    tableHeadingsContainer: {
      ...layout.spaceBetweenRow,
      paddingHorizontal: spacing.small,
      paddingBottom: spacing.small,
      backgroundColor: '#fff',
    },
    nameHeadingContainer: {
      flex: 2,
    },
    macroHeadingContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
  });
