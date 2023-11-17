import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { nanoid } from 'nanoid';
import React, { useCallback } from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';

import { Text } from '@app/components/Text';
import { FoodRow } from '@app/screens/FoodLog/components/FoodRow';
import { useDayStore } from '@app/store/day';
import { useFoodLogStore } from '@app/store/journal';
import { SavedFood, useSavedFoodsStore } from '@app/store/saved-foods';
import { FoodLogEntry } from '@app/types';

export function SavedFoods() {
  const navigation = useNavigation();

  const currentDay = useDayStore(state => state.currentDay);
  const savedFoods = useSavedFoodsStore(state => state.foods);

  const renderItem: ListRenderItem<Omit<FoodLogEntry, 'timestamp'>> = useCallback(
    ({ item }) => {
      function saveEntry() {
        const detailsToSave = {
          ...item,
          id: nanoid(),
          timestamp: Date.now(),
        };

        useFoodLogStore.getState().saveItem(detailsToSave, currentDay);
        navigation.navigate('Food Log' as never);
      }

      function onDeleteButtonPress(id: string) {
        useSavedFoodsStore.getState().removeFood(id);
      }

      return <FoodRow entry={item} onPress={saveEntry} onDeleteButtonPress={onDeleteButtonPress} />;
    },
    [currentDay, navigation],
  );

  return <BottomSheetFlatList data={savedFoods} renderItem={renderItem} keyExtractor={keyExtractor} ListEmptyComponent={ListEmptyComponent} />;
}

function keyExtractor(item: SavedFood) {
  return item.id;
}

function ListEmptyComponent() {
  return (
    <View style={listEmptyComponentStyles.container}>
      <Text style={listEmptyComponentStyles.text}>No saved foods</Text>
    </View>
  );
}

const listEmptyComponentStyles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
  },
});
