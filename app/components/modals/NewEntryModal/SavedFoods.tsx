import { nanoid } from 'nanoid';
import React, { useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';

import { FoodRow } from '@app/screens/FoodLog/components/FoodRow';
import { useDayStore } from '@app/store/day';
import { useJournalStore } from '@app/store/journal';
import { SavedFood, useSavedFoodsStore } from '@app/store/saved-foods';
import { JournalEntry } from '@app/types';

export function SavedFoods() {
  const currentDay = useDayStore(state => state.currentDay);

  const savedFoods = useSavedFoodsStore(state => state.foods);

  const renderItem: ListRenderItem<Omit<JournalEntry, 'timestamp'>> = useCallback(
    ({ item }) => {
      function saveEntry() {
        const detailsToSave = {
          ...item,
          id: nanoid(),
          timestamp: Date.now(),
        };

        useJournalStore.getState().saveItem(detailsToSave, currentDay);
      }

      function onDeleteButtonPress(id: string) {
        useSavedFoodsStore.getState().removeFood(id);
      }

      return <FoodRow entry={item} onPress={saveEntry} onDeleteButtonPress={onDeleteButtonPress} />;
    },
    [currentDay],
  );

  return <FlatList data={savedFoods} renderItem={renderItem} keyExtractor={keyExtractor} />;
}

const keyExtractor = (item: SavedFood) => item.id;
