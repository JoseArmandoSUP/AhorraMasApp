import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ProgressBarAndroid, Platform, 
    ProgressViewIOS, TextInput} from 'react-native'
//import { ProgressBar } from "react-native-web";
import PantallaPrincipal from "./PantallaPrincipal";
import { Button } from "react-native";

export default function PresupuestosScreen(){
    
    const[screen, setScreen]=useState('menu');
    
    //Función para mostrar barra de progreso


    const presupuestos = [
        {id: 1, categoria: 'Comida', spent: 400, limit: 500, color: '#2e7d32'},
        {id: 2, categoria: 'Transporte', spent: 200, limit: 300, color: '#d32f2f'},
        {id: 3, categoria: 'Entretenimiento', spent: 150, limit: 500, color: '#fbc02d'},
        {id: 4, categoria: 'Salud', spent: 100, limit: 300, color: '#303f9f'},
        {id: 5, categoria: 'Servicios', spent: 450, limit: 800, color: '#8e24aa'},
    ];

    switch(screen){
        case 'pantallaPrincipal':
            return<PantallaPrincipal></PantallaPrincipal>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
                        <Text style={styles.titulo}>PRESUPUESTO</Text>

                        {/*Definicion del presupusto mensual*/}
                        <View style={styles.definirContainer}>
                            
                            <Text style={styles.definirTitulo}>Definir presupuesto mensual</Text>

                            <View style={styles.definirColumna}>
                                <Text style={styles.definirLabel}>Categoria:</Text>
                                <View style={styles.definirInput}>
                                    <TextInput style={styles.definirPlaceholder} placeholder="Escribe aquí"></TextInput>
                                </View>
                            </View>

                            <View style={styles.definirColumna}>
                                <Text style={styles.definirLabel}>Monto:</Text>
                                <View style={styles.definirInput}>
                                    <TextInput style={styles.definirPlaceholder} placeholder="Escribe aquí"></TextInput>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.definirBoton}>
                                <Text style={styles.definirBotonTexto}>Guardar presupuesto</Text>
                            </TouchableOpacity>

                        </View>

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
                            
                            <TouchableOpacity style={styles.crudBoton}>
                                {/*<Ionicons>*/}
                                <Text style={styles.crudTexto}>Ver Presupuestos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.crudBoton}>
                                {/*<Ionicons>*/}
                                <Text style={styles.crudTexto}>Agregar Presupuesto</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.crudBoton}>
                                {/*<Ionicons>*/}
                                <Text style={styles.crudTexto}>Editar Presupuesto</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.crudBoton}>
                                {/*<Ionicons>*/}
                                <Text style={styles.crudTexto}>Eliminar Presupuesto</Text>
                            </TouchableOpacity>

                            <Button onPress={()=> setScreen('pantallaPrincipal')} title="Volver al menú"></Button>

                        </View>

                    </ScrollView>
                );
    } 
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 70,
        paddingHorizontal: 20,
    },

    //Estilos para la parte de definir presupuesto
    definirContainer:{
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    definirTitulo:{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e7d32',
        textAlign: 'center',
        marginBottom: 10,
    },

    definirColumna:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },

    definirLabel:{
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        width: '40%',
    },

    definirInput:{
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        width: '55%',
    },

    definirPlaceholder:{
        color: '#999',
        fontSize: 14,
    },

    definirBoton:{
        backgroundColor: '#2e7d32',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    definirBotonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    //---------------------------------------------
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
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, 
    },

    crudTexto:{
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
});