import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colours } from '@theme';
import React from 'react';

import { Modal } from '@app/components/modals/Modal';
import { CalculatorsScreen } from '@app/screens/Calculators/CalculatorsScreen';
import { FoodLogScreen } from '@app/screens/FoodLog/FoodLogScreen';
import { GoalsScreen } from '@app/screens/Goals/GoalsScreen';
import { WeeklyOverviewScreen } from '@app/screens/WeeklyOverview/WeeklyOverviewScreen';
import { ModalNames, useModalStore } from '@app/store/modal';

import { OpenLogButton } from './OpenLogButton';
import { TabBarLabel } from './TabBarLabel';

export type RootStackParamList = {
  'Food Log': undefined;
  Calculators: undefined;
  Goals: undefined;
  Overview: undefined;
  About: undefined;
  NewEntryModal: undefined;
};

type RootStackScreenProps<Name extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, Name>;
  route: RouteProp<RootStackParamList, Name>;
};

export interface RootStackScreen<Name extends keyof RootStackParamList, Props = Record<string, unknown>> extends React.FC<RootStackScreenProps<Name> & Props> {}

const headerStyle = {
  shadowColor: 'transparent',
  elevation: 0,
  borderBottomWidth: 0,
  borderWidth: 0,
  shadowOffset: { height: 0, width: 0 },
};

const Tab = createBottomTabNavigator<RootStackParamList>();

function EmptyScreen() {
  return null;
}

export default function AppNavigator() {
  const setActiveModal = useModalStore(state => state.setActiveModal);

  return (
    <>
      <Tab.Navigator screenOptions={{ headerStyle }}>
        <Tab.Screen
          name="Food Log"
          component={FoodLogScreen}
          options={{
            tabBarIcon: () => <Feather name="book-open" size={24} color={colours.palette.neutral700} />,
            tabBarLabel: props => <TabBarLabel label="Food Log" {...props} />,
          }}
        />
        <Tab.Screen
          name="Goals"
          component={GoalsScreen}
          options={{
            tabBarIcon: () => <Feather name="compass" size={24} color={colours.palette.neutral700} />,
            tabBarLabel: props => <TabBarLabel label="Goals" {...props} />,
          }}
        />
        <Tab.Screen
          name="NewEntryModal"
          component={EmptyScreen}
          options={{
            tabBarButton: props => <OpenLogButton {...props} onPress={() => setActiveModal({ name: ModalNames.NEW_ENTRY })} />,
            tabBarLabel: () => null,
          }}
        />
        <Tab.Screen
          name="Overview"
          component={WeeklyOverviewScreen}
          options={{
            tabBarIcon: () => <Feather name="calendar" size={24} color={colours.palette.neutral700} />,
            tabBarLabel: props => <TabBarLabel label="Overview" {...props} />,
          }}
        />
        <Tab.Screen
          name="Calculators"
          component={CalculatorsScreen}
          options={{
            tabBarIcon: () => <Feather name="divide-circle" size={24} color={colours.palette.neutral700} />,
            tabBarLabel: props => <TabBarLabel label="Calculators" {...props} />,
          }}
        />
      </Tab.Navigator>
      <Modal />
    </>
  );
}
