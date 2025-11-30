import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from "expo-sqlite";

export default function GraficasScreen() {
    const navigation = useNavigation();
    const [db, setDb] = useState(null);
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
    const [ingresosYGastosMes, setIngresosYGastosMes] = useState({ ingresos: 0, gastos: 0 });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        SQLite.openDatabaseAsync("ahorramas_v1.db").then(setDb);
    }, []);

    useEffect(() => {
        if (db) {
            cargarDatos();
        }
    }, [db]);

    async function cargarDatos() {
        try {
            // Obtener mes actual (formato YYYY-MM)
            const ahora = new Date();
            const mesActual = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}`;

            // 1. Gastos agrupados por categoría (solo gastos, no ingresos)
            const gastosCategoria = await db.getAllAsync(`
                SELECT categoria, SUM(monto) as total
                FROM transacciones
                WHERE tipo = 'Gasto'
                GROUP BY categoria
                ORDER BY total DESC
            `);

            // Calcular total de gastos para porcentajes
            const totalGastos = gastosCategoria.reduce((sum, item) => sum + item.total, 0);

            // Preparar datos con porcentajes y colores
            const colores = ['#ff6b6b', '#4dabf7', '#51cf66', '#845ef7', '#fbc02d', '#d32f2f', '#8e24aa'];
            const gastosConPorcentaje = gastosCategoria.map((item, index) => ({
                categoria: item.categoria,
                total: item.total,
                porcentaje: totalGastos > 0 ? (item.total / totalGastos) * 100 : 0,
                color: colores[index % colores.length]
            }));

            setGastosPorCategoria(gastosConPorcentaje);

            // 2. Ingresos y gastos del mes actual
            const ingresosMes = await db.getFirstAsync(`
                SELECT COALESCE(SUM(monto), 0) as total
                FROM transacciones
                WHERE tipo = 'Ingreso' AND fecha LIKE ?
            `, [`${mesActual}%`]);

            const gastosMes = await db.getFirstAsync(`
                SELECT COALESCE(SUM(monto), 0) as total
                FROM transacciones
                WHERE tipo = 'Gasto' AND fecha LIKE ?
            `, [`${mesActual}%`]);

            setIngresosYGastosMes({
                ingresos: ingresosMes?.total || 0,
                gastos: gastosMes?.total || 0
            });

            setCargando(false);
        } catch (error) {
            console.log("Error cargando datos de gráficas:", error);
            setCargando(false);
        }
    }

    // Función para renderizar barra de progreso
    const renderBarraProgreso = (porcentaje, color) => {
        const porcentajeLimitado = Math.min(porcentaje, 100);
        return (
            <View style={styles.barraContainer}>
                <View style={[styles.barraProgreso, { width: `${porcentajeLimitado}%`, backgroundColor: color }]} />
            </View>
        );
    };

    if (cargando) {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Cargando datos...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.titulo}>REPORTES</Text>

            {/* Gráfica 1: Gastos por Categoría */}
            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Gastos por Categoría</Text>

                {gastosPorCategoria.length > 0 ? (
                    <>
                        {gastosPorCategoria.map((item, index) => (
                            <View key={index} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                                    <Text style={styles.textoCategoria}>{item.categoria}</Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.textoMonto}>${item.total.toFixed(2)}</Text>
                                    <Text style={styles.textoPorcentaje}>
                                        {item.porcentaje.toFixed(2)}%
                                    </Text>
                                </View>
                                {renderBarraProgreso(item.porcentaje, item.color)}
                            </View>
                        ))}
                    </>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.textoVacio}>No hay gastos registrados</Text>
                    </View>
                )}
            </View>

            {/* Gráfica 2: Ingresos vs Gastos del Mes */}
            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Ingresos vs Gastos del Mes Actual</Text>

                <View style={styles.comparacionContainer}>
                    <View style={styles.comparacionCard}>
                        <Text style={styles.comparacionLabel}>Ingresos</Text>
                        <Text style={[styles.comparacionMonto, { color: '#2e7d32' }]}>
                            ${ingresosYGastosMes.ingresos.toFixed(2)}
                        </Text>
                        {renderBarraProgreso(
                            ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos > 0
                                ? (ingresosYGastosMes.ingresos / (ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos)) * 100
                                : 0,
                            '#2e7d32'
                        )}
                    </View>

                    <View style={styles.comparacionCard}>
                        <Text style={styles.comparacionLabel}>Gastos</Text>
                        <Text style={[styles.comparacionMonto, { color: '#c62828' }]}>
                            ${ingresosYGastosMes.gastos.toFixed(2)}
                        </Text>
                        {renderBarraProgreso(
                            ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos > 0
                                ? (ingresosYGastosMes.gastos / (ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos)) * 100
                                : 0,
                            '#c62828'
                        )}
                    </View>
                </View>

                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Balance del Mes</Text>
                    <Text style={[
                        styles.balanceMonto,
                        { color: ingresosYGastosMes.ingresos >= ingresosYGastosMes.gastos ? '#2e7d32' : '#c62828' }
                    ]}>
                        ${(ingresosYGastosMes.ingresos - ingresosYGastosMes.gastos).toFixed(2)}
                    </Text>
                </View>
            </View>

            <TouchableOpacity style={styles.volverBoton} onPress={() => navigation.goBack()}>
                <Text style={styles.volverBotonTexto}>Volver al menú</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
        color: '#1b5e20',
    },
    seccion: {
        marginBottom: 30,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    colorIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    textoCategoria: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    textoMonto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    textoPorcentaje: {
        fontSize: 14,
        color: '#777',
    },
    barraContainer: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barraProgreso: {
        height: '100%',
        borderRadius: 4,
    },
    textoVacio: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
    },
    comparacionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    comparacionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    comparacionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    comparacionMonto: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    balanceCard: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    balanceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    balanceMonto: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    volverBoton: {
        backgroundColor: '#2e7d32',
        borderRadius: 10,
        paddingVertical: 12,
        marginTop: 20,
        alignItems: 'center',
    },
    volverBotonTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});