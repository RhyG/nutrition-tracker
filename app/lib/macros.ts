import { FoodLogEntry, Macro } from '@app/types';

/**
 * Returns the total of a given macro for a given day.
 * @param macro the macro to get the total for.
 * @param entries the list of entries to get the total from.
 */
export function getCurrentMacroTotal(macro: keyof Macro, entries: FoodLogEntry[] = []) {
  return entries.reduce((acc, curr) => acc + Number(curr[macro]), 0);
}

/**
 * Returns the total of all macros for a given day.
 * @param entries the list of entries to get the total from.
 */
export function getCurrentMacroTotals(entries: FoodLogEntry[] = []) {
  return entries.reduce(
    (acc, curr) => {
      return {
        fat: acc.fat + Number(curr.fat),
        protein: acc.protein + Number(curr.protein),
        calories: acc.calories + Number(curr.calories),
        carbohydrates: acc.carbohydrates + Number(curr.carbohydrates),
      };
    },
    { fat: 0, protein: 0, calories: 0, carbohydrates: 0 },
  );
}
