import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState} from "react";
//import PantallaGestionTransacciones from "./PantallaGestionTransacciones";
import { useNavigation } from "@react-navigation/native";

export default function EditarTransaccion(){
    const navigatation = useNavigation();

    const[tipo, setTipo] = useState("Gasto");
    const[categoria, setCategoria] = useState("Comida");
    const[monto, setMonto] = useState("500");
    const[fecha, setFecha] = useState("2025-10-25");
    const[descripcion, setDescripcion] = useState("Simulacion de una descripicon, hola soy una descripcion");

    const alertaEdicion = () => {
        if(!tipo || !categoria || !monto || !fecha || descripcion.trim() === ""){
            Alert.alert("Por favor complete todos los campos");
            alert("Por favor complete todos los campos");
            return;
        }
        Alert.alert(
            `Transaccion editada correctamente: \n Tipo: ${tipo} \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
        alert(
            `Transaccion editada correctamente: \n Tipo: ${tipo} \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
    };

    const filtrarCaracteresM = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setMonto(numerico);
    };

    return(
        <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        
            <View style={styles.container}>

                <Text style={styles.titulo}>EDITAR TRANSACCIÓN</Text>

                <View style={styles.fomrulario}>
                    
                    <Text style={styles.label}>Tipo (Gasto o Ingreso)</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Ejemplo: Gasto"
                        value={tipo}
                        onChangeText={setTipo}
                    ></TextInput>

                    <Text style={styles.label}>Categoria</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Comida, Transporte, etc."
                        value={categoria}
                        onChangeText={setCategoria}
                    ></TextInput>

                    <Text style={styles.label}>Monto</Text>
                    <TextInput 
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Ejemplo: 500"
                        value={monto}
                        onChangeText={filtrarCaracteresM}
                    ></TextInput>

                    <Text style={styles.label}>Fecha: </Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="AÑO-MES-DIA"
                        value={fecha}
                        onChangeText={setFecha}
                    ></TextInput>

                    <Text style={styles.label}>Descripción: </Text>
                    <TextInput 
                        style={styles.areaTexto}
                        placeholder="Descripcion"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline={true}
                    ></TextInput>

                    {/* Agregado 3:23 */}
                    <TouchableOpacity style={styles.btnAgregar} onPress={alertaEdicion}>
                        <Text style={styles.botonTexto}>Guardar Transaccion</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity style={styles.volverBoton} onPress={()=>navigatation.goBack()}>
                        <Text style={styles.volverBotonTexto}>Volver al menu de Transacciones</Text>
                    </TouchableOpacity>
                </View>

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
        color: "#1b5e20",
        textAlign: 'center',
        marginBottom: 25,
    },

    fomrulario:{
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
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 5,
    },

    input:{
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: "#000",
    },

    btnAgregar:{
        backgroundColor: "#2e7d32",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 10,
    },

    btnContainer:{
        marginTop: 20,
        marginBottom: 30,
    },

    //Agregado 3:23
    areaTexto: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 15,
        height: 120,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 15,
        textAlignVertical: "top",
    },

    botonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
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