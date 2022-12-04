import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { DAYS } from '@app/config/constants';
import { Day } from '@app/types';

/**
 * Should this be a union type?
 * Pros: Better devex, less chance of erros because of typos, only update in one place.
 * Conds: Enums add to bundle size.
 */
export enum Directions {
  LEFT,
  RIGHT,
}

const TODAY = format(new Date(), 'EEEE') as Day;

export const useDaySwitcher = (): {
  currentDay: Day;
  handleDayChange: (direction: Directions) => void;
} => {
  const [currentDay, setCurrentDay] = useState<Day>(DAYS[DAYS.indexOf(TODAY)]);

  // Automatically set the day to today on app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setCurrentDay(format(new Date(), 'EEEE') as Day);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDayChange = useCallback(
    (direction: Directions) => {
      const todayIndex = DAYS.indexOf(currentDay);

      switch (direction) {
        case Directions.LEFT:
          if (todayIndex > 0) {
            setCurrentDay(DAYS[todayIndex - 1]);
            return;
          } else {
            return;
          }
        case Directions.RIGHT:
          if (todayIndex < 6) {
            setCurrentDay(DAYS[todayIndex + 1]);
            return;
          } else {
            return;
          }
      }
    },
    [currentDay],
  );

  return { currentDay, handleDayChange };
};
