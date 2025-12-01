import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useContext, useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import { TransaccionController } from "../controllers/TransaccionController";

const controller = new TransaccionController();

export default function AgregarTransaccion(){
    const navigatation = useNavigation();

    const[tipo, setTipo] = useState("");
    const[categoria, setCategoria] = useState("");
    const[monto, setMonto] = useState("");
    const[descripcion, setDescripcion] = useState("");

    const{ setTransacciones } = useContext(AppContext);

    //Inicia la base de datos
    useEffect(() => {
        controller.initialize();
    },[]);

    async function handleGuardar(){
        try{
            const nueva = await controller.agregar(tipo, categoria, Number(monto), descripcion);
            //Guarda el contexto para actualizar presupuestos y alertas
            setTransacciones(prev => [...prev, nueva]);
            Alert.alert("Transaccion guardada");
            navigatation.goBack();
        }catch(error){
            Alert.alert("Error", error.message);
        }
    }

    const filtrarCaracteresM = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setMonto(numerico);
    };

    return(
        <ScrollView contentContainerStyle={{paddingBottom: 80}}>

            <View style={styles.container}>

                <Text style={styles.titulo}>AGREGAR TRANSACCIÓN</Text>

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

                    <Text style={styles.label}>Descripción: </Text>
                    <TextInput 
                        style={styles.areaTexto}
                        placeholder="Descripcion"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline={true}
                    ></TextInput>

                    {/* Fecha se guarada automaticamente con SQLite */}

                    {/* Agregado 3:23 */}
                    <TouchableOpacity style={styles.btnAgregar} onPress={handleGuardar}>
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