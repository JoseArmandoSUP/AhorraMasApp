import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState, useEffect, useContext, useCallback} from "react";
//import PantallaGestionTransacciones from "./PantallaGestionTransacciones";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import { TransaccionController } from "../controllers/TransaccionController";

const controller = new TransaccionController();

export default function ListarTransaccion(){
    
    const navigation = useNavigation();

    const {transacciones, setTransacciones} = useContext(AppContext);
    const [cargando, setCargando] = useState(true);

    // Filtros
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    //Para las notificaciones de ecceso del presupuesto
    const { alertas } = useContext(AppContext);

    // Carga las Transacciones desde SQLite
    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                try{
                    await controller.initialize();
                    const data = await controller.listar(); // <-- Manda a llamar el metodo desde SQLite
                    setTransacciones(data);
                    setCargando(false);
                }catch (error){
                    Alert.alert("Error", error.message);
                }
            }; 
            load();
        }, [])
    );
    
    function formatoFecha(f){
        if(!f){
            return "";
        } 

        const partes = f.split("-");

        if(partes.length !== 3 ){
            return f;
        }

        const año = partes[0].trim();
        const mes = partes[1].trim().padStart(2, "0");
        const dia = partes[2].trim().padStart(2, "0");

        return `${año}-${mes}-${dia}`.slice(0,10);
    }

    //Funcion para los filtros
    const aplicarFiltros = async () => {
        try{
            const fechaFormato = formatoFecha(filtroFecha);
            const data = await controller.listarFiltardo(fechaFormato, filtroCategoria, filtroTipo);
            setTransacciones(data);
        }catch(error){
            Alert.alert("Error al filtrar", error.message);
        }
    };

    //Quitar los filtros y mostrar todas las transacciones
    const limpiarFiltros = async () => {
        try{
            setFiltroFecha("");
            setFiltroCategoria("");
            setFiltroTipo("");
            const data = await controller.listar();
            setTransacciones(data);
        }catch(error){
            Alert.alert("Error", error.message);
        }
    };

    if(cargando){
        return(
            <View style={{flex: 1, justifyContent:"center", alignItems:"center"}}>
                <Text>Cargando transacciones...</Text>
            </View>
        );
    }

    return(
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
        
            <Text style={styles.titulo}>LISTA DE TRANSACCIONES</Text>

            {/*FILTRADO*/}
            <View style={styles.filtrosContainer}>
                <Text style={styles.filtrosTitulo}>Filtrar por</Text>

                <View style={styles.filtrosFila}>
                    <Text style={styles.filtrosLabel}>Fecha: </Text>
                    <View style={styles.filtrosInput}>
                        <TextInput 
                            style={styles.filtrosPlaceHolder} 
                            placeholder='AÑO-MES-DIA'
                            value={filtroFecha}
                            onChangeText={setFiltroFecha}
                            color="#333"
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.filtrosFila}>
                    <Text style={styles.filtrosLabel}>Categoria: </Text>
                    <View style={styles.filtrosInput}>
                        <TextInput 
                            style={styles.filtrosPlaceHolder} 
                            placeholder='Ingrese la Categoria (Comida, Transporte, etc)'
                            value={filtroCategoria}
                            onChangeText={setFiltroCategoria}
                            color="#333"
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.filtrosFila}>
                    <Text style={styles.filtrosLabel}>Tipo: </Text>
                    <View style={styles.filtrosInput}>
                        <TextInput 
                            style={styles.filtrosPlaceHolder} 
                            placeholder='Ingreso / Gasto'
                            value={filtroTipo}
                            onChangeText={setFiltroTipo}
                            color="#333"
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.filtrosBoton} onPress={aplicarFiltros}>
                    <Text style={styles.filtrosBotonTexto}>Aplicar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.filtrosBoton, {backgroundColor:"#555"}]} onPress={limpiarFiltros}>
                    <Text style={styles.filtrosBotonTexto}>Deshacer Filtro</Text>
                </TouchableOpacity>
            </View>

            {/* Notificaciones de exceso de presupuesto */}
            {alertas.length > 0 && (
                <View style={{backgroundColor: "#ffcccc", padding: 10, borderRadius: 10, marginBottom: 10}}>
                    {alertas.map((a, index) => (
                        <Text key={index} style={{color: "#900", fontWeight: "bold"}}>
                            {a}
                        </Text>
                    ))}
                </View>
            )}

            {/* TARJETAS CON LAS TRANSACCIONES */}
            {transacciones.length === 0 ? (
                <Text style={{textAlign:"center", marginTop: 20, color: "#777"}}>
                    No hay transacciones, registre una para visualizarla aqui
                </Text>
            ) : (
                transacciones.map((item)=>(
                    <TouchableOpacity key={item.id} style={styles.tarjeta} onPress={()=>navigation.navigate("EditarTransaccion", {transaccion: item})}>
                        <Text style={styles.tipo}>{item.tipo}</Text>
                        <Text style={styles.texto}>Categoria: {item.categoria}</Text>
                        <Text style={styles.texto}>Monto: ${item.monto}</Text>
                        <Text style={styles.texto}>Descripción: {item.descripcion}</Text>
                        <Text style={styles.texto}>Fecha: {item.fecha}</Text>
                    </TouchableOpacity>
                ))
            )}

            
            <TouchableOpacity style={styles.volverBoton} onPress={()=>navigation.goBack()}>
                <Text style={styles.volverBotonTexto}>Volver al menu de Transacciones</Text>
            </TouchableOpacity>
            

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

    tarjeta:{
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    tipo:{
        fontSize: 16,
        fontWeight: "bold",
        color: "#2e7d32",
        marginBottom: 5,
    },

    texto:{
        fontSize: 14,
        color: "#333",
    },

    botonContainer:{
        marginTop: 20,
        marginBottom: 30,
    },

    //----------------------------------------
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