import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LineChart, BarChart } from "react-native-chart-kit";
import { TransaccionController } from '../controllers/TransaccionController';

const transaccionController = new TransaccionController();

export default function GraficasScreen() {
    
    const navigation = useNavigation();

    const [gastosPorcategoria, setGastosPorcategoria] = useState([]);
    const [ingresosPorcategoria, setIngresosPorcategoria] = useState([]);
    const [ingresosYGastosMes, setIngresosYGastos] = useState({ ingresos:0, gastos:0 });

    const cargarDatos = async () => {
        try{
            await transaccionController.initialize();

            const transacciones = await transaccionController.listar();

            calcularGastosPorCategoria(transacciones);
            calcularIngresosPorCategoria(transacciones);
            calcularIngresosYGastosMes(transacciones);

        }catch(error){
            console.log("Error cargando datos en graficas: ", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            cargarDatos();
        }, [])
    );

    function calcularGastosPorCategoria(transacciones){
        const mapa = {};

        transacciones.forEach(t => {
            if(t.tipo === "Gasto"){
                const cat = t.categoria;
                if(!mapa[cat]) mapa[cat] = 0;
                mapa[cat] += Number(t.monto);
            }
        });

        const lista = Object.keys(mapa).map(cat => ({
            categoria: cat,
            total: mapa[cat]
        }));

        setGastosPorcategoria(lista);
    }

    function calcularIngresosPorCategoria(transacciones){
        const mapa = {};

        transacciones.forEach(t => {
            if(t.tipo === "Ingreso"){
                const cat = t.categoria;
                if(!mapa[cat]) mapa[cat] = 0;
                mapa[cat] += Number(t.monto);
            }
        });

        const lista = Object.keys(mapa).map(cat => ({
            categoria: cat,
            total: mapa[cat]
        }));

        setIngresosPorcategoria(lista);
    }

    function calcularIngresosYGastosMes(transacciones){
        const hoy = new Date();
        const mesActual = hoy.getMonth() + 1;
        const anioActual = hoy.getFullYear();

        let ingresos = 0;
        let gastos = 0;
        
        transacciones.forEach(t => {
            const fecha = new Date(t.fecha);
            const mesT = fecha.getMonth() + 1;
            const anioT = fecha.getFullYear();

            if(mesT === mesActual && anioT === anioActual){
                if(t.tipo === "Ingreso") ingresos += Number(t.monto);
                if(t.tipo === "Gasto") gastos += Number(t.monto);
            }
        });

        setIngresosYGastos({ ingresos, gastos });
    }

    const chartWidth = Math.round(Dimensions.get("window").width) - 20;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>

            <Text style={styles.titulo}>REPORTES</Text>

            <Text style={styles.subtitulo1}>Gastos por Categoría</Text>

            {gastosPorcategoria.length > 0 ? (
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
            ) : (
                <Text style={{textAlign: "center", color: "#777"}}>No hay registros</Text>
            )}

            {gastosPorcategoria.map((item, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.textoCategoria}>{item.categoria}</Text>
                    <Text style={styles.textoPorcentaje}>${item.total}</Text>
                </View>
            ))}

            <Text style={styles.subtitulo2}>Ingresos por Categoría</Text>

            {ingresosPorcategoria.length > 0 ? (
                <BarChart
                    data={{
                        labels: ingresosPorcategoria.map(i => i.categoria),
                        datasets: [{ data: ingresosPorcategoria.map(i => i.total) }]
                    }}
                    width={chartWidth}
                    height={220}
                    fromZero={true}
                    showValuesOnTopOfBars={true}
                    withInnerLines={false}
                    chartConfig={simpleChartConfig}
                    style={{ borderRadius: 10 }}
                />
            ) : (
                <Text style={{textAlign: "center", color: "#777"}}>No hay registros</Text>
            )}

            {ingresosPorcategoria.map((item, index) => (
                <View key={index} style={styles.card}>
                    <Text style={styles.textoCategoria}>{item.categoria}</Text>
                    <Text style={styles.textoPorcentaje}>${item.total}</Text>
                </View>
            ))}

            <Text style={styles.subtitulo3}>Ingresos vs Gastos del mes actual</Text>

            <BarChart
                data={{
                    labels: ["Ingresos", "Gastos"],
                    datasets: [
                        { data: [ingresosYGastosMes.ingresos, ingresosYGastosMes.gastos] }
                    ]
                }}
                width={chartWidth}
                height={220}
                fromZero={true}
                showValuesOnTopOfBars={true}
                withInnerLines={false}
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
    propsForBackgroundLines: { strokeWidth: 0 },
};

const styles = StyleSheet.create({
    container:{ flex: 1, backgroundColor: "#f4f6fb", padding: 15 },
    titulo:{ 
        fontSize: 24, 
        fontWeight: "bold", 
        textAlign: "center", 
        marginBottom: 20 
    },
    subtitulo1:{ 
        fontSize: 18, 
        fontWeight: "600", 
        marginBottom: 10, 
        marginTop: 10, 
        color: "#ce1111ff",
    },
    subtitulo2:{ 
        fontSize: 18, 
        fontWeight: "600", 
        marginBottom: 10, 
        marginTop: 10, 
        color: "#1163ceff",
    },
    subtitulo3:{ 
        fontSize: 18, 
        fontWeight: "600", 
        marginBottom: 10, 
        marginTop: 10, 
        color: "#11ce86ff",
    },
    card: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6
    },
    textoCategoria:{ 
        fontSize: 16, 
        fontWeight: "600" 
    },
    textoPorcentaje:{ 
        fontSize: 16, 
        color: "#444" 
    },
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
