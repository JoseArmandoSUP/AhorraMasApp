import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState} from "react";
import PantallaGestionTransacciones from "./PantallaGestionTransacciones";

export default function AgregarTransaccion(){
    const[screen, setScreen] = useState('menu');

    const[tipo, setTipo] = useState("");
    const[categoria, setCategoria] = useState("");
    const[monto, setMonto] = useState("");
    const[fecha, setFecha] = useState("");

    const alertaRegistro = () => {
        if(!tipo || !categoria || !monto || !fecha){
            Alert.alert("Por favor complete todos los campos");
            alert("Por favor complete todos los campos");
            return;
        }
        Alert.alert(
            `Transaccion agregada correctamente: \n Tipo: ${tipo} \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
        alert(
            `Transaccion agregada correctamente: \n Tipo: ${tipo} \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
    };

    switch(screen){
        case 'pantallaTransacciones':
            return<PantallaGestionTransacciones></PantallaGestionTransacciones>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container}>

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
                                placeholder="Ejemplo: 500"
                                value={monto}
                                onChangeText={setMonto}
                            ></TextInput>

                            <Text style={styles.label}>Fecha: </Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="AÑO-MES-DIA"
                                value={fecha}
                                onChangeText={setFecha}
                            ></TextInput>

                            <Button title="Guardar Transaccion" style={styles.btnAgregar} onPress={alertaRegistro}></Button>

                        </View>

                        <View style={styles.btnContainer}>
                            <Button title="Volver al menu de Transacciones" onPress={()=>setScreen("pantallaTransacciones")}></Button>
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
});