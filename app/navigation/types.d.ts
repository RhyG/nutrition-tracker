import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';

type RootStackParamList = {
  FoodJournal: undefined;
  Calculators: undefined;
  Goals: undefined;
  WeeklyOverview: undefined;
  About: undefined;
};

type RootStackScreenProps<Name extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, Name>;
  route: RouteProp<RootStackParamList, Name>;
};

interface RootStackScreen<Name extends keyof RootStackParamList, Props = {}>
  extends React.FC<RootStackScreenProps<Name> & Props> {}
