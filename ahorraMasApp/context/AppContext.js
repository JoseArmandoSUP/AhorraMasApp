import { createContext, useState, useEffect } from "react";

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