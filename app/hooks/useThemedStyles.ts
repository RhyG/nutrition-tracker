import * as React from 'react';

import { Theme, theme } from '../theme';

export type StyleFunction<Styles> = (theme: Theme) => Styles;

// export const useThemedStyles = <Styles>(stylesFn?: StyleFunction<Styles>): { theme: Theme; styles: Styles | undefined } => {
//   return React.useMemo(
//     () => ({
//       theme,
//       styles: typeof stylesFn === 'function' ? stylesFn(theme) : undefined,
//     }),
//     [stylesFn, theme],
//   );
// };

type WithoutStyles = { theme: Theme; styles: undefined };
type WithStyles<Styles> = { theme: Theme; styles: Styles };

export function useThemedStyles<Styles>(): WithoutStyles;
export function useThemedStyles<Styles>(stylesFn: StyleFunction<Styles>): WithStyles<Styles>;
export function useThemedStyles<Styles>(stylesFn?: StyleFunction<Styles>): WithoutStyles | WithStyles<Styles> {
  // @ts-expect-error
  return React.useMemo(
    () => ({
      theme,
      styles: typeof stylesFn === 'function' ? stylesFn(theme) : undefined,
    }),
    [stylesFn, theme],
  );
}
