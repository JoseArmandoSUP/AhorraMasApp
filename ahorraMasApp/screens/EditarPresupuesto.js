import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState} from "react";
//import PresupuestosScreen from "./PresupuestosScreen";
import { useNavigation } from "@react-navigation/native";

export default function EditarPresupuesto({/*{route}*/}){
    const navigatation = useNavigation();

    {/* const {categoria: cat, monto: mon} = route.params; */}
    const[categoria, setCategoria] = useState("Comida"); {/* useState(cat) */}
    const[monto, setMonto] = useState("500"); {/* useState(mont) */}
    const[fecha, setFecha] = useState("2025-11-10");

    const alertaAgregar = () => {
        if(!categoria || !monto || !fecha){
            Alert.alert("Por favor complete todos los campos");
            alert("Por favor complete todos los campos");
            return;
        }
        Alert.alert(
            `Presupuesto editado correctamente: \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
        alert(
            `Presupuesto editado correctamente: \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
        );
    };
    
    const filtrarCaracteresM = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setMonto(numerico);
    };

    return(
        <ScrollView style={styles.container}>

            <Text style={styles.titulo}>EDITAR PRESUPUESTO</Text>

            <View style={styles.formulaioContainer}>

                <Text style={styles.label}>Categoría</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Comida"
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
                    value={monto}
                    onChangeText={filtrarCaracteresM}
                ></TextInput>

                <Text style={styles.label}>Fecha:</Text>
                <TextInput
                    style={styles.input} 
                    placeholder="AÑO-MES-DIA"
                    placeholderTextColor="#999"
                    value={fecha}
                    onChangeText={setFecha}
                ></TextInput>
                

                <TouchableOpacity style={styles.definirBoton} onPress={alertaAgregar}>
                    <Text style={styles.definirBotonTexto}>Editar Presupuesto</Text>
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