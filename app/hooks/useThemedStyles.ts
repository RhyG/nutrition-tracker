import * as React from 'react';

import { theme, Theme } from '../theme';

export type StyleFunction<Styles> = (theme: Theme) => Styles;

export const useThemedStyles = <Styles>(stylesFn: StyleFunction<Styles>): { theme: Theme; styles: Styles } => {
  return React.useMemo(
    () => ({
      theme,
      styles: stylesFn(theme),
    }),
    [stylesFn, theme],
  );
};
