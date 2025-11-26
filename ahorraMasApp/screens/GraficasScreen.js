import React,{ useEffect, useState, useContext} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button, TouchableOpacity, Dimensions } from 'react-native';
//import PantallaPrincipal from './PantallaPrincipal';
import { useNavigation } from '@react-navigation/native';
//import { LineChart, PieChart } from "react-native-chart-kit";
import { AppContext } from '../context/AppContext';

export default function GraficasScreen() {
    
    const navigation = useNavigation();

    const gastos = [
        { categoria: 'comida', porcentaje: 30.77 },
        { categoria: 'transporte', porcentaje: 15.38 },
        { categoria: 'entretenimiento', porcentaje: 11.54 },
        { categoria: 'salud', porcentaje: 7.69 },
        { categoria: 'servicios', porcentaje: 34.62 },
    ];

    const presupuesto = [
        { categoria: 'comida', porcentaje: 16.67 },
        { categoria: 'transporte', porcentaje: 8.33 },
        { categoria: 'entretenimiento', porcentaje: 6.25 },
        { categoria: 'salud', porcentaje: 4.17 },
        { categoria: 'servicios', porcentaje: 18.75 },
        { categoria: 'Presupuesto restante', porcentaje: 45.83 },
    ];

    {/*//Simulacion como placeholder
    useEffect(()=>{
        // Proximamente se remplezará con SELECT * FROM transacciones GROUP BY categoria
        setGastosPorcategoria([
            {categoria: "Comida", total: 450, color: "#ff6b6b", legendFontColor: "#333", legendFontSize: 14},
            {categoria: "Transporte", total: 200, color: "#4dabf7", legendFontColor: "#333", legendFontSize: 14},
            {categoria: "Salud", total: 120, color: "#51cf66", legendFontColor: "#333", legendFontSize: 14},
            {categoria: "Servicios", total: 300, color: "#845ef7", legendFontColor: "#333", legendFontSize: 14},
        ]);

        //Luego se reemplaza con SELECT SUM(monto) WHERE tipo='Ingreso' / 'Gasto' AND fecha LIKE '%2025-10%'
        setIngresosYGastos({ingresos: 3200, gastos: 1700});
    }, []);*/}

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
            <Text style={styles.titulo}>REPORTES</Text>

            {/* Grafica de gastos por categoria 
            <Text style={styles.subtitulo}>Gastos por Categoria</Text>

            {gastosPorcategoria.length > 0 ? (
                <PieChart
                    data={gastosPorcategoria.map(item => ({
                        name: item.name,
                        population: item.total,
                        color: item.color,
                        legendFontColor: "#333",
                        legendFontSize: 14
                    }))}
                    width={Dimensions.get("window").width - 20}
                    height={220}
                    accessor={"population"}
                    backgroundColor={"transparent"}
                    paddingLeft={"10"}
                ></PieChart>
            ) : (
                <Text>No hay datos por mostrar</Text>
            )} */}

            {/* Grafica de ingresos contra gastos del mes 
            <Text style={styles.subtitulo}>Ingresos vs Gastos del Mes</Text>
            <LineChart
                data={{
                    labels: ["ingresos", "Gastos"],
                    datasets: [
                        {
                            data: [ingresosYGastosMes.ingresos, ingresosYGastosMes.gastos]
                        }
                    ]
                }}
                width={Dimensions.get("window").width - 20}
                height={250}
                chartConfig={chartConfig}
                bezier
                style={{borderRadius: 10}}
            ></LineChart> */}

            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Reporte de Gastos</Text>

                <Image
                    source={require('../assets/Grafica1.png')}
                    style={styles.imagenGrafica}
                    resizeMode="contain"
                />

                {gastos.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.textoCategoria}>{item.categoria}</Text>
                        <Text style={styles.textoPorcentaje}>
                            {item.porcentaje.toFixed(2)}%
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Reporte de Presupuesto</Text>

                <Image
                    source={require('../assets/Grafica2.png')}
                    style={styles.imagenGrafica}
                    resizeMode="contain"
                />

                {presupuesto.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.textoCategoria}>{item.categoria}</Text>
                        <Text style={styles.textoPorcentaje}>
                            {item.porcentaje.toFixed(2)}%
                        </Text>
                    </View>
                ))}

            </View>

            <TouchableOpacity style={styles.volverBoton} onPress={()=> navigation.goBack()}>
                <Text style={styles.volverBotonTexto}>Volver al menú</Text>
            </TouchableOpacity>

        </ScrollView>
    );
        
}

{/*const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: () => "#333",
}; */}

const styles = StyleSheet.create({
    
    /* container: { flex: 1, backgroundColor: "#f4f6fb", padding: 15 },
    titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    subtitulo: { fontSize: 18, fontWeight: "600", marginBottom: 10, marginTop: 10 },
    volverBoton: {
        backgroundColor: "#2e7d32",
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 20,
        alignItems: "center"
    },
    volverBotonTexto: { color: "#fff", fontWeight: "bold", fontSize: 15 } */
    
    container: {
        flex: 1,
        backgroundColor: '#f4f6fb',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    seccion: {
        marginBottom: 30,
    },
    subtitulo: {
        fontSize: 16,
        marginBottom: 10,
    },

    imagenGrafica: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textoCategoria: {
        fontSize: 16,
        fontWeight: '600',
    },
    textoPorcentaje: {
        fontSize: 16,
        color: '#555',
    },

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