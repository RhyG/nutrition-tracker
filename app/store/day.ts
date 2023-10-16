import { format } from 'date-fns';
import { create } from 'zustand';

import { DAYS } from '@app/config/constants';
import { Day } from '@app/types';

const TODAY = format(new Date(), 'EEEE') as Day;

type DayState = {
  currentDay: Day;
  changeDay: (day: Day) => void;
};

export const useDayStore = create<DayState>(set => ({
  currentDay: DAYS[DAYS.indexOf(TODAY)]!,
  changeDay: (day: Day) => set(() => ({ currentDay: day })),
}));
