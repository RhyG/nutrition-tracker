import { useEffect, useState } from 'react';

import { JournalData, useJournal } from '@app/store/journal';
import { Day, JournalEntry } from '@app/types';

type ReducedJournalEntry = Pick<JournalEntry, 'protein' | 'calories'>;

const DEFAULT_AVERAGES: ReducedJournalEntry = {
  calories: 0,
  protein: 0,
};

const getAverages = (data: JournalData) => {
  const dailyTotals = Object.keys(data).map((key: string) => {
    const dailyTotal = data[key as Day].reduce(
      (acc: ReducedJournalEntry, curr: ReducedJournalEntry) => ({
        calories: Number(acc.calories) + Number(curr.calories),
        protein: Number(acc.protein) + Number(curr.protein),
      }),
      DEFAULT_AVERAGES,
    );

    return dailyTotal;
  });

  const calories = Math.round(dailyTotals.reduce((a, c) => a + c.calories, 0) / 7);
  const protein = Math.round(dailyTotals.reduce((a, c) => a + c.protein, 0) / 7);

  return { calories, protein };
};

export const useWeeklyAverages = () => {
  const journalData = useJournal(state => state.journalData);

  const averages = getAverages(journalData);

  return {
    averageCalories: averages.calories,
    averageProtein: averages.protein,
  };
};
