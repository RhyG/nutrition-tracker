// TODO: Remove all project specific types from here.
export type FoodLogEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  timestamp: number;
};

export type Macro = Pick<FoodLogEntry, 'calories' | 'protein' | 'carbohydrates' | 'fat'>;

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
