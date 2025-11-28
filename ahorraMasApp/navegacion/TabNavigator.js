import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PantallaPrincipal from "../screens/PantallaPrincipal";
//import PantallaRegistro from "../screens/PantallaRegistro";
//import LoginScreen from "../screens/LoginScreen";
import GraficasScreen from "../screens/GraficasScreen";
import Perfil from "../screens/Perfil";

const Tab = createBottomTabNavigator();

export default function TabNavigator(){
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Inicio" component={PantallaPrincipal}></Tab.Screen>
            <Tab.Screen name="Graficas" component={GraficasScreen}></Tab.Screen>
            <Tab.Screen name="Perfil" component={Perfil}></Tab.Screen>
            {/*<Tab.Screen name="Registrarse" component={PantallaRegistro}></Tab.Screen>
            <Tab.Screen name="Iniciar Sesion" component={LoginScreen}></Tab.Screen>*/}
        </Tab.Navigator>
    );
}