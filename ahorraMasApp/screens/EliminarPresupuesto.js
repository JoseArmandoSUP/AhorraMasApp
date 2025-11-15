import { Text, View, ScrollView, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, {useState} from "react";
import PresupuestosScreen from "./PresupuestosScreen";

export default function EliminarPresupuesto(){
    const[screen, setScreen] = useState("menu");

    const presupuestos = [
        {id: 1, categoria: "Comida", limite: 500, color: "#2e7d32"},
        {id: 2, categoria: "Transporte", limite: 300, color: "#1565c0"},
        {id: 3, categoria: "Entretenimiento", limite: 500, color: "#fbc02d"},
        {id: 4, categoria: "Salud", limite: 300, color: "#d32f2f"},
        {id: 5, categoria: "Servicios", limite: 800, color: "#8e24aa"},
    ];

    switch(screen){
        case 'presupuestosS':
            return<PresupuestosScreen></PresupuestosScreen>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container}>

                        <Text style={styles.titulo}>ELIMINAR PRESUPUESTO</Text>

                        {presupuestos.map(item => (
                            <View key={item.id} style={styles.tarjeta}>

                                <View style={styles.infoContainer}>
                                    <Text style={[styles.categoria, {color: item.color}]}>{item.categoria}</Text>
                                    <Text style={styles.monto}>Límite: ${item.limite}</Text>
                                </View>

                                <TouchableOpacity style={styles.btnEliminar}>
                                    <Text style={styles.btnEliminarText}>ELIMINAR</Text>
                                </TouchableOpacity>

                            </View>
                        ))}

                        <TouchableOpacity style={styles.btnVolver} onPress={()=>setScreen("presupuestosS")}>
                            <Text style={[styles.btnTexto, {color: "#fff"}]}>Volver al menú de Presupuestos</Text>    
                        </TouchableOpacity> 

                    </ScrollView>
                );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddinTop: 70,
        paddingHorizontal: 25,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: "#1b5e20",
        textAlign: 'center',
        marginBottom: 25,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },

    infoContainer:{
        flexDirection: "column",
    },

    categoria:{
        fontSize: 18,
        fontWeight: 'bold',
    },

    monto:{
        fontSize: 14,
        color: "#555",
    },

    btnEliminar:{
        backgroundColor: "#c62828",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },

    btnEliminarText:{
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 14,
    },

    btnVolver:{
        backgroundColor: "#1b5e20",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 40,
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    btnTexto:{
        fontSize: 16,
        fontWeight: "bold",
    },
});