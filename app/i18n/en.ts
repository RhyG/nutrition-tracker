export const en = {
  macros: {
    calories: 'Calories',
    carbohydrates: 'Carbohydrates',
    carbs: 'Carbs',
    protein: 'Protein',
    fat: 'Fat',
  },
  screens: {
    foodLog: {
      progressToGoals: 'Progress to Goals',
    },
    weeklyOverview: {
      average: 'Average',
      goal: 'Goal',
    },
    goals: {
      about: 'Goals will automatically update and are used to track your progress in the journal and weekly overview.',
    },
    calculators: {
      calculateTitle: 'Calculate TDEE',
      age: 'Age',
      weight: 'Weight',
      height: 'Height',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      activityLevel: 'Activity level',
      calculate: 'Calculate TDEE',
      convertTitle: 'Convert Kilojoules / Calories',
      kilojoules: 'Kilojoules',
      formula: 'Formula: 1 Cal = 4.184 kJ, rounded to the nearest whole number.',
    },
  },
  name: 'Name',
  done: 'Done',
  quickAdd: 'Quick Add',
  saved: 'Saved',
} as const;

export type EnglishTxns = typeof en;
