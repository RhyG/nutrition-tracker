import { colours } from './colours';
import { layout } from './layout';
import { elements, spacing } from './spacing';
import { timing } from './timing';
import { typography } from './typography';

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
    numbersToPixels: (...units: unknown[]) => units.map(unit => (typeof unit === 'number' ? `${unit}px` : unit)).join(' '),
    spacing: (unit: number) => unit * SPACING_SIZE,
    pixelsToSpacing: (pixels: number) => pixels / SPACING_SIZE,
  },
  layout,
};

export type Theme = typeof theme;
