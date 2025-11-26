import StackNavigator from './navegacion/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './context/AppContext';

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <StackNavigator></StackNavigator>
      </NavigationContainer>
    </AppProvider>
  );
}