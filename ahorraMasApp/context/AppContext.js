import { createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { PresupuestoController } from "../controllers/PresupuestoController";
import { TransaccionController } from "../controllers/TransaccionController";

export const AppContext = createContext();

const presupuestoController = new PresupuestoController();
const transaccionController = new TransaccionController();

export function AppProvider({children}){

    const [presupuestos, setPresupuestos] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [alertas, setAlertas] = useState([]);
    const [notificados, setNotificados] = useState([]); // Para evitar alertas repetidas

    // Cargar datos al inicio
    async function cargarDatos(){
        await presupuestoController.initialize();
        await transaccionController.initialize();

        const p = await presupuestoController.listar();
        const t = await transaccionController.listar();

        setPresupuestos(p);
        setTransacciones(t);
    }

    // Función que detecta exceso de presupuesto
    function verificarPresupuestos(){
        const nuevasAlertas = [];

        presupuestos.forEach((pres) => {

            const gastado = transacciones
                .filter(t => t.tipo === "Gasto" && t.categoria.toLowerCase() === pres.categoria.toLowerCase())
                .reduce((sum, t) => sum + Number(t.monto), 0);

            if(gastado > pres.montolimite){

                const mensaje = `! Presupuesto excedido en: ${pres.categoria}`;

                // Mostrar ALERT solo si no se ha notificado antes
                if(!notificados.includes(pres.categoria)){
                    Alert.alert("!! PRESUPUESTO EXCEDIDO !!", mensaje);

                    setNotificados(prev => [...prev, pres.categoria]);
                }

                nuevasAlertas.push(mensaje);
            }
        });

        setAlertas(nuevasAlertas);
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    // Ejecutar verificación cuando cambian transacciones o presupuestos
    useEffect(() => {
        if(presupuestos.length > 0 && transacciones.length > 0){
            verificarPresupuestos();
        }
    }, [transacciones, presupuestos]);

    return (
        <AppContext.Provider 
            value={{
                presupuestos, setPresupuestos,
                transacciones, setTransacciones,
                alertas
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
