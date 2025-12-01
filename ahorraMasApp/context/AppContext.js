import { createContext, useState, useEffect, useContext } from "react";
import { initDB, getDB, addChangeListener } from "../src/db";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext();

export function AppProvider({children}){
    const[presupuestos, setPresupuestos] = useState([
        {id: 1, categoria: "Comida", limite: 500},
        {id: 2, categoria: "Transporte", limite: 300}
    ]);

    const[transacciones, setTransacciones] = useState([]);

    const[alertas, setAlertas] = useState([]);

    //Funcion que revisa si se excedió el presupuesto
    function verificarPresupuestos(){
        const nuevasAlertas = [];

        presupuestos.forEach((pres) => {
            const totalGastado = transacciones
                .filter(t => t.tipo === "Gasto" && t.categoria === pres.categoria)
                .reduce((sum, t) => sum + Number(t.monto), 0);

            if(totalGastado > pres.limite){
                nuevasAlertas.push(`Presupuesto excedido: ${pres.categoria}`);
            }
        });

        setAlertas(nuevasAlertas);
    }

    const { usuario } = useContext(AuthContext);

    // Cargar transacciones y presupuestos desde la BD cuando cambie el usuario o la BD notifique cambios
    useEffect(() => {
        let unsub = null;

        async function cargarDesdeDB() {
            try {
                const db = await initDB();
                if (!db) return;

                if (!usuario || !usuario.id) {
                    setTransacciones([]);
                    setPresupuestos([]);
                    return;
                }

                const [filasTrans] = await Promise.all([
                    db.getAllAsync(
                        "SELECT * FROM transacciones WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY fecha DESC",
                        [usuario.id]
                    ),
                    db.getAllAsync(
                        "SELECT * FROM presupuestos WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY fecha DESC",
                        [usuario.id]
                    )
                ].slice(0,1));

                // Above Promise.all used to keep compatibility; call separately to ensure results
                const filasTransacciones = await db.getAllAsync(
                    "SELECT * FROM transacciones WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY fecha DESC",
                    [usuario.id]
                );
                const filasPresupuestos = await db.getAllAsync(
                    "SELECT * FROM presupuestos WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY fecha DESC",
                    [usuario.id]
                );

                setTransacciones(filasTransacciones || []);
                setPresupuestos(filasPresupuestos || []);
            } catch (err) {
                console.log('Error cargando transacciones/presupuestos desde DB:', err);
                setTransacciones([]);
                setPresupuestos([]);
            }
        }

        cargarDesdeDB();

        // Suscribir a cambios globales en la BD
        unsub = addChangeListener(() => {
            cargarDesdeDB();
        });

        return () => {
            if (unsub) unsub();
        };
    }, [usuario]);

    //Se verifica cada vez que cambien las transacciones o presupuestos
    useEffect(()=>{
        verificarPresupuestos();
    }, [transacciones, presupuestos]);

    return(
        <AppContext.Provider value={{
            presupuestos, setPresupuestos,
            transacciones, setTransacciones,
            alertas
        }}
        >
            {children}
        </AppContext.Provider>
    );
}