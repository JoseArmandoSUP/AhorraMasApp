import React, {useState, useEffect, useCallback} from "react";
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ProgressBarAndroid, Platform, 
    ProgressViewIOS, TextInput} from 'react-native'
//import { ProgressBar } from "react-native-web";
//import PantallaPrincipal from "./PantallaPrincipal";
import { Button } from "react-native";
//import VerPresupuestos from "./VerPresupuestos";
//import AgregarPresupuesto from "./AgregarPresupuesto";
//import EditarPresupuesto from "./EditarPresupuesto";
//import EliminarPresupuesto from "./EliminarPresupuesto";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PresupuestoController } from "../controllers/PresupuestoController";
import { TransaccionController } from "../controllers/TransaccionController";

const presupuestoController = new PresupuestoController();
const transaccionController = new TransaccionController();

export default function PresupuestosScreen(){
    
    const navigation = useNavigation();
    
    //Función para mostrar barra de progreso


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

    return(
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
            
            <Text style={styles.titulo}>PRESUPUESTO</Text>

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
                                {item.categoria} -- {item.mes} / {item.anio}
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

            {/*BOTONES DEL CRUD*/}
            <View style={styles.crudContainer}>
                
                <TouchableOpacity style={styles.crudBoton} onPress={()=>navigation.navigate("VerPresupuestos")}>
                    {/*<Ionicons>*/}
                    <Text style={styles.crudTexto}>Ver Presupuestos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.crudBoton} onPress={()=>navigation.navigate("AgregarPresupuesto")}>
                    {/*<Ionicons>*/}
                    <Text style={styles.crudTexto}>Agregar Presupuesto</Text>
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.crudBoton} onPress={()=>navigation.navigate("EditarPresupuesto")}>
                    <Ionicons>
                    <Text style={styles.crudTexto}>Editar Presupuesto</Text>
                </TouchableOpacity>*/}

                <TouchableOpacity style={styles.crudBoton} onPress={()=>navigation.navigate("EliminarPresupuesto")}>
                    {/*<Ionicons></Ionicons>*/}
                    <Text style={styles.crudTexto}>Eliminar Presupuesto</Text>
                </TouchableOpacity>

    
                <TouchableOpacity style={styles.volverBoton} onPress={()=> navigation.navigate("Home")}>
                    <Text style={styles.volverBotonTexto}>Volver al menú</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 70,
        paddingHorizontal: 20,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1b5e20',
        textAlign: 'center',
        marginBottom: 25,
    },

    card:{
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    cabezaCard:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    iconoContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    categoria:{
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 5,
    },

    cantidad:{
        fontSize: 14,
        color: '#555',
    },

    porcentajes:{
        textAlign: 'right',
        fontSize: 13,
        color: '#555',
        marginTop: 5,
    },

    crudContainer:{
        marginTop: 20,
    },

    crudBoton:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    crudTexto:{
        margin: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
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
});