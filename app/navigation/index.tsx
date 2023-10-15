import { Feather } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colours } from '@theme';
import React, { useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { NewEntryModal } from '@app/components/NewEntryModal/NewEntryModal';
import { CalculatorsScreen } from '@app/screens/Calculators/CalculatorsScreen';
import { FoodLogScreen } from '@app/screens/FoodJournal/FoodLogScreen';
import { GoalsScreen } from '@app/screens/Goals/GoalsScreen';
import { WeeklyOverviewScreen } from '@app/screens/WeeklyOverview/WeeklyOverviewScreen';

import { TabBarLabel } from './TabBarLabel';

type RootStackParamList = {
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

function OpenLogButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ alignItems: 'center', justifyContent: 'center', width: 50 }}>
      <Feather name="plus" size={35} color={colours.palette.neutral700} />
    </TouchableOpacity>
  );
}

export default function AppNavigator() {
  const ref = useRef<BottomSheet>(null);

  const openSheet = () => {
    ref.current?.expand();
  };

  return (
    <>
      <Tab.Navigator screenOptions={{ headerStyle }}>
        <Tab.Screen
          name="Food Log"
          component={FoodLogScreen}
          options={{
            tabBarIcon: () => <Feather name="book-open" size={24} color={colours.palette.neutral700} />,
            tabBarLabel: props => (
              <Text style={{ fontSize: 10, color: props.focused ? colours.palette.neutral700 : colours.palette.neutral500 }}>Food Log</Text>
            ),
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
            tabBarButton: props => <OpenLogButton {...props} onPress={openSheet} />,
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
        {/* <Tab.Screen name="About" component={AboutScreen} /> */}
      </Tab.Navigator>
      <NewEntryModal ref={ref} />
    </>
  );
}
