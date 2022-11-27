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

interface IGoalState {
  calories: number;
  protein: number;
  updateGoals: (newGoals: Goals) => void;
}

export const useGoals = create<IGoalState>(set => ({
  calories: DEFAULT_CALORIES,
  protein: DEFAULT_PROTEIN,
  updateGoals: async (newGoals: Goals) => {
    await AsyncStorage.setItem('goals', newGoals);
    set(state => ({ ...state, ...newGoals }));
  },
}));
