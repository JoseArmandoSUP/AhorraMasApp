import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ProgressBarAndroid, Platform, 
    ProgressViewIOS, TextInput} from 'react-native'
//import { ProgressBar } from "react-native-web";
//import PantallaPrincipal from "./PantallaPrincipal";
import { Button } from "react-native";
//import VerPresupuestos from "./VerPresupuestos";
//import AgregarPresupuesto from "./AgregarPresupuesto";
//import EditarPresupuesto from "./EditarPresupuesto";
//import EliminarPresupuesto from "./EliminarPresupuesto";
import { useNavigation } from "@react-navigation/native";

export default function PresupuestosScreen(){
    
    const navigation = useNavigation();
    
    //Función para mostrar barra de progreso


    const presupuestos = [
        {id: 1, categoria: 'Comida', spent: 400, limit: 500, color: '#2e7d32'},
        {id: 2, categoria: 'Transporte', spent: 200, limit: 300, color: '#d32f2f'},
        {id: 3, categoria: 'Entretenimiento', spent: 150, limit: 500, color: '#fbc02d'},
        {id: 4, categoria: 'Salud', spent: 100, limit: 300, color: '#303f9f'},
        {id: 5, categoria: 'Servicios', spent: 450, limit: 800, color: '#8e24aa'},
    ];

    return(
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
            
            <Text style={styles.titulo}>PRESUPUESTO</Text>

            {/*LISTA DE PRESUPUESTOS*/}
            {presupuestos.map(item => {
                const porcentaje = Math.round((item.spent / item.limit) * 100);
                const progreso = item.spent / item.limit;
                return(
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cabezaCard}>
                            <View style={styles.iconoContainer}>
                                {/*<FontAwesome5 name={item.icon} size={18} color={item.color}></FontAwesome5>*/}
                                <Text style={styles.categoria}>{item.categoria}</Text>
                            </View>
                            <Text style={styles.cantidad}>
                                ${item.spent} / ${item.limit}
                            </Text>
                        </View>
                        {/*<ProgressBar progress={progreso} color={item.color}></ProgressBar>*/}
                        <Text style={styles.porcentajes}>{porcentaje}%</Text>
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

                <TouchableOpacity style={styles.crudBoton} onPress={()=>navigation.navigate("EditarPresupuesto")}>
                    {/*<Ionicons>*/}
                    <Text style={styles.crudTexto}>Editar Presupuesto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.crudBoton} onPress={()=>navigation.navigate("EliminarPresupuesto")}>
                    {/*<Ionicons>*/}
                    <Text style={styles.crudTexto}>Eliminar Presupuesto</Text>
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
});