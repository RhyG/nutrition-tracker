import { useMemo } from 'react';

import { theme, Theme } from '@app/config/theme';

export const useThemedStyles = (stylesFn: (theme: Theme) => void) => {
  return useMemo(() => stylesFn(theme), [stylesFn, theme]);
};
