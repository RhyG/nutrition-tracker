import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { Text } from '../../components/Text';
import { RootStackScreen } from '../../navigation/types';

export const AboutScreen: RootStackScreen<'About'> = () => {
  return (
    <ScrollView style={styles.container}>
      <Text>
        Nutrition Tracker is a dead simple, day to day macro tracking app. It allows you to enter what you ate, set daily calorie and protein goals, and get an
        overview of how you are going on a weekly basis. That's about it really, plus a few handly little calculators.
      </Text>
      <Text style={styles.text}>
        I'm a firm believer that the vast majority of people only need to track calories and protein. Calories because that is how you regulate weight, and
        protein because that ensures you build and maintain muscle. If you eat a well balanced and mostly healthy diet, the other macros will fall into place.
      </Text>
      <Text style={styles.text}>
        Over-complicating things is how a lot of people end up spinning their wheels and never achieving their diet goals, so keeping it as simple as humanly
        possible is in my opinion the ticket to success.
      </Text>
      <Text style={styles.text}>
        As someone who has been tracking macros for a long time, most of the existing apps were much more involved and complicated than I needed. I didn't want
        to have to hand over a bunch of personal details, didn't care for graphs and long term plotting. I know for the most part what the macros are in what I
        eat, and I didn't need a massive database of foods. So I built what I was after.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  text: {
    marginTop: 5,
  },
});
