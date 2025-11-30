import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState, useEffect, useCallback} from "react";
//import PresupuestosScreen from "./PresupuestosScreen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PresupuestoController } from "../controllers/PresupuestoController";
import { TransaccionController } from "../controllers/TransaccionController";

const presupuestoController = new PresupuestoController();
const transaccionController = new TransaccionController();

export default function VerPresupuestos(){
    const navigation = useNavigation();

    {/*const presupuestos = [
        {id: 1, categoria: "Comida", limite: 500, gastado: 320, color: "#2e7d32"},
        {id: 2, categoria: "Transporte", limite: 300, gastado: 200, color: "#1565c0"},
        {id: 3, categoria: "Entretenimiento", limite: 400, gastado: 150, color: "#fbc02d"},
        {id: 4, categoria: "Salud", limite: 350, gastado: 280, color: "#d32f2f"},
    ]; */}

    const[lista, setLista] = useState([]);
    const[transacciones, setTransacciones] = useState([]);

    const [fMes, setFMes] = useState("");
    const [fAnio, setFAnio] = useState("");
    const [fCategoria, setFCategoria] = useState("");


    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                try{
                    await presupuestoController.initialize();
                    await transaccionController.initialize();

                    const presupuestosDB = await presupuestoController.listar();
                    const transDB = await transaccionController.listar();

                    setTransacciones(transDB);

                    //Total gastado en cada presupuesto
                    const calculados = presupuestosDB.map(p => {
                        const gastado = transDB.filter(
                            t => t.tipo === "Gasto" && t.categoria.toLowerCase() === p.categoria.toLowerCase()
                        )
                        .reduce((sum, t) => sum + Number(t.monto), 0);
                        return{
                            ...p,
                            gastado,
                            color: "#2e7d32"
                        };
                    });

                    setLista(calculados)
                }catch(error){
                    console.log("Error cargando presupuestos: ", error);
                }
            };
            cargarDatos();
        },[])
    );

    async function aplicarFiltro() {
        try {
            await presupuestoController.initialize();
            await transaccionController.initialize();

            let presupuestosDB = await presupuestoController.listar();

            
            if (fMes.trim() !== "") {
                presupuestosDB = presupuestosDB.filter(p => p.mes == Number(fMes));
            }

            
            if (fAnio.trim() !== "") {
                presupuestosDB = presupuestosDB.filter(p => p.anio == Number(fAnio));
            }

            
            if (fCategoria.trim() !== "") {
                presupuestosDB = presupuestosDB.filter(p => 
                    p.categoria.toLowerCase().includes(fCategoria.toLowerCase())
                );
            }

            
            const transDB = await transaccionController.listar();

            const calculados = presupuestosDB.map(p => {
                const gastado = transDB.filter(
                    t => 
                        t.tipo === "Gasto" && 
                        t.categoria.toLowerCase() === p.categoria.toLowerCase()
                )
                .reduce((sum, t) => sum + Number(t.monto), 0);

                return {
                    ...p,
                    gastado,
                    color: "#2e7d32"
                };
            });

            setLista(calculados);

        } catch (error) {
            console.log("Error al aplicar filtros:", error);
        }
    }

    //Quitar los filtros 
    const limpiarFiltros = async () => {
        try{
            setFMes("");
            setFAnio("");
            setFCategoria("");
            const calculados = await presupuestoController.listar();
            setLista(calculados);
        }catch(error){
            Alert.alert("Error", error.message);
        }
    };


    return(
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>

            <Text style={styles.titulo}>LISTA DE PRESUPUESTOS</Text>

            {/*FILTRADO*/}
            <View style={styles.filtrosContainer}>
                <Text style={styles.filtrosTitulo}>Filtrar por</Text>
    
                <View style={styles.filtrosFila}>
                    <Text style={styles.filtrosLabel}>Mes:</Text>
                    <View style={styles.filtrosInput}>
                        <TextInput 
                            style={styles.filtrosPlaceHolder} 
                            placeholder="1 - 12"
                            keyboardType="numeric"
                            value={fMes}
                            onChangeText={setFMes}
                        />
                    </View>
                </View>

                <View style={styles.filtrosFila}>
                    <Text style={styles.filtrosLabel}>Año:</Text>
                    <View style={styles.filtrosInput}>
                        <TextInput 
                            style={styles.filtrosPlaceHolder} 
                            placeholder="2025"
                            keyboardType="numeric"
                            value={fAnio}
                            onChangeText={setFAnio}
                        />
                    </View>
                </View>
    
                <View style={styles.filtrosFila}>
                    <Text style={styles.filtrosLabel}>Categoría:</Text>
                    <View style={styles.filtrosInput}>
                        <TextInput 
                            style={styles.filtrosPlaceHolder} 
                            placeholder="Ej. Comida"
                            value={fCategoria}
                            onChangeText={setFCategoria}
                        />
                    </View>
                </View>
    
                <TouchableOpacity style={styles.filtrosBoton} onPress={aplicarFiltro}>
                    <Text style={styles.filtrosBotonTexto}>Aplicar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.filtrosBoton, {backgroundColor:"#555"}]} onPress={limpiarFiltros}>
                    <Text style={styles.filtrosBotonTexto}>Deshacer Filtro</Text>
                </TouchableOpacity>
    
            </View>

            {lista.length === 0 && (
                <Text style={{textAlign: "center", marginTop: 10, color: "#666"}}>
                    No hay registros
                </Text>
            )}
            
            {lista.map(item=>{
                const porcentaje = Math.min(Math.round((item.gastado / item.montolimite)*100), 100);
                return(
                    <View key={item.id} style={styles.tarjeta}>
                        
                        <View style={styles.fila}>
                            
                            <Text style={[styles.categoria, {color: item.color}]}>
                                {item.categoria}
                            </Text>

                            <Text style={styles.cantidad}>
                                ${item.gastado} / ${item.montolimite}
                            </Text>

                        </View>

                        <View style={styles.progresoBarra}>
                            <View 
                                style={[styles.llenarProgreso, {width: `${porcentaje}%`, backgroundColor: item.color},]}
                            ></View>
                        </View>

                        <Text style={styles.porcentaje}>{porcentaje}% del presupuesto usado</Text>

                    </View>
                );
            })}

            <View style={styles.btnContainer}>

                <TouchableOpacity style={styles.volverBoton} onPress={()=>navigation.goBack()}>
                    <Text style={styles.volverBotonTexto}>Volver al menú de Presupuestos</Text> 
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1, 
        backgroundColor: "#F9FAFB",
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: "#1b5e20",
        textAlign: 'center',
        marginBottom: 20,
    },

    //Estilos del filtardo
    filtrosContainer:{
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    filtrosTitulo:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e6d7dff',
        textAlign: 'center',
        marginBottom: 10,
    },

    filtrosFila:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    filtrosLabel:{
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        width: '40%',
    },

    filtrosInput:{
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        width: '55%',
    },

    filtrosPlaceHolder:{
        color: '#999',
        fontSize: 14,
    },

    filtrosBoton:{
        backgroundColor: '#2e6d7dff',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    filtrosBotonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    //-----------------------------------------------

    tarjeta:{
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,   
    },

    fila:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    categoria:{
        fontSize: 16,
        fontWeight: "600",
    },

    cantidad:{
        fontSize: 14,
        color: "#555",
    },

    progresoBarra:{
        height: 10,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 4,   
    },

    llenarProgreso:{
        height: '100%',
        borderRadius: 5,
    },

    porcentaje:{
        fontSize: 13,
        color: "#444",
        textAlign: "right",
        marginTop: 5,
    },

    btnContainer:{
        marginTop: 25,
    },

    volverBoton:{
        backgroundColor: '#2e7d32',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    volverBotonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});