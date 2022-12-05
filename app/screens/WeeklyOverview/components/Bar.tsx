import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Menu, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu';

import { Text } from '@app/components/Text';
import { Day } from '@app/types';
import { calculateSizeAsPercentage } from '@app/lib/calculators';
import { Theme } from '@app/theme';
import { useThemedStyles } from '@app/hooks/useThemedStyles';

const { Popover } = renderers;

type Props = {
  day: Day;
  type: 'calories' | 'protein';
  amount: number;
  goal: number;
};

export const _Bar = ({ amount, day, goal }: Props): JSX.Element => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const exceededMax = amount > goal;

  return (
    <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'top' }}>
      <MenuTrigger
        //@ts-ignore looks like an issue with the library
        style={styles.barContainer}
        customStyles={{
          TriggerTouchableComponent: TouchableWithoutFeedback,
        }}>
        <View style={styles.barOuter}>
          <View
            style={[
              styles.barInner,
              {
                height: `${calculateSizeAsPercentage(goal, amount)}%`,
                backgroundColor: exceededMax ? colours.palette.angry500 : colours.palette.green,
              },
            ]}
          />
        </View>
        <Text style={styles.text} size="sm" numberOfLines={1}>
          {day.substring(0, 3)}
        </Text>
      </MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        <Text>{amount}</Text>
      </MenuOptions>
    </Menu>
  );
};

export const Bar = React.memo(_Bar);

const stylesFn = (theme: Theme) =>
  StyleSheet.create({
    barOuter: {
      height: 140,
      width: 15,
      borderRadius: 6,
      backgroundColor: theme.colours.palette.neutral300,
      justifyContent: 'flex-end',
    },
    barInner: {
      borderRadius: 6,
    },
    barContainer: {
      width: 35,
      alignItems: 'center',
    },
    text: {
      marginTop: 2,
    },
    optionsContainer: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 6,
      backgroundColor: '#E8E8E8',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
    },
  });
