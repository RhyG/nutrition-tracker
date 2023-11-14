import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

import { Text } from '@app/components/Text';

export const ProgressIndicator = ({ progress = 0, colour }: { progress: number; colour: string }) => {
  const strokeWidth = 5;
  const radius = (70 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Prevents overflow issues on massive amounts
  const adjustedProgress = progress > 100 ? 100 : progress;

  // These control the drawing effect of the circle
  const strokeDasharray = `${circumference}, ${circumference}`;
  const strokeDashoffset = circumference - (adjustedProgress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width="70" height="70" viewBox="0 0 70 70">
        {/* Background Circle */}
        <Circle cx="35" cy="35" r={radius} strokeWidth={strokeWidth} stroke="#e0e0e0" fill="none" />
        {/* Progress Circle within a Group (G) tag for rotation */}
        <G rotation="-90" origin="35, 35">
          <Circle
            cx="35"
            cy="35"
            r={radius}
            strokeWidth={strokeWidth}
            stroke={colour}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.labelContainer}>
        <Text size="xs">{`${adjustedProgress}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 70,
  },
  labelContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
  },
});
