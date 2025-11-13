import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button } from "react-native";
import React, {useState} from "react";
import PantallaGestionTransacciones from "./PantallaGestionTransacciones";

export default function ListarTransaccion(){
    const[screen, setScreen] = useState("menu");

    const transacciones = [
        {id: 1, tipo: "Gasto", categoria: "Comida", monto: 150, fecha: "2025-10-20"},
        {id: 2, tipo: "Ingreso", categoria: "Salario", monto: 1200, fecha: "2025-10-21"},
        {id: 3, tipo: "Gasto", categoria: "Transporte", monto: 80, fecha: "2025-10-22"},
    ];

    switch(screen){
        case 'pantallaTransacciones':
            return<PantallaGestionTransacciones></PantallaGestionTransacciones>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container}>
                    
                    <Text style={styles.titulo}>LISTA DE TRANSACCIONES</Text>

                    {/* TARJETAS CON LAS TRANSACCIONES */}
                    {transacciones.map((item)=>(
                        <View key={item.id} style={styles.tarjeta}>
                            <Text style={styles.tipo}>{item.tipo}</Text>
                            <Text style={styles.texto}>Categoria: {item.categoria}</Text>
                            <Text style={styles.texto}>Monto: ${item.monto}</Text>
                            <Text style={styles.texto}>Fecha: {item.fecha}</Text>
                        </View>
                    ))}

                    <View style={styles.botonContainer}>
                        <Button title="Volver al menú de Transacciones" onPress={()=>setScreen("pantallaTransacciones")}></Button>
                    </View>

                    </ScrollView>
                );
    }

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
    },

    tipo:{
        fontSize: 16,
        fontWeight: "bold",
        color: "#2e7d32",
        marginBottom: 5,
    },

    texto:{
        fontSize: 14,
        color: "#333",
    },

    botonContainer:{
        marginTop: 20,
        marginBottom: 30,
    },
});