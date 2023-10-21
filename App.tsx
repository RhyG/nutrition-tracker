import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AsyncStorage from '@app/modules/AsyncStorage';
import { DefaultGoals, Goals, useGoalsStore } from '@app/store/goals';
import { DefaultJournalData, useJournalStore } from '@app/store/journal';

import AppNavigator from './app/navigation';

// Fetch goals and current data from storage on app mount
(async () => {
  const storedGoals = await AsyncStorage.getItem<Goals>('goals', DefaultGoals);
  useGoalsStore.getState().updateGoals(storedGoals);

  const storedData = await AsyncStorage.getItem<{
    [key in keyof typeof DefaultJournalData]: [];
  }>('journalData', DefaultJournalData);
  useJournalStore.getState().updateJournal(storedData);
})();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <MenuProvider>
            <AppNavigator />
          </MenuProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
