import { create } from 'zustand';

import { DAYS } from '@app/config/constants';
import AsyncStorage from '@app/modules/AsyncStorage';
import { Day, JournalEntry } from '@app/types';

export type JournalData = Record<Day, JournalEntry[]>;

interface JournalState {
  /**
   * Journal Data for each day.
   * Defaults to empty.
   */
  journalData: JournalData;
  /**
   * Updates the journal with received data.
   * @param {JournalData} data data to update journal with
   */
  updateJournal: (data: JournalData) => void;
  /**
   * Clears the journal of all data and restores to defaults.
   */
  clearJournal: () => void;
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
   * @param {JournalEntry} newItem the item to save.
   * @param {Day} day the day to save the new item to.
   */
  saveItem: (newItem: JournalEntry, day: Day) => void;
  /**
   * Remove an item from the current day.
   * @param {string} id ID of the item to remove.
   * @param {Day} day the day to remove the item from.
   */
  removeItem: (id: string, day: Day) => void;
  /**
   * Update an item from the received day.
   * @param {JournalEntry} updatedItem the updated item.
   * @param {Day} day the day to which the updated entry belongs.
   */
  updateItem: (updatedItem: JournalEntry, day: Day) => void;
  /**
   * Fills a day with the received entries.
   * Used for testing.
   * @param {JournalEntry[]} entries the entries to insert into the day.
   * @param {Day} day the day to insert the entries into.
   */
  fillDay: (entries: JournalEntry[], day: Day) => void;
}

export const DefaultJournalData: JournalData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

/**
 * The store for the journal entries and methods of updating.
 * @remarks could potentially move functions into an `actions` file to clean up store.
 */
export const useJournal = create<JournalState>(set => ({
  journalData: DefaultJournalData,
  updateJournal: async (data: JournalData) => {
    await AsyncStorage.setItem('journalData', data);
    set(({ journalData }) => ({
      journalData: { ...journalData, ...data },
    }));
  },
  clearJournal: async () => {
    await AsyncStorage.setItem('journalData', DefaultJournalData);
    set(() => ({ journalData: DefaultJournalData }));
  },
  clearDay: (day: Day) => {
    set(({ journalData }) => ({
      journalData: { ...journalData, [day]: [] },
    }));
  },
  copyPreviousDay: (currentDay: Day) => {
    set(({ journalData }) => {
      // If the current day is Monday then the entries from Sunday should be copied.
      const indexOfDay = currentDay === 'Monday' ? DAYS.indexOf('Sunday') : DAYS.indexOf(currentDay) - 1;

      // Get the entries and copy them
      const dayToCopy = DAYS[indexOfDay];

      if (dayToCopy) {
        const newItems = [...journalData[dayToCopy]];

        return {
          journalData: {
            ...journalData,
            [currentDay]: newItems,
          },
        };
      } else {
        return {
          journalData,
        };
      }
    });
  },
  saveItem: async (newItem: JournalEntry, day: Day) => {
    set(({ journalData }) => {
      const todayFood = [...journalData[day], newItem];

      const updatedWeek = {
        ...journalData,
        [day]: todayFood,
      };

      // Update the journal in storage
      AsyncStorage.setItem('journalData', updatedWeek);

      return {
        journalData: { ...journalData, ...updatedWeek },
      };
    });
  },
  removeItem: (id: string, day: Day) => {
    set(({ journalData }) => {
      // Filter current entries for all but the one matching the received ID
      const todayFood = journalData[day].filter(item => item.id !== id);

      const newJournalData = {
        ...journalData,
        [day]: todayFood,
      };

      // Update the journal in storage
      AsyncStorage.setItem('journalData', newJournalData);

      return {
        journalData: newJournalData,
      };
    });
  },
  updateItem: (updatedItem: JournalEntry, day: Day) => {
    set(({ journalData }) => {
      // Get the index of the item to be updated.
      const itemIndex = journalData[day].findIndex(item => item.id === updatedItem.id);

      // Filter out the item.
      const updatedEntries = journalData[day].filter(item => item.id !== updatedItem.id);

      //  Insert the updated item at the index of the item being updated.
      updatedEntries.splice(itemIndex, 0, updatedItem);

      const newJournalData = {
        ...journalData,
        [day]: updatedEntries,
      };

      // Update the journal in storage
      AsyncStorage.setItem('journalData', newJournalData);

      return {
        journalData: newJournalData,
      };
    });
  },
  fillDay: (entries: JournalEntry[], day: Day) => {
    set(({ journalData }) => ({
      journalData: { ...journalData, [day]: entries },
    }));
  },
}));
