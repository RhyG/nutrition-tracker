import { nanoid } from 'nanoid';

import { useDayStore } from '@app/store/day';
import { useGoalsStore } from '@app/store/goals';
import { useFoodLogStore } from '@app/store/journal';
import { Day, FoodLogEntry } from '@app/types';

const FOODS = [
  'Burger',
  'Pizza',
  'Fruit salad',
  'Pasta',
  'Sushi',
  'Steak',
  'Parmi',
  'Fish & Chips',
  'Ramen',
  'Curry',
  'Stew',
  'Sandwich',
  'Tuna',
  'Burritos',
  'Casserole',
  'Soup',
  'Oyster Kilpatrick',
  'Snag in bread',
  'Katsu sando',
  'Beef stroganoff',
  'Curried sausages',
  'Chocolate shake',
  'Bic Mac',
] as const;

const generateRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

function getRandomEpochTime() {
  // Create a new Date object for the current date and time
  const currentDate = new Date();

  // Reset time to today at 07:00:00
  currentDate.setHours(7, 0, 0, 0);

  // Calculate the time span between 7 am and 10 pm in minutes
  const startMinutes = 7 * 60;
  const endMinutes = 22 * 60;
  const deltaMinutes = endMinutes - startMinutes;

  // Generate a random additional number of minutes to add
  const randomAdditionalMinutes = Math.floor(Math.random() * (deltaMinutes + 1));

  // Add the random minutes to the base date object
  currentDate.setMinutes(currentDate.getMinutes() + randomAdditionalMinutes);

  // Convert to epoch time
  return currentDate.getTime();
}

// Returns a large list of entries - for test use only
export function generateEntries(amount = 20): FoodLogEntry[] {
  const entries: FoodLogEntry[] = [];

  if (!__DEV__) {
    return entries;
  }

  for (let i = 0; i < amount; i++) {
    const name = FOODS[generateRandomNumber(0, FOODS.length)] ?? '';
    const calories = generateRandomNumber(10, 500);
    const protein = generateRandomNumber(5, 35);
    const fat = generateRandomNumber(5, 20);
    const carbohydrates = generateRandomNumber(5, 85);

    entries.push({ id: nanoid(), name, calories, protein, carbohydrates, fat, timestamp: getRandomEpochTime() });
  }

  return entries;
}

export function fillDay(day?: Day) {
  // const entries = generateEntries();
  const { calories, protein, carbohydrates, fat } = useGoalsStore.getState();
  const entries = generate(calories, protein, carbohydrates, fat);
  useFoodLogStore.getState().fillDay(entries, day ?? useDayStore.getState().currentDay);
}

export function fillWeek() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as Day[];
  days.forEach(day => fillDay(day));
}

function generate(calories: number, protein: number, carbohydrates: number, fat: number) {
  const numObjects = Math.floor(Math.random() * 8) + 5; // Generate between 5 and 12 objects
  const entries: FoodLogEntry[] = [];

  if (!__DEV__) {
    return entries;
  }

  for (let i = 0; i < numObjects; i++) {
    const name = FOODS[generateRandomNumber(0, FOODS.length)] ?? '';
    entries.push({ name, id: nanoid(), calories: 0, protein: 0, carbohydrates: 0, fat: 0, timestamp: getRandomEpochTime() });
  }

  const distribute = (limit: number, property: string) => {
    let remaining = limit;

    for (let i = 0; i < entries.length; i++) {
      if (i === entries.length - 1) {
        // @ts-expect-error -- can't be assed it's a dev mode util
        entries[i][property] = remaining;
      } else {
        let value = Math.random() * remaining;
        value = Math.min(value, remaining - (entries.length - i - 1));
        // @ts-expect-error -- can't be assed it's a dev mode util
        entries[i][property] = Math.round(value);
        remaining -= value;
      }
    }
  };

  distribute(calories, 'calories');
  distribute(protein, 'protein');
  distribute(carbohydrates, 'carbohydrates');
  distribute(fat, 'fat');

  return entries;
}
