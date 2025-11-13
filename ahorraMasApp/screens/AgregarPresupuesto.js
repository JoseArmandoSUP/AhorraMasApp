import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput } from "react-native";
import React, {useState} from "react";
import PresupuestosScreen from "./PresupuestosScreen";

export default function AgregarPresupuesto(){
    const[screen, setScreen] = useState("menu");

    const[categoria, setCategoria] = useState("");
    const[monto, setMonto] = useState("");

    switch(screen){
        case 'presupuestosS':
            return<PresupuestosScreen></PresupuestosScreen>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container}>

                        <Text style={styles.titulo}>AGREGAR PRESUPUESTO</Text>

                        <View style={styles.formulaioContainer}>

                            <Text style={styles.label}>Categoría</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="Ejemplo: Comida, Transporte..."
                                placeholderTextColor="#999"
                                value={categoria}
                                onChangeText={setCategoria}
                            ></TextInput>

                            <Text style={styles.label}>Monto Límite</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="Ejemplo: $500"
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                                value={categoria}
                                onChangeText={setCategoria}
                            ></TextInput>

                            <Button title="Guardar Presupuesto"></Button>

                        </View>

                        <View style={styles.btnContainer}>
                            <Button title="Volver al menú de Presupuestos" onPress={()=>setScreen('presupuestosS')}></Button>
                        </View>

                    </ScrollView>
                );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: 70,
        paddingHorizontal: 25,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: "#1b5e20",
        textAlign: "center",
        marginBottom: 25,
    },

    formulaioContainer:{
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 30,
    },

    label:{
        fontSize: 15,
        color: "#333",
        marginBottom: 6,
        fontWeight: "600",
    },

    input:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 15,
        color: "#000",
    },

    btnContainer:{
        marginTop: 10,
        alignItems: "center",
    },
});