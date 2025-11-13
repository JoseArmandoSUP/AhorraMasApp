import React, {useEffect, useState} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native'
import PantallaPrincipal from './PantallaPrincipal';
import ListarTransaccion from './ListarTransaccion';
import AgregarTransaccion from './AgregarTransaccion';


export default function PantallaGestionTransacciones() {
  
    const[screen, setScreen]=useState('menu');

    switch(screen){
        case 'pantallaPrincipal':
            return<PantallaPrincipal></PantallaPrincipal>
        case 'listarT':
            return<ListarTransaccion></ListarTransaccion>
        case 'agregarT':
            return<AgregarTransaccion></AgregarTransaccion>
        case 'menu':
            default:
                return (
                    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>

                        {/*ENCABEZADO*/}
                        <Text style={styles.titulo}>TRANSACCIONES</Text>

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
                        
                        {/*CONTENEDOR DE GASTOS E INGRESOS*/}
                        <View style={styles.todoContainer}>

                            <View style={styles.todoCajas}>
                                <Text style={styles.todoLabel}>GASTOS</Text>
                                <Text style={styles.todoAmount}>$1000</Text>
                                {/*<Ionicons>*/}
                            </View>

                            <View style={styles.todoCajas}>
                                <Text style={styles.todoLabel}>INGRESOS</Text>
                                <Text style={styles.todoAmount}>$1200</Text>
                                {/*<Ionicons>*/}
                            </View>

                        </View>

                        {/*BOTONES CRUD*/}
                        <View style={styles.botonesContainer}>

                            <TouchableOpacity style={styles.boton}>
                                {/*<Ionicons>*/}
                                <Button title='Lista de Transacciones' style={styles.botonText} onPress={()=>setScreen("listarT")}></Button>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.boton}>
                                {/*<Ionicons>*/}
                                <Button title='Agregar Transaccion' style={styles.botonText} onPress={()=>setScreen("agregarT")}></Button>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.boton}>
                                {/*<Ionicons>*/}
                                <Text style={styles.botonText}>Editar Transaccion</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.boton}>
                                {/*<Ionicons>*/}
                                <Text style={styles.botonText}>Eliminar Transaccion</Text>
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
        paddingTop: 60,
        paddingHorizontal: 20,
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

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1b5e20',
        textAlign: 'center',
        marginBottom: 25,
    },

    todoContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },

    todoCajas:{
        backgroundColor: '#fff',
        width: '47%',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    todoLabel:{
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },

    todoAmount:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#333',
    },

    botonesContainer:{
        marginTop: 20,
    },

    boton:{
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

    botonText:{
        margin: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },

    relleno:{
        color:'#fff',
    },
});