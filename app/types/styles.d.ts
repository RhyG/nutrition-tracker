// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colours: Record<string, unknown>;
    spacing: (...units: number[]) => string;
    pixelsToSpacing: (pixels: number) => number;
    font: {
      size: { [key in FontSize]: string };
      weight: { [key in 'regular' | 'bold' | 'extraBold']: number };
    };
    utils: {
      numbersToPixels: (...units: number[]) => string;
    };
  }
}

type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
