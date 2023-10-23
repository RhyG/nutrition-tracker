import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export const ProgressIndicator = ({ progress = 0 }) => {
  const strokeWidth = 5;
  const radius = (80 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // These control the drawing effect of the circle
  const strokeDasharray = `${circumference}, ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width="80" height="80" viewBox="0 0 80 80">
        {/* Background Circle */}
        <Circle cx="40" cy="40" r={radius} strokeWidth={strokeWidth} stroke="#e0e0e0" fill="none" />
        {/* Progress Circle within a Group (G) tag for rotation */}
        <G rotation="-90" origin="40, 40">
          <Circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#3498db"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{`${progress}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    position: 'relative',
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
