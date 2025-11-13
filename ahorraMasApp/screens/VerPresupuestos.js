import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button } from "react-native";
import React, {useState} from "react";
import PresupuestosScreen from "./PresupuestosScreen";

export default function VerPresupuestos(){
    const[screen, setScreen] = useState("menu");

    const presupuestos = [
        {id: 1, categoria: "Comida", limite: 500, gastado: 320, color: "#2e7d32"},
        {id: 2, categoria: "Transporte", limite: 300, gastado: 200, color: "#1565c0"},
        {id: 3, categoria: "Entretenimiento", limite: 400, gastado: 150, color: "#fbc02d"},
        {id: 4, categoria: "Salud", limite: 350, gastado: 280, color: "#d32f2f"},
    ];

    switch(screen){
        case 'presupuestosS':
            return<PresupuestosScreen></PresupuestosScreen>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container}>

                        <Text style={styles.titulo}>LISTA DE PRESUPUESTOS</Text>

                        {presupuestos.map((item)=>{
                            const porcentaje = Math.round((item.gastado / item.limite)*100);
                            return(
                                <View key={item.id} style={styles.tarjeta}>
                                    
                                    <View style={styles.fila}>
                                        
                                        <Text style={[styles.categoria, {color: item.color}]}>
                                            {item.categoria}
                                        </Text>

                                        <Text style={styles.cantidad}>
                                            ${item.gastado} / ${item.limite}
                                        </Text>

                                    </View>

                                    <View style={styles.progresoBarra}>
                                        <View 
                                            style={[styles.llenarProgreso, {width: `${porcentaje}%`, backgroundColor: item.color},]}
                                        ></View>
                                    </View>

                                    <Text style={styles.procentaje}>{porcentaje}% del presupuesto usado</Text>

                                </View>
                            );
                        })}

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
        paddingTop: 60,
        paddingHorizontal: 20,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: "#1b5e20",
        textAlign: 'center',
        marginBottom: 20,
    },

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

    fila:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    categoria:{
        fontSize: 16,
        fontWeight: "600",
    },

    cantidad:{
        fontSize: 14,
        color: "#555",
    },

    progresoBarra:{
        height: 10,
        backgroundColor: "#e0e0e0",
        borderRadius: 5,
        overflow: 'hidden',
        marginTop: 4,   
    },

    llenarProgreso:{
        height: '100%',
        borderRadius: 5,
    },

    porcentaje:{
        fontSize: 13,
        color: "#444",
        textAlign: "right",
        marginTop: 5,
    },

    btnContainer:{
        marginTop: 25,
    },
});