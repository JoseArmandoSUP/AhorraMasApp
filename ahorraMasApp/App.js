import StackNavigator from './navegacion/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './context/AppContext';
import {AuthProvider} from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <NavigationContainer>
          <StackNavigator></StackNavigator>
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}