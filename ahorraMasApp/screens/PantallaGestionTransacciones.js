import React, {useEffect, useState} from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Button, TextInput } from 'react-native'
import PantallaPrincipal from './PantallaPrincipal';
import ListarTransaccion from './ListarTransaccion';
import AgregarTransaccion from './AgregarTransaccion';
import EditarTransacciones from './EditarTransaccion';
import EliminarTransaccion from './EliminarTransaccion';


export default function PantallaGestionTransacciones() {
  
    const[screen, setScreen]=useState('menu');

    switch(screen){
        case 'pantallaPrincipal':
            return<PantallaPrincipal></PantallaPrincipal>
        case 'listarT':
            return<ListarTransaccion></ListarTransaccion>
        case 'agregarT':
            return<AgregarTransaccion></AgregarTransaccion>
        case 'editarT':
            return<EditarTransacciones></EditarTransacciones>
        case 'eliminarT':
            return<EliminarTransaccion></EliminarTransaccion>
        case 'menu':
            default:
                return (
                    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>

                        {/*ENCABEZADO*/}
                        <Text style={styles.titulo}>TRANSACCIONES</Text>
                        
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

                            <TouchableOpacity style={styles.boton} onPress={()=>setScreen("listarT")}>
                                {/*<Ionicons>*/}
                                <Text style={styles.botonText}>Lista de Transacciones</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.boton} onPress={()=>setScreen("agregarT")}>
                                {/*<Ionicons>*/}
                                <Text style={styles.botonText}>Agregar Transaccion</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.boton} onPress={()=>setScreen("editarT")}>
                                {/*<Ionicons>*/}
                                <Text style={styles.botonText}>Editar Transaccion</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.boton} onPress={()=>setScreen("eliminarT")}>
                                {/*<Ionicons>*/}
                                <Text style={styles.botonText}>Eliminar Transaccion</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.volverBoton} onPress={()=> setScreen('pantallaPrincipal')}>
                                <Text style={styles.volverBotonTexto}>Volver al menú</Text>
                            </TouchableOpacity>

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