import { create } from 'zustand';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

import StorageModule from '@app/modules/AsyncStorage';
import { FoodLogEntry } from '@app/types';

export type SavedFood = Omit<FoodLogEntry, 'timestamp'>;

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
      // the expected interface for the storage matches the module, but the library expects a weirdly specific type
      storage: createJSONStorage(() => StorageModule as unknown as StateStorage),
    },
  ),
);
