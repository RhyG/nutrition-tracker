import { Platform } from 'react-native';

import { colours } from './colours';
import { layout } from './layout';
import { typography } from './typography';

const SPACING_SIZE = 5;

// export const colours = {
//   grey: '#a9a9a9',
//   darkGrey: '#2d2d2d',
//   green: '#3ECF8E',
//   offWhite: '#f5f5f5',
//   lightGrey: '#dcdcdc',
//   darkBlue: '#2D3E4E',
//   red: '#dc3545',
//   fontLightGrey: '#7c7c7c',
// };

export const HeaderStyle = {
  shadowColor: 'transparent',
  elevation: 0,
  borderBottomWidth: 0,
  borderWidth: 0,
  shadowOffset: { height: 0, width: 0 },
};

export const theme = {
  spacing: (unit: number) => unit * SPACING_SIZE,
  pixelsToSpacing: (pixels: number) => pixels / SPACING_SIZE,
  typography,
  colours,
  utils: {
    numbersToPixels: (...units: any[]) => units.map((unit) => (typeof unit === 'number' ? `${unit}px` : unit)).join(' '),
  },
  layout,
};

export type Theme = typeof theme;
