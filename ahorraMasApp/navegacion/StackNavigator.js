import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import PantallaRegistro from "../screens/PantallaRegistro";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

export default function StackNavigator(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            
            {/* Pantallas fuera del Tab */}
            <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
            <Stack.Screen name="Registro" component={PantallaRegistro}></Stack.Screen>

            {/* Pantallas dentro del Tab */}
            <Stack.Screen name="Home" component={TabNavigator}></Stack.Screen>

        </Stack.Navigator>
    );
}