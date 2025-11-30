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

    const[lista, setLista] = useState([]);
    const[transacciones, setTransacciones] = useState([]);

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

    const eliminarPresupuesto = async (id) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Seguro que quieres eliminar este presupuesto?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await presupuestoController.eliminar(id);
                            setLista((prev) => prev.filter((p) => p.id !== id));
                            Alert.alert("Eliminado", "El presupuesto ha sido eliminado");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar: " + error.message);
                        }
                    },
                },
            ]
        );
    };


    return(
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>

            <Text style={styles.titulo}>ELIMINAR PRESUPUESTO</Text>

            {lista.length === 0 && (
                <Text style={{textAlign: "center", marginTop: 10, color: "#666"}}>
                    No hay registros
                </Text>
            )}
            
            {lista.map(item=>{
                const porcentaje = Math.min(Math.round((item.gastado / item.montolimite)*100), 100);
                return(
                    <TouchableOpacity key={item.id} onPress={()=>navigation.navigate("EditarPresupuesto", {id: item.id})}>
                        <View style={styles.tarjeta}>
                        
                            <View style={styles.fila}>
                                
                                <Text style={[styles.categoria, {color: item.color}]}>
                                    {item.categoria} -- {item.mes} / {item.anio}
                                </Text>

                                <TouchableOpacity
                                    style={styles.botonEliminar}
                                    onPress={() => eliminarPresupuesto(item.id)}
                                >
                                    <Text style={styles.botonEliminarTexto}>Eliminar</Text>
                                </TouchableOpacity>

                                <Text style={styles.cantidad}>
                                    ${item.gastado} / ${item.montolimite}
                                </Text>

                            </View>

                            <View style={styles.progresoBarra}>
                                <View 
                                    style={[styles.llenarProgreso, {width: `${porcentaje}%`, backgroundColor: item.color},]}
                                ></View>
                            </View>

                        <Text style={styles.porcentaje}>{porcentaje}% del usado</Text>

                        </View>
                    </TouchableOpacity>
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
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 25,
        color: "#b71c1c",
    },

    noDatos: {
        textAlign: "center",
        color: "#666",
        marginTop: 10,
    },

    tarjeta: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
    },

    fila: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    categoria: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },

    cantidad: {
        marginTop: 5,
        fontSize: 14,
        color: "#555",
    },

    progresoBarra: {
        height: 10,
        backgroundColor: "#eee",
        borderRadius: 5,
        marginTop: 8,
        overflow: "hidden",
    },

    llenarProgreso: {
        height: "100%",
        borderRadius: 5,
    },

    porcentaje: {
        marginTop: 4,
        textAlign: "right",
        fontSize: 13,
        color: "#444",
    },

    botonEliminar: {
        backgroundColor: "#c62828",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
    },

    botonEliminarTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
    },

    btnContainer: {
        marginTop: 25,
        alignItems: "center",
    },

    volverBoton: {
        backgroundColor: "#999",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        width: "60%",
    },

    volverBotonTexto: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
});