import { DAYS } from '@app/config/constants';
import { useEvent } from '@app/hooks/useEvent';
import { useDayStore } from '@app/store/day';
import { Day } from '@app/types';

export const Directions = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
} as const;

export type Directions = keyof typeof Directions;

export const useDaySwitcher = (): {
  currentDay: Day;
  handleDayChange: (direction: Directions) => void;
} => {
  const storeDay = useDayStore(state => state.currentDay);
  const changeDay = useDayStore(state => state.changeDay);

  const handleDayChange = useEvent((direction: Directions) => {
    const todayIndex = DAYS.indexOf(storeDay);

    switch (direction) {
      case Directions.LEFT:
        if (todayIndex > 0) {
          const day = DAYS[todayIndex - 1];
          if (day) changeDay(day);
          return;
        } else {
          return;
        }
      case Directions.RIGHT:
        if (todayIndex < 6) {
          const day = DAYS[todayIndex + 1];
          if (day) changeDay(day);
          return;
        } else {
          return;
        }
    }
  });

  return { currentDay: storeDay, handleDayChange };
};
