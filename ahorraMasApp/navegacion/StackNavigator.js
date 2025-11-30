import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import PantallaRegistro from "../screens/PantallaRegistro";
import TabNavigator from "./TabNavigator"; // <-- Pantalla principal
import RecuperarPassword from "../screens/RecuperarPasswordScreen";
import CambiarPassword from "../screens/CambiarPasswordScreen";

//------------------------Pantallas de Transacciones----------------------------------------------
import PantallaGestionTransacciones from "../screens/PantallaGestionTransacciones";
import ListarTransaccion from "../screens/ListarTransaccion";
import ListarParaEditar from "../screens/ListarParaEditar";
import ListarParaEliminar from "../screens/ListarParaEliminar";
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
import PerfilScreen from "../screens/PerfilScreen"; // <-- NUEVO: pantalla de perfil

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>

            {/* Pantallas fuera del Tab */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registro" component={PantallaRegistro} />

            {/* Recuperación contraseña */}
            <Stack.Screen name="Recuperar" component={RecuperarPassword} />
            <Stack.Screen name="CambiarPassword" component={CambiarPassword} />

            {/* INICIO (Pantalla dentro del Tab) */}
            <Stack.Screen name="Home" component={TabNavigator} />

            {/* Transacciones */}
            <Stack.Screen name="Transacciones" component={PantallaGestionTransacciones} />
            <Stack.Screen name="ListarTransaccion" component={ListarTransaccion} />
            <Stack.Screen name="ListarParaEditar" component={ListarParaEditar} />
            <Stack.Screen name="ListarParaEliminar" component={ListarParaEliminar} />
            <Stack.Screen name="AgregarTransaccion" component={AgregarTransaccion} />
            <Stack.Screen name="EditarTransaccion" component={EditarTransaccion} />
            <Stack.Screen name="EliminarTransaccion" component={EliminarTransaccion} />

            {/* Presupuestos */}
            <Stack.Screen name="Presupuestos" component={PresupuestosScreen} />
            <Stack.Screen name="VerPresupuestos" component={VerPresupuestos} />
            <Stack.Screen name="AgregarPresupuesto" component={AgregarPresupuesto} />
            <Stack.Screen name="EditarPresupuesto" component={EditarPresupuesto} />
            <Stack.Screen name="EliminarPresupuesto" component={EliminarPresupuesto} />

            {/* Gráficas */}
            <Stack.Screen name="Graficas" component={GraficasScreen} />

            {/* Perfil */}
            <Stack.Screen name="Perfil" component={PerfilScreen} />

        </Stack.Navigator>
    );
}
