import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput } from "react-native";
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

                    {/*FILTRADO*/}
                    <View style={styles.filtrosContainer}>
                        <Text style={styles.filtrosTitulo}>Filtrar por</Text>

                        <View style={styles.filtrosFila}>
                            <Text style={styles.filtrosLabel}>Fecha: </Text>
                            <View style={styles.filtrosInput}>
                                <TextInput style={styles.filtrosPlaceHolder} placeholder='AÑO-MES-DIA'></TextInput>
                            </View>
                        </View>

                        <View style={styles.filtrosFila}>
                            <Text style={styles.filtrosLabel}>Categoria: </Text>
                            <View style={styles.filtrosInput}>
                                <TextInput style={styles.filtrosPlaceHolder} placeholder='Seleccionar la categoria'></TextInput>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.filtrosBoton}>
                            <Text style={styles.filtrosBotonTexto}>Aplicar</Text>
                        </TouchableOpacity>

                    </View>

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
                        <TouchableOpacity style={styles.volverBoton} onPress={()=>setScreen("pantallaTransacciones")}>
                            <Text style={styles.volverBotonTexto}>Volver al menú de Transacciones</Text>
                        </TouchableOpacity>
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
        color: '#2e7d32',
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
        backgroundColor: '#2e7d32',
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

    //----------------------------------------
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