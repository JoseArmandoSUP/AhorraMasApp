import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Button } from "react-native";
import PantallaPrincipal from "./PantallaPrincipal";

export default function Graficas(){
    const[screen, setScreen] = useState("menu");

    switch(screen){
        case 'pantallaPrincipal':
            return<PantallaPrincipal></PantallaPrincipal>
        case 'menu':
            default:
                return(
                    <ScrollView style={styles.container}>
                        
                        <Text style={styles.titulo}>REPORTES</Text>

                        {/*GRAFICA DE GASTOS*/}
                        <View style={styles.car}>
                            
                            <Text style={StyleSheet.subtitulos}>Reporte de Gastos</Text>
                            
                            <Image 
                                source={require("../assets/")}
                                style={styles.graficas}
                                resizeMode="contain"
                            ></Image>

                            <View style={styles.lista}>
                                <Text style={styles.cat}>Comida - 30.77%</Text>
                                <Text style={styles.cat}>Trasporte - 15.38%</Text>
                                <Text style={styles.cat}>Entretenimiento - 11.54%</Text>
                                <Text style={styles.cat}>Salud - 7.69%</Text>
                                <Text style={styles.cat}>Servicios - 34.62%</Text>
                            </View>

                        </View>

                        {/*GRAFICA DE PRESUPUESTOS*/}
                        <View style={styles.car}>
                            
                            <Text style={StyleSheet.subtitulos}>Reporte de Presupuesto</Text>
                            
                            <Image 
                                source={require("../assets/")}
                                style={styles.graficas}
                                resizeMode="contain"
                            ></Image>

                            <View style={styles.lista}>
                                <Text style={styles.cat}>Comida - 16.67%</Text>
                                <Text style={styles.cat}>Trasporte - 8.33%</Text>
                                <Text style={styles.cat}>Entretenimiento - 6.25%</Text>
                                <Text style={styles.cat}>Salud - 4.17%</Text>
                                <Text style={styles.cat}>Servicios - 18.75%</Text>
                                <Text style={styles.cat}>Presupuesto restante - 45.83%</Text>
                            </View>

                        </View>

                        <View style={styles.boton}>
                            <Button title="Volver al menú" onPress={()=>setScreen("pantallaPrincipal")}></Button>
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
        paddingHorizontal: 20,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1b5e20',
        textAlign: "center",
        marginBottom: 20,
    },

    car:{
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 15,
        marginBottom: 25,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    subtitulos:{
        fontSize: 16,
        fontWeight: 'bold',
        color: "#2e7d32",
        textAlign: 'center',
        marginBottom: 10,
    },

    graficas:{
        width: "100%",
        height: 200,
        marginBottom: 10,
    },

    lista:{
        marginTop: 5,
    }, 

    cat:{
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 6,
        fontSize: 14,
        color:"#333",
    },

    boton:{
        marginBottom: 40,
    },
});