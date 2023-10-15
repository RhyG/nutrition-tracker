import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { DAYS } from '@app/config/constants';
import { useEvent } from '@app/hooks/useEvent';

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const Directions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export type Directions = keyof typeof Directions;

const TODAY = format(new Date(), 'EEEE') as Day;

export const useDaySwitcher = (): {
  currentDay: Day;
  handleDayChange: (direction: Directions) => void;
} => {
  const [currentDay, setCurrentDay] = useState<Day>(DAYS[DAYS.indexOf(TODAY)]!);

  // Automatically set the day to today on app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        setCurrentDay(format(new Date(), 'EEEE') as Day);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDayChange = useEvent((direction: Directions) => {
    const todayIndex = DAYS.indexOf(currentDay);

    switch (direction) {
      case Directions.LEFT:
        if (todayIndex > 0) {
          const day = DAYS[todayIndex - 1];
          if (day) setCurrentDay(day);
          return;
        } else {
          return;
        }
      case Directions.RIGHT:
        if (todayIndex < 6) {
          const day = DAYS[todayIndex + 1];
          if (day) setCurrentDay(day);
          return;
        } else {
          return;
        }
    }
  });

  return { currentDay, handleDayChange };
};
