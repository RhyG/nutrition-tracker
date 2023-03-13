import { Platform } from 'react-native';

import { colours } from './colours';
import { layout } from './layout';
import { typography } from './typography';
import { spacing, elements } from './spacing';

const SPACING_SIZE = 5;

export const HeaderStyle = {
  shadowColor: 'transparent',
  elevation: 0,
  borderBottomWidth: 0,
  borderWidth: 0,
  shadowOffset: { height: 0, width: 0 },
};

export const theme = {
  spacing: {
    ...spacing,
    ...elements,
  },
  typography,
  colours,
  utils: {
    numbersToPixels: (...units: any[]) => units.map((unit) => (typeof unit === 'number' ? `${unit}px` : unit)).join(' '),
    spacing: (unit: number) => unit * SPACING_SIZE,
    pixelsToSpacing: (pixels: number) => pixels / SPACING_SIZE,
  },
  layout,
};

export type Theme = typeof theme;
