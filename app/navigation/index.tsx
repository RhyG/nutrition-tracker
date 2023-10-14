import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { Button, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// import { AboutScreen } from '@app/screens/About/AboutScreen';
import { AboutScreen } from '@app/screens/About/AboutScreen';
import { CalculatorsScreen } from '@app/screens/Calculators/CalculatorsScreen';
import { WeeklyOverviewScreen } from '@app/screens/WeeklyOverview/WeeklyOverviewScreen';
import { GoalsScreen } from '@app/screens/Goals/GoalsScreen';
import { FoodJournalScreen } from '@app/screens/FoodJournal/FoodJournalScreen';
import { FoodLogScreen } from '@app/screens/FoodJournal/FoodLogScreen';

// import { HeaderStyle as headerStyle, colours } from '@app/theme';
import { BurgerMenu } from '@components/BurgerMenu';
import { CustomDrawer } from '@components/CustomDrawer/CustomDrawer';
import { colours } from '@theme';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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

export interface RootStackScreen<Name extends keyof RootStackParamList, Props = {}> extends React.FC<RootStackScreenProps<Name> & Props> {}

export const headerStyle = {
  shadowColor: 'transparent',
  elevation: 0,
  borderBottomWidth: 0,
  borderWidth: 0,
  shadowOffset: { height: 0, width: 0 },
};

const Drawer = createDrawerNavigator();

const _AppNavigator = (): JSX.Element => {
  // const { colours } = useTheme();

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Food Journal"
      drawerContent={CustomDrawer}
      useLegacyImplementation={true}
      screenOptions={{
        headerStyle,
        headerLeft: BurgerMenu,
        headerTitleAlign: 'center',
        drawerItemStyle: { width: '100%', marginLeft: 0 },
        drawerActiveBackgroundColor: '#2C3949',
        drawerLabelStyle: {
          color: '#fff',
          fontSize: 16,
          width: '100%',
          paddingLeft: 20,
        },
        drawerContentStyle: {
          backgroundColor: colours.palette.darkBlue,
        },
        overlayColor: 'transparent',
      }}>
      {/* <Drawer.Screen name="Food Journal" component={FoodJournalScreenV2} /> */}
      <Drawer.Screen name="Goals" component={GoalsScreen} />
      {/* <Drawer.Screen name="Weekly Overview" component={WeeklyOverviewScreen} /> */}
      <Drawer.Screen name="Calculators" component={CalculatorsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
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
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <Tab.Navigator screenOptions={{ headerStyle }}>
      <Tab.Screen
        name="Food Log"
        component={FoodLogScreen}
        options={{
          tabBarIcon: () => <Feather name="book-open" size={24} color={colours.palette.neutral700} />,
          tabBarLabel: (props) => (
            <Text style={{ fontSize: 10, color: props.focused ? colours.palette.neutral700 : colours.palette.neutral500 }}>Food Log</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          tabBarIcon: () => <Feather name="compass" size={24} color={colours.palette.neutral700} />,
          tabBarLabel: (props) => <Text style={{ fontSize: 10, color: props.focused ? colours.palette.neutral700 : colours.palette.neutral500 }}>Goals</Text>,
        }}
      />
      <Tab.Screen
        name="NewEntryModal"
        component={EmptyScreen}
        options={{
          tabBarButton: (props) => <OpenLogButton {...props} onPress={() => setModalVisible(true)} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Overview"
        component={WeeklyOverviewScreen}
        options={{
          tabBarIcon: () => <Feather name="calendar" size={24} color={colours.palette.neutral700} />,
          tabBarLabel: (props) => (
            <Text style={{ fontSize: 10, color: props.focused ? colours.palette.neutral700 : colours.palette.neutral500 }}>Overview</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Calculators"
        component={CalculatorsScreen}
        options={{
          tabBarIcon: () => <Feather name="divide-circle" size={24} color={colours.palette.neutral700} />,
          tabBarLabel: (props) => (
            <Text style={{ fontSize: 10, color: props.focused ? colours.palette.neutral700 : colours.palette.neutral500 }}>Calculators</Text>
          ),
        }}
      />
      {/* <Tab.Screen name="About" component={AboutScreen} /> */}
    </Tab.Navigator>
  );
}
