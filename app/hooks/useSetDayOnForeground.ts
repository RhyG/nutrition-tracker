import { format } from 'date-fns';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { Day, useDayStore } from '@app/store/day';

export function useSetDayOnForeground() {
  const changeDay = useDayStore(state => state.changeDay);

  // Automatically set the day to today on app foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        changeDay(format(new Date(), 'EEEE') as Day);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [changeDay]);
}
