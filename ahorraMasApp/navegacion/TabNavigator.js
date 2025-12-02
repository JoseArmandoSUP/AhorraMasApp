import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PantallaPrincipal from "../screens/PantallaPrincipal";
import PantallaGestionTransacciones from "../screens/PantallaGestionTransacciones";
import PresupuestosScreen from "../screens/PresupuestosScreen";
import GraficasScreen from "../screens/GraficasScreen";
import Perfil from "../screens/Perfil";
import {Ionicons} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigator(){
    return(
        <Tab.Navigator screenOptions={({route}) => ({
            headerShown: false,
            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                if(route.name === "Inicio"){
                    iconName = focused ? "home" : "home-outline";
                }else if (route.name === 'Transacciones') {
                    iconName = focused ? 'list' : 'list-outline';
                } else if (route.name === 'Presupuestos') {
                    iconName = focused ? 'wallet' : 'wallet-outline';
                } else if (route.name === 'Reportes') {
                    iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                } else if (route.name === 'Perfil') {
                    iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size ?? 24} color={color} />;
            },
            tabBarActiveTintColor: "#2e7d32",
            tabBarInactiveTintColor: "gray",
        })}
        >
            <Tab.Screen name="Inicio" component={PantallaPrincipal}></Tab.Screen>
            <Tab.Screen name="Transacciones" component={PantallaGestionTransacciones}></Tab.Screen>
            <Tab.Screen name="Presupuestos" component={PresupuestosScreen}></Tab.Screen>
            <Tab.Screen name="Reportes" component={GraficasScreen}></Tab.Screen>
            <Tab.Screen name="Perfil" component={Perfil}></Tab.Screen>
        </Tab.Navigator>
    );
}