import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';

import AppNavigator from './app/navigation';

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
