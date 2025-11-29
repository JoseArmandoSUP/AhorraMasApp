import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState} from "react";
//import PantallaGestionTransacciones from "./PantallaGestionTransacciones";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TransaccionController } from "../controllers/TransaccionController";

const controller = new TransaccionController();

export default function EditarTransaccion(){
    const navigatation = useNavigation();
    const route = useRoute();
    const transaccion = route.params?.transaccion; // <-- recibe la transaccion enviada

    if(!transaccion){
        return(
            <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
                <Text style={{fontSize: 18, color:"red"}}>
                    No se ha recibido una transacción
                </Text>
            </View>
        );
    }

    //Estados iniciales con los datos en BD
    const[tipo, setTipo] = useState(transaccion.tipo);
    const[categoria, setCategoria] = useState(transaccion.categoria);
    const[monto, setMonto] = useState(transaccion.monto);
    const[descripcion, setDescripcion] = useState(transaccion.descripcion);
    const[fecha, setFecha] = useState(transaccion.fecha.split(" ")[0]); // <-- Para el formato AÑO-MES-DIA

    const filtrarCaracteresM = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setMonto(numerico);
    };

    //Valida el formato de la fecha
    const validarFecha = (f) => {
        const regex= /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(f);
    };

    const alertaEdicion = async () => {
        if(!tipo || !categoria || !monto || descripcion.trim() === "" || !fecha){
            Alert.alert("Por favor complete todos los campos");
            alert("Por favor complete todos los campos");
            return;
        }
        if(!validarFecha(fecha)){
            Alert.alert("Formato de fecha invalido, use: AÑO-MES-DIA");
            return;
        }
        try{
            await controller.actualizar(transaccion.id, tipo, categoria, Number(monto), descripcion, fecha);
            Alert.alert(
                `Transaccion editada correctamente: \n Tipo: ${tipo} \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
            );
            alert(
                `Transaccion editada correctamente: \n Tipo: ${tipo} \n Categoria: ${categoria} \n Monto: $${monto} \n Fecha: ${fecha}`
            );
            navigatation.goBack();
        }catch(error){
            Alert.alert("Error al actualizar", error.message);
        }
    };

    return(
        <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        
            <View style={styles.container}>

                <Text style={styles.titulo}>EDITAR TRANSACCIÓN</Text>

                <View style={styles.fomrulario}>
                    
                    <Text style={styles.label}>Tipo (Gasto o Ingreso)</Text>
                    <TextInput 
                        style={styles.input}
                        value={tipo}
                        onChangeText={setTipo}
                    ></TextInput>

                    <Text style={styles.label}>Categoria</Text>
                    <TextInput 
                        style={styles.input}
                        value={categoria}
                        onChangeText={setCategoria}
                    ></TextInput>

                    <Text style={styles.label}>Monto</Text>
                    <TextInput 
                        style={styles.input}
                        keyboardType="numeric"  
                        value={monto}
                        onChangeText={filtrarCaracteresM}
                    ></TextInput>

                    <Text style={styles.label}>Descripción: </Text>
                    <TextInput 
                        style={styles.areaTexto}
                        value={descripcion}
                        onChangeText={setDescripcion}
                        multiline={true}
                    ></TextInput>

                    <Text style={styles.label}>Fecha (AÑO-MES-DIA): </Text>
                    <TextInput 
                        style={styles.input}
                        value={fecha}
                        onChangeText={setFecha}
                        placeholder="AÑO-MES-DIA"
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