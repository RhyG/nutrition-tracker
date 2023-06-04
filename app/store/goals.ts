import create from 'zustand';

import { DEFAULT_CALORIES, DEFAULT_PROTEIN } from '@app/config/constants';
import AsyncStorage from '@app/modules/AsyncStorage';

export type Goals = {
  calories: number;
  protein: number;
};

export const DefaultGoals: Goals = {
  calories: DEFAULT_CALORIES,
  protein: DEFAULT_PROTEIN,
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
   * Updated user goals and saves in local storage.
   * @param {Goals} newGoals the new goals to be saved.
   */
  updateGoals: (newGoals: Goals) => void;
};

export const useGoals = create<GoalState>((set) => ({
  calories: DEFAULT_CALORIES,
  protein: DEFAULT_PROTEIN,
  updateGoals: async (newGoals: Goals) => {
    await AsyncStorage.setItem('goals', newGoals);
    set((state) => ({ ...state, ...newGoals }));
  },
}));
