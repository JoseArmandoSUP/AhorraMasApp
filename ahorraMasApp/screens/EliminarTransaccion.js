import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState} from "react";
//import PantallaGestionTransacciones from "./PantallaGestionTransacciones";
import { useNavigation } from "@react-navigation/native";

export default function EliminarTransaccion(){
    const navigation = useNavigation();

    const transaccion = {
        tipo: "Gasto",
        categoria: "Comida",
        monto: 450,
        fecha: "2025-10-20",
    };

    const confirmarEliminacion = () => {
        Alert.alert(
            'Confirmar',
            `¿Desea eliminar esta transacción?\n\n ${transaccion.tipo} - ${transaccion.categoria} - ${transaccion.monto}`,
            [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive", onPress:()=>alert("Transaccion eliminada")},]
        );

        alert(
            'Confirmar',
            `¿Desea eliminar esta transacción?\n\n ${transaccion.tipo} - ${transaccion.categoria} - ${transaccion.monto}`,
            [{text: "Cancelar", style: "cancel"}, {text: "Eliminar", style: "destructive", onPress:()=>alert("Transaccion eliminada")},]
        );
    };

    return(
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>

            <Text style={styles.titulo}>ELIMINAR TRANSACCIÓN</Text>

            <View style={styles.trajeta}>
                
                <Text style={styles.label}>Tipo:</Text>
                <Text style={styles.valor}>{transaccion.tipo}</Text>

                <Text style={styles.label}>Categoria:</Text>
                <Text style={styles.valor}>{transaccion.categoria}</Text>

                <Text style={styles.label}>Monto:</Text>
                <Text style={styles.valor}>{transaccion.monto}</Text>

                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.valor}>{transaccion.fecha}</Text>

            </View>

            <TouchableOpacity style={styles.btnEliminar} onPress={confirmarEliminacion}>
                <Text style={styles.volverBotonTexto}>ELIMINAR TRANSACCIÓN</Text>
            </TouchableOpacity>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.volverBoton} onPress={()=>navigation.goBack()}>
                    <Text style={styles.volverBotonTexto}>Volver al menu de Transacciones</Text>
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
        fontWeight: "bold",
        color: "1b5e20",
        textAlign: "center",
        marginBottom: 25,
    },

    trajeta:{
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    label:{
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
    },

    valor:{
        fontSize: 16,
        color: "#555",
        marginBottom: 8,
    },

    btnEliminar:{
        backgroundColor: "#d32f2f",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },

    btnContainer:{
        marginTop: 25,
        marginBottom: 40,
    },

    volverBoton: {
        backgroundColor: "#999",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
    },

    volverBotonTexto: {
        color: "#fff",
        fontWeight: "bold",
    },
});