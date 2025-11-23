import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import PantallaRegistro from "../screens/PantallaRegistro";
import TabNavigator from "./TabNavigator"; // <-- Pantalla principal

//------------------------Pantallas de Transacciones----------------------------------------------
import PantallaGestionTransacciones from "../screens/PantallaGestionTransacciones";
import ListarTransaccion from "../screens/ListarTransaccion";
import AgregarTransaccion from "../screens/AgregarTransaccion";
import EditarTransaccion from "../screens/EditarTransaccion";
import EliminarTransaccion from "../screens/EliminarTransaccion";
//------------------------------------------------------------------------------------------------

//-------------------------Pantallas de Presupuestos-----------------------------------------------
import PresupuestosScreen from "../screens/PresupuestosScreen";
import VerPresupuestos from "../screens/VerPresupuestos";
import AgregarPresupuesto from "../screens/AgregarPresupuesto";
import EditarPresupuesto from "../screens/EditarPresupuesto";
import EliminarPresupuesto from "../screens/EliminarPresupuesto";
//-------------------------------------------------------------------------------------------------
import GraficasScreen from "../screens/GraficasScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            
            {/* Pantallas fuera del Tab */}
            <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
            <Stack.Screen name="Registro" component={PantallaRegistro}></Stack.Screen>

            {/* INICIO (Pantalla dentro del Tab) */}
            <Stack.Screen name="Home" component={TabNavigator}></Stack.Screen>

            {/* Transacciones (agregado 3:23)*/}
            <Stack.Screen name="Transacciones" component={PantallaGestionTransacciones}></Stack.Screen>
            <Stack.Screen name="ListarTransaccion" component={ListarTransaccion}></Stack.Screen>
            <Stack.Screen name="AgregarTransaccion" component={AgregarTransaccion}></Stack.Screen>
            <Stack.Screen name="EditarTransaccion" component={EditarTransaccion}></Stack.Screen>
            <Stack.Screen name="EliminarTransaccion" component={EliminarTransaccion}></Stack.Screen>
            
            {/* Presupuestos (agregado 5:43)*/}
            <Stack.Screen name="Presupuestos" component={PresupuestosScreen}></Stack.Screen>
            <Stack.Screen name="VerPresupuestos" component={VerPresupuestos}></Stack.Screen>
            <Stack.Screen name="AgregarPresupuesto" component={AgregarPresupuesto}></Stack.Screen>
            <Stack.Screen name="EditarPresupuesto" component={EditarPresupuesto}></Stack.Screen>
            <Stack.Screen name="EliminarPresupuesto" component={EliminarPresupuesto}></Stack.Screen>

            <Stack.Screen name="Graficas" component={GraficasScreen}></Stack.Screen>
            {/* <Stack.Screen name="Perfil" component={PerfilScreen}></Stack.Screen> */}

        </Stack.Navigator>
    );
}