import { FoodLogData, useFoodLogStore } from '@app/store/journal';
import { Day, Macro } from '@app/types';

type Averages = Record<keyof Macro, number>;

const NUM_OF_DAYS = 7;

const DEFAULT_AVERAGES: Averages = {
  calories: 0,
  protein: 0,
  carbohydrates: 0,
  fat: 0,
};

const getAverages = (data: FoodLogData) => {
  const dailyTotals = Object.keys(data).map((key: string) => {
    const dailyTotal = data[key as Day].reduce(
      (acc: Averages, curr: Averages) => ({
        calories: Number(acc.calories) + Number(curr.calories),
        protein: Number(acc.protein) + Number(curr.protein),
        carbohydrates: Number(acc.carbohydrates) + Number(curr.carbohydrates),
        fat: Number(acc.fat) + Number(curr.fat),
      }),
      DEFAULT_AVERAGES,
    );

    return dailyTotal;
  });

  const calories = Math.round(dailyTotals.reduce((a, c) => a + c.calories, 0) / NUM_OF_DAYS);
  const protein = Math.round(dailyTotals.reduce((a, c) => a + c.protein, 0) / NUM_OF_DAYS);
  const carbohydrates = Math.round(dailyTotals.reduce((a, c) => a + c.carbohydrates, 0) / NUM_OF_DAYS);
  const fat = Math.round(dailyTotals.reduce((a, c) => a + c.fat, 0) / NUM_OF_DAYS);

  return { calories, protein, carbohydrates, fat };
};

export const useWeeklyAverages = () => {
  const foodLogData = useFoodLogStore(state => state.foodLogData);

  const averages = getAverages(foodLogData);

  return {
    averageCalories: averages.calories,
    averageProtein: averages.protein,
    averageCarbohydrates: averages.carbohydrates,
    averageFat: averages.fat,
  };
};
