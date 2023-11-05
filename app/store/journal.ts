import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware';

import { DAYS } from '@app/config/constants';
import StorageModule from '@app/modules/AsyncStorage';
import { Day, FoodLogEntry } from '@app/types';

export type FoodLogData = Record<Day, FoodLogEntry[]>;

interface FoodLogState {
  /**
   * FoodLog Data for each day.
   * Defaults to empty.
   */
  foodLogData: FoodLogData;
  /**
   * Updates the food log with received data.
   * @param {FoodLogData} data data to update food log with
   */
  updateFoodLog: (data: FoodLogData) => void;
  /**
   * Clears the food log of all data and restores to defaults.
   */
  clearFoodLog: () => void;
  /**
   * Removes all entries for the current day.
   * @param {Day} day day to clear
   */
  clearDay: (day: Day) => void;
  /**
   * Copies the previous day into the current.
   * @param {Day} currentDay current day
   */
  copyPreviousDay: (currentDay: Day) => void;
  /**
   * Save an item to the current day.
   * @param {FoodLogEntry} newItem the item to save.
   * @param {Day} day the day to save the new item to.
   */
  saveItem: (newItem: FoodLogEntry, day: Day) => void;
  /**
   * Remove an item from the current day.
   * @param {string} id ID of the item to remove.
   * @param {Day} day the day to remove the item from.
   */
  removeItem: (id: string, day: Day) => void;
  /**
   * Update an item from the received day.
   * @param {FoodLogEntry} updatedItem the updated item.
   * @param {Day} day the day to which the updated entry belongs.
   */
  updateItem: (updatedItem: FoodLogEntry, day: Day) => void;
  /**
   * Copy an item from the received day.
   * @param {FoodLogEntry} entry the entry to copy.
   * @param {Day} day the day to which the updated entry belongs.
   */
  copyItem: (entry: FoodLogEntry, day: Day) => void;
  /**
   * Fills a day with the received entries.
   * Used for testing.
   * @param {FoodLogEntry[]} entries the entries to insert into the day.
   * @param {Day} day the day to insert the entries into.
   */
  fillDay: (entries: FoodLogEntry[], day: Day) => void;
}

export const DefaultFoodLogData: FoodLogData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

/**
 * The store for the food log entries and methods of updating.
 * @remarks could potentially move functions into an `actions` file to clean up store.
 */
export const useFoodLogStore = create<FoodLogState>()(
  persist(
    set => ({
      foodLogData: DefaultFoodLogData,
      updateFoodLog: async (data: FoodLogData) => {
        set(({ foodLogData }) => ({
          foodLogData: { ...foodLogData, ...data },
        }));
      },
      clearFoodLog: async () => {
        set(() => ({ foodLogData: DefaultFoodLogData }));
      },
      clearDay: (day: Day) => {
        set(({ foodLogData }) => ({
          foodLogData: { ...foodLogData, [day]: [] },
        }));
      },
      copyPreviousDay: (currentDay: Day) => {
        set(({ foodLogData }) => {
          // If the current day is Monday then the entries from Sunday should be copied.
          const indexOfDay = currentDay === 'Monday' ? DAYS.indexOf('Sunday') : DAYS.indexOf(currentDay) - 1;

          // Get the entries and copy them
          const dayToCopy = DAYS[indexOfDay];

          if (dayToCopy) {
            const newItems = [...foodLogData[dayToCopy]];

            return {
              foodLogData: {
                ...foodLogData,
                [currentDay]: newItems,
              },
            };
          } else {
            return {
              foodLogData,
            };
          }
        });
      },
      saveItem: async (newItem: FoodLogEntry, day: Day) => {
        set(({ foodLogData }) => {
          const todayFood = [...foodLogData[day], newItem];

          const updatedWeek = {
            ...foodLogData,
            [day]: todayFood,
          };

          return {
            foodLogData: { ...foodLogData, ...updatedWeek },
          };
        });
      },
      removeItem: (id: string, day: Day) => {
        set(({ foodLogData }) => {
          // Filter current entries for all but the one matching the received ID
          const todayFood = foodLogData[day].filter(item => item.id !== id);

          const newFoodLogData = {
            ...foodLogData,
            [day]: todayFood,
          };

          return {
            foodLogData: newFoodLogData,
          };
        });
      },
      updateItem: (updatedItem: FoodLogEntry, day: Day) => {
        set(({ foodLogData }) => {
          // Get the index of the item to be updated.
          const itemIndex = foodLogData[day].findIndex(item => item.id === updatedItem.id);

          // Filter out the item.
          const updatedEntries = foodLogData[day].filter(item => item.id !== updatedItem.id);

          //  Insert the updated item at the index of the item being updated.
          updatedEntries.splice(itemIndex, 0, updatedItem);

          const newFoodLogData = {
            ...foodLogData,
            [day]: updatedEntries,
          };

          return {
            foodLogData: newFoodLogData,
          };
        });
      },
      copyItem: (entry: FoodLogEntry, day: Day) => {
        set(({ foodLogData }) => {
          const entriesForDay = [...foodLogData[day]];

          // Get the index of the entry to be copied.
          const indexToInsertAt = entriesForDay.findIndex(item => item.id === entry.id) + 1;

          const newEntry = { ...entry, id: nanoid() };

          //  Insert the updated item at the index of the item being updated.
          entriesForDay.splice(indexToInsertAt, 0, newEntry);

          const newFoodLogData = {
            ...foodLogData,
            [day]: entriesForDay,
          };

          return {
            foodLogData: newFoodLogData,
          };
        });
      },
      fillDay: (entries: FoodLogEntry[], day: Day) => {
        set(({ foodLogData }) => ({
          foodLogData: { ...foodLogData, [day]: entries },
        }));
      },
    }),
    {
      name: 'food-log',
      // the expected interface for the storage matches the module, but the library expects a weirdly specific type
      storage: createJSONStorage(() => StorageModule as unknown as StateStorage),
    },
  ),
);
