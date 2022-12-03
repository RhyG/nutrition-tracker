import { JournalEntry } from '@app/types';

/**
 * Sum up all the calories for the passed day
 * @param entries an array of entries for a day
 * @returns {number} the total of the calories for each entry
 */
export const getCurrentCalories = (entries: JournalEntry[] = []): number => entries.reduce((acc, curr) => acc + Number(curr.calories), 0);

/**
 * Sum up all the protein for the passed day
 * @param entries an array of entries for a day
 * @returns {number} the total of the protein for each entry
 */
export const getCurrentProtein = (entries: JournalEntry[] = []): number => entries.reduce((acc, curr) => acc + Number(curr.protein), 0);
