import React from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'


export default function ButtomSheet () {
  
    return (
      <ScrollView style={styles.container}>

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

            <TouchableOpacity style={styles.boton}>
                {/*<Ionicons>*/}
                <Text style={styles.botonText}>Lista de Transacciones</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}>
                {/*<Ionicons>*/}
                <Text style={styles.botonText}>Agregar Transaccion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}>
                {/*<Ionicons>*/}
                <Text style={styles.botonText}>Editar Transaccion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boton}>
                {/*<Ionicons>*/}
                <Text style={styles.botonText}>Eliminar Transaccion</Text>
            </TouchableOpacity>

        </View>

      </ScrollView>
    );
  
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
});