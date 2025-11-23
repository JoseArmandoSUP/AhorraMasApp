import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState} from "react";
//import PresupuestosScreen from "./PresupuestosScreen";
import { useNavigation } from "@react-navigation/native";

export default function AgregarPresupuesto(){
    const navigatation = useNavigation();

    const[categoria, setCategoria] = useState("");
    const[monto, setMonto] = useState("");
    const[fecha, setFecha] = useState("");

    const alertaAgregar = () => {
        if(!categoria || !monto || !fecha){
            Alert.alert("Por favor complete todos los campos");
            alert("Por favor complete todos los campos");
            return;
        }
        Alert.alert(
            `Presupuesto agregado correctamente: \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
        alert(
            `Presupuesto agregado correctamente: \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
    };

    const filtrarCaracteresM = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setMonto(numerico);
    };

    return(
        <ScrollView style={styles.container}>

            <Text style={styles.titulo}>AGREGAR PRESUPUESTO</Text>

            {/*Definicion del presupusto mensual*/}
            <View style={styles.definirContainer}>
                
                <Text style={styles.definirTitulo}>Definir presupuesto mensual</Text>

                <View style={styles.definirColumna}>
                    <Text style={styles.definirLabel}>Categoria:</Text>
                    <View style={styles.definirInput}>
                        <TextInput 
                            style={styles.definirPlaceholder} 
                            placeholder="Ejemplo: Comida, Transporte..."
                            value={categoria}
                            onChangeText={setCategoria}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.definirColumna}>
                    <Text style={styles.definirLabel}>Monto Límite:</Text>
                    <View style={styles.definirInput}>
                        <TextInput 
                            keyboardType="numeric"
                            style={styles.definirPlaceholder} 
                            placeholder="Ejemplo: $500"
                            value={monto}
                            onChangeText={filtrarCaracteresM}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.definirColumna}>
                    <Text style={styles.definirLabel}>Fecha:</Text>
                    <View style={styles.definirInput}>
                        <TextInput
                            style={styles.definirPlaceholder} 
                            placeholder="AÑO-MES-DIA"
                            value={fecha}
                            onChangeText={setFecha}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.definirBoton} onPress={alertaAgregar}>
                    <Text style={styles.definirBotonTexto}>Guardar presupuesto</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.volverBoton} onPress={()=>navigatation.goBack()}>
                    <Text style={styles.volverBotonTexto}>Volver al menú de Presupuestos</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: 70,
        paddingHorizontal: 25,
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
        color: "#1b5e20",
        textAlign: "center",
        marginBottom: 25,
    },

    btnContainer:{
        marginTop: 10,
        alignItems: "center",
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