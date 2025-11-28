import React,{ useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from "react-native-chart-kit";

export default function GraficasScreen() {
    
    const navigation = useNavigation();

    const [gastosPorcategoria, setGastosPorcategoria] = useState([]);
    const [ingresosYGastosMes, setIngresosYGastos] = useState({ingresos:0, gastos:0});

    useEffect(()=>{
        setGastosPorcategoria([
            {categoria: "Comida", total: 450},
            {categoria: "Transporte", total: 200},
            {categoria: "Salud", total: 120},
            {categoria: "Servicios", total: 300},
        ]);

        setIngresosYGastos({ingresos: 3200, gastos: 1700});
    }, []);

    const chartWidth = Math.round(Dimensions.get("window").width) - 20;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
            <Text style={styles.titulo}>REPORTES</Text>

            <Text style={styles.subtitulo}>Gastos por Categoría</Text>

            <BarChart
                data={{
                    labels: gastosPorcategoria.map(i => i.categoria),
                    datasets: [{ data: gastosPorcategoria.map(i => i.total) }]
                }}
                width={chartWidth}
                height={220}
                fromZero={true}
                showValuesOnTopOfBars={true}
                withInnerLines={false}
                chartConfig={simpleChartConfig}
                style={{ borderRadius: 10 }}
            />

            <View>
                {gastosPorcategoria.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.textoCategoria}>{item.categoria}</Text>
                        <Text style={styles.textoPorcentaje}>${item.total}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.subtitulo}>Ingresos vs Gastos</Text>

            <LineChart
                data={{
                    labels: ["Ingresos", "Gastos"],
                    datasets: [
                        { data: [ingresosYGastosMes.ingresos, ingresosYGastosMes.gastos] }
                    ]
                }}
                width={chartWidth}
                height={220}
                withInnerLines={false}
                withShadow={false}
                withDots={false}
                chartConfig={simpleChartConfig}
                bezier
                style={{ borderRadius: 10 }}
            />

            <TouchableOpacity style={styles.volverBoton} onPress={()=> navigation.goBack()}>
                <Text style={styles.volverBotonTexto}>Volver al menú</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const simpleChartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: () => "#2e7d32",
    labelColor: () => "#444",
    propsForBackgroundLines: { strokeWidth: 0 }, // Quitar líneas de fondo
};

const styles = StyleSheet.create({
    container:{ flex: 1, backgroundColor: "#f4f6fb", padding: 15 },
    titulo:{ 
        fontSize: 24, 
        fontWeight: "bold", 
        textAlign: "center", 
        marginBottom: 20 
    },
    subtitulo:{ 
        fontSize: 18, 
        fontWeight: "600", 
        marginBottom: 10, 
        marginTop: 10 
    },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6
    },
    textoCategoria: { fontSize: 16, fontWeight: "600" },
    textoPorcentaje: { fontSize: 16, color: "#444" },
    volverBoton:{
        backgroundColor: "#2e7d32",
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 20,
        alignItems: "center"
    },
    volverBotonTexto:{ 
        color: "#fff", 
        fontWeight: "bold", 
        fontSize: 15 
    },
});