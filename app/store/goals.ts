import { create } from 'zustand';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_CALORIES, DEFAULT_CARBOHYDRATES, DEFAULT_FAT, DEFAULT_PROTEIN } from '@app/config/constants';
import StorageModule from '@app/modules/storage';

export type Goals = {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
};

export const DefaultGoals: Goals = {
  calories: DEFAULT_CALORIES,
  protein: DEFAULT_PROTEIN,
  carbohydrates: DEFAULT_CARBOHYDRATES,
  fat: DEFAULT_FAT,
};

type GoalState = {
  /**
   * The user's calorie goal.
   */
  calories: number;
  /**
   * The user's protein goal.
   */
  protein: number;
  /**
   * The user's carbphydrates goal.
   */
  carbohydrates: number;
  /**
   * The user's fat goal.
   */
  fat: number;
  /**
   * Updated user goals and saves in local storage.
   * @param {Goals} newGoals the new goals to be saved.
   */
  updateGoals: (newGoals: Goals) => void;
};

export const useGoalsStore = create<GoalState>()(
  persist(
    set => ({
      calories: DEFAULT_CALORIES,
      protein: DEFAULT_PROTEIN,
      carbohydrates: DEFAULT_CARBOHYDRATES,
      fat: DEFAULT_FAT,
      updateGoals: async newGoals => {
        set(state => ({ ...state, ...newGoals }));
      },
    }),
    {
      name: 'macro-goals',
      // the expected interface for the storage matches the module, but the library expects a weirdly specific type
      storage: createJSONStorage(() => StorageModule as unknown as StateStorage),
    },
  ),
);
