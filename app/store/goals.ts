import { create } from 'zustand';

import { DEFAULT_CALORIES, DEFAULT_CARBOHYDRATES, DEFAULT_FAT, DEFAULT_PROTEIN } from '@app/config/constants';
import AsyncStorage from '@app/modules/AsyncStorage';

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

export const useGoalsStore = create<GoalState>(set => ({
  calories: DEFAULT_CALORIES,
  protein: DEFAULT_PROTEIN,
  carbohydrates: DEFAULT_CARBOHYDRATES,
  fat: DEFAULT_FAT,
  updateGoals: async newGoals => {
    set(state => ({ ...state, ...newGoals }));
    await AsyncStorage.setItem('goals', newGoals);
  },
}));
