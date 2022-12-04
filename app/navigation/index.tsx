import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

// import { AboutScreen } from '@app/screens/About/AboutScreen';
import { AboutScreen } from '@app/screens/About/AboutScreen';
import { CalculatorsScreen } from '@app/screens/Calculators/CalculatorsScreen';
import { WeeklyOverviewScreen } from '@app/screens/WeeklyOverview/WeeklyOverviewScreen';
import { GoalsScreen } from '@app/screens/Goals/GoalsScreen';
// import { FoodJournalScreen } from '@features/food-journal';

// import { HeaderStyle as headerStyle, colours } from '@app/theme';
import { BurgerMenu } from '@components/BurgerMenu';
import { CustomDrawer } from '@components/CustomDrawer/CustomDrawer';
import { colours, HeaderStyle as headerStyle } from '@theme';

const Drawer = createDrawerNavigator();

const AppNavigator = (): JSX.Element => {
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
      {/* <Drawer.Screen name="Food Journal" component={FoodJournalScreen} />*/}
      <Drawer.Screen name="Goals" component={GoalsScreen} />
      <Drawer.Screen name="Weekly Overview" component={WeeklyOverviewScreen} />
      <Drawer.Screen name="Calculators" component={CalculatorsScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
    </Drawer.Navigator>
  );
};

export default AppNavigator;
