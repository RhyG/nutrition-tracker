import { useShallow } from 'zustand/react/shallow';

import { useGoalsStore } from '@app/store/goals';

export function useMacroGoals() {
  const {
    calories: goalCalories,
    protein: goalProtein,
    carbohydrates: goalCarbohydrates,
    fat: goalFat,
    updateGoals,
  } = useGoalsStore(useShallow(state => ({ ...state })));

  return {
    goalCalories,
    goalProtein,
    goalCarbohydrates,
    goalFat,
    updateGoals,
  };
}
