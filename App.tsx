import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

import AppNavigator from './app/navigation';
import { Goals, DefaultGoals, useGoals } from '@app/store/goals';
import { DefaultJournalData, useJournal } from '@app/store/journal';
import AsyncStorage from '@app/modules/AsyncStorage';

// Fetch goals and current data from storage on app mount
(async () => {
  const storedGoals = await AsyncStorage.getItem<Goals>('goals', DefaultGoals);
  useGoals.getState().updateGoals(storedGoals);

  const storedData = await AsyncStorage.getItem<{
    [key in keyof typeof DefaultJournalData]: [];
  }>('journalData', DefaultJournalData);
  useJournal.getState().updateJournal(storedData);
})();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
