import { Platform } from 'react-native';
import { DefaultTheme as SCDefaultTheme } from 'styled-components';

const SPACING_SIZE = 5;

export const colours = {
  grey: '#a9a9a9',
  darkGrey: '#2d2d2d',
  green: '#3ECF8E',
  offWhite: '#f5f5f5',
  lightGrey: '#dcdcdc',
  darkBlue: '#2D3E4E',
  red: '#dc3545',
  fontLightGrey: '#7c7c7c',
};

export const HeaderStyle = {
  shadowColor: 'transparent',
  elevation: 0,
  borderBottomWidth: 0,
  borderWidth: 0,
  shadowOffset: { height: 0, width: 0 },
};

export const StyledComponentsFonts = {
  size: {
    xs: '12px',
    sm: '14px',
    md: '15px',
    lg: '17px',
    xl: '19px',
    xxl: '22px',
    xxxl: '30px',
  },
  weight: {
    regular: 400,
    bold: Platform.select({
      default: 600,
      android: 700,
    }),
    extraBold: Platform.select({
      default: 700,
      android: 700,
    }),
  },
};

export const StyledComponentsTheme: SCDefaultTheme = {
  spacing: (...units: number[]) =>
    `${units.map(u => u * SPACING_SIZE).join('px ')}px`,
  pixelsToSpacing: (pixels: number) => pixels / SPACING_SIZE,
  font: StyledComponentsFonts,
  colours,
  utils: {
    numbersToPixels: (...units: any[]) =>
      units
        .map(unit => (typeof unit === 'number' ? `${unit}px` : unit))
        .join(' '),
  },
};
