import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@app/theme';

import { Text } from '../Text';

export const sections = ['QUICK_ADD', 'SAVED'] as const;
export type Tab = (typeof sections)[number];

const { width } = Dimensions.get('window');

export function Tabs({ onTabSelected }: { onTabSelected: (tab: Tab) => void }) {
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
  }, [indicatorContainerWidth, indicatorWidth, selectedTab, selectionIndiicatorPosition]);

  const selectTab = (tab: Tab) => {
    setSelectedTab(tab);
    onTabSelected(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabTitlesContainer}>
        <View style={styles.tabTitleContainer}>
          <TouchableOpacity onPress={() => selectTab('QUICK_ADD')} style={styles.tabButton}>
            <Feather name="plus" size={22} color={colours.palette.neutral700} />
            <Text preset="formLabel" style={styles.sheetHeading}>
              Quick Add
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabTitleContainer}>
          <TouchableOpacity onPress={() => selectTab('SAVED')} style={styles.tabButton}>
            <Feather name="save" size={22} color={colours.palette.neutral700} />
            <Text preset="formLabel" style={styles.sheetHeading}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.indicatorContainer, { width: indicatorContainerWidth }]}>
        <Animated.View style={[styles.indicator, { width: indicatorWidth, transform: [{ translateX: selectionIndiicatorPosition }] }]} />
      </View>
    </View>
  );
}

const stylesFn = ({ colours }: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    tabTitlesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tabTitleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    tabButton: {
      flexDirection: 'row',
    },
    sheetHeading: {
      marginBottom: 8,
      marginLeft: 8,
      color: colours.palette.neutral700,
    },
    indicatorContainer: {
      height: 5,
    },
    indicator: { backgroundColor: colours.palette.accent400, height: 3 },
  });
