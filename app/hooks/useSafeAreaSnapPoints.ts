import { useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const useSafeAreaSnapPoints = () => {
  const { bottom: bottomInset } = useSafeAreaInsets();
  /* The bottom sheet is slightly higher on phones with a bottom bar */
  return useMemo(() => {
    const snapPoint = bottomInset > 0 ? '46%' : '53%';

    return [snapPoint];
  }, [bottomInset]);
};
