// import original module declarations
import 'styled-components';

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colours: Record<string, any>;
    spacing: (...units: number[]) => string;
    pixelsToSpacing: (pixels: number) => number;
    font: {
      size: { [key in FontSize]: string };
      weight: { [key in 'regular' | 'bold' | 'extraBold']: number };
    };
    utils: {
      numbersToPixels: (...units: any[]) => string;
    };
  }
}

type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
