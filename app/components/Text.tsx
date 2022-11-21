import React from "react";
import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle, useColorScheme } from "react-native";
import { colours, typography } from "../config/theme";

type Sizes = keyof typeof sizeStyles;
type Weights = keyof typeof typography.weights;
type Presets = keyof typeof presets;

export interface TextProps extends RNTextProps {
  /**
   * Text to render.
   */
  text?: string;
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<TextStyle>;
  /**
   * One of the different types of text presets.
   */
  preset?: Presets;
  /**
   * Text weight modifier.
   */
  weight?: Weights;
  /**
   * Text size modifier.
   */
  size?: Sizes;
  /**
   * Child components - this allows either a string or nested components.
   */
  children?: React.ReactNode;
}

export function Text(props: TextProps) {
  const { weight, size, text, children, style: styleOverride, ...rest } = props;

  // Prioritise the `text` prop.
  const content = text || children;

  const preset: Presets = props.preset ?? "default";
  const styles = [presets[preset], fontWeightStyles[weight ?? "semiLight"], sizeStyles[size ?? "sm"], styleOverride];

  return (
    <RNText {...rest} style={styles}>
      {content}
    </RNText>
  );
}

const sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } as TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } as TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } as TextStyle,
  md: { fontSize: 18, lineHeight: 26 } as TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } as TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } as TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } as TextStyle,
};

const fontWeightStyles = Object.entries(typography.weights).reduce((acc, [typeWeight, weight]) => {
  return { ...acc, [typeWeight]: { weight } };
}, {}) as Record<Weights, TextStyle>;

const baseStyle: StyleProp<TextStyle> = [sizeStyles.sm, fontWeightStyles.medium, { color: colours.text }];

const presets = {
  default: baseStyle,
  bold: [baseStyle, fontWeightStyles.bold] as StyleProp<TextStyle>,
  heading: [baseStyle, sizeStyles.xxl, fontWeightStyles.bold] as StyleProp<TextStyle>,
  subheading: [baseStyle, sizeStyles.lg, fontWeightStyles.medium] as StyleProp<TextStyle>,
  formLabel: [baseStyle, fontWeightStyles.medium] as StyleProp<TextStyle>,
  formHelper: [baseStyle, sizeStyles.sm, fontWeightStyles.medium] as StyleProp<TextStyle>,
};