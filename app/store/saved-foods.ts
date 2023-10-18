import { create } from 'zustand';

import { JournalEntry } from '@app/types';

type SavedFood = Omit<JournalEntry, 'timestamp'>;

type SavedFoodsState = {
  foods: Record<string, SavedFood>;
  saveFood: (food: SavedFood) => void;
  removeFood: (id: string) => void;
};

export const useSavedFoodsStore = create<SavedFoodsState>(set => ({
  foods: {},
  saveFood: (food: SavedFood) => set(state => ({ foods: { ...state.foods, [food.id]: food } })),
  removeFood: (id: string) =>
    set(state => {
      const foods = Object.assign(state.foods, {});
      delete foods[id];
      return { foods };
    }),
}));
