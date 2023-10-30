import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import StorageModule from '@app/modules/AsyncStorage';
import { JournalEntry } from '@app/types';

type SavedFood = Omit<JournalEntry, 'timestamp'>;

type SavedFoodsState = {
  foods: SavedFood[];
  saveFood: (food: SavedFood) => void;
  removeFood: (id: string) => void;
};

export const useSavedFoodsStore = create<SavedFoodsState>()(
  persist(
    set => ({
      foods: [],
      saveFood: (food: SavedFood) => set(state => ({ foods: [...state.foods, food] })),
      removeFood: (id: string) =>
        set(state => {
          const foods = [...state.foods].filter(food => food.id !== id);
          return { foods };
        }),
    }),
    {
      name: 'saved-foods',
      storage: createJSONStorage(() => StorageModule),
    },
  ),
);
