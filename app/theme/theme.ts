import { Platform } from 'react-native';

import { colours } from './colours';
import { layout } from './layout';
import { typography } from './typography';
import { timing } from './timing';
import { spacing, elements } from './spacing';

const SPACING_SIZE = 5;

export const theme = {
  spacing: {
    ...spacing,
    ...elements,
  },
  typography,
  colours,
  timing,
  utils: {
    numbersToPixels: (...units: any[]) => units.map((unit) => (typeof unit === 'number' ? `${unit}px` : unit)).join(' '),
    spacing: (unit: number) => unit * SPACING_SIZE,
    pixelsToSpacing: (pixels: number) => pixels / SPACING_SIZE,
  },
  layout,
};

export type Theme = typeof theme;
