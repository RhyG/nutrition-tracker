import { ActivityLevel, Day } from '@app/types';

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    label: 'Sedentary (little to no exercise + work a desk job)',
    value: 'Sedentary (little to no exercise + work a desk job)',
    multiplier: 1.2,
  },
  {
    label: 'Lightly active (light exercise 1-3 days / week)',
    value: 'Lightly active (light exercise 1-3 days / week)',
    multiplier: 1.375,
  },
  {
    label: 'Moderately active (moderate exercise 3-5 days / week)',
    value: 'Moderately active (moderate exercise 3-5 days / week)',
    multiplier: 1.55,
  },
  {
    label: 'Very active (heavy exercise 6-7 days / week)',
    value: 'Very active (heavy exercise 6-7 days / week)',
    multiplier: 1.725,
  },
  {
    label:
      'Extremely active (very heavy exercise, hard labor job, training 2x / day)',
    value:
      'Extremely active (very heavy exercise, hard labor job, training 2x / day)',
    multiplier: 1.9,
  },
];

export const FEMALE_TDEE_VARIABLE = -161;
export const MALE_TDEE_VARIABLE = 5;

export enum Genders {
  FEMALE = 'female',
  MALE = 'male',
}

export const DAYS: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const REPO_URL = 'https://github.com/RhyG/nutrition-tracker-app';

export const DEFAULT_CALORIES = 2000;
export const DEFAULT_PROTEIN = 100;
