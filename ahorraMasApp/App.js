import StackNavigator from './navegacion/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './context/AppContext';
import{AuthProvider} from './context/AuthContext';
import React, {  useEffect } from "react";
import { initDB } from "./src/db";

export default function App() {

useEffect(() => {
    initDB(); 
  }, []);

  return (
     <AuthProvider>          
      <AppProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AppProvider>
    </AuthProvider>
  );
}