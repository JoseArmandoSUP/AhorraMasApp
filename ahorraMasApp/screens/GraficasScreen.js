import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { AppContext } from '../context/AppContext';

export default function GraficasScreen() {
    const navigation = useNavigation();
    const { usuario } = useContext(AuthContext);
    const { transacciones } = useContext(AppContext);
    const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
    const [ingresosYGastosMes, setIngresosYGastosMes] = useState({ ingresos: 0, gastos: 0 });
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        try {
            if (!Array.isArray(transacciones) || !usuario || !usuario.id) {
                setGastosPorCategoria([]);
                setIngresosYGastosMes({ ingresos: 0, gastos: 0 });
                setCargando(false);
                return;
            }

            const now = new Date();
            const mesActual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            const userTrans = transacciones.filter(t => t.usuario_id === usuario.id || t.usuario_id == null);

            const gastos = userTrans.filter(t => t.tipo === 'Gasto');
            const map = {};
            gastos.forEach(t => {
                const cat = t.categoria || 'Sin categoría';
                const monto = Number(t.monto) || 0;
                map[cat] = (map[cat] || 0) + monto;
            });

            const totalGastos = Object.values(map).reduce((s, v) => s + v, 0);
            const colores = ['#ff6b6b', '#4dabf7', '#51cf66', '#845ef7', '#fbc02d', '#d32f2f', '#8e24aa'];

            const gastosConPorcentaje = Object.keys(map)
                .map((cat, idx) => ({
                    categoria: cat,
                    total: map[cat],
                    porcentaje: totalGastos > 0 ? (map[cat] / totalGastos) * 100 : 0,
                    color: colores[idx % colores.length]
                }))
                .sort((a, b) => b.total - a.total);

            const ingresosMesTotal = userTrans
                .filter(t => t.tipo === 'Ingreso' && String(t.fecha || '').startsWith(mesActual))
                .reduce((s, t) => s + (Number(t.monto) || 0), 0);

            const gastosMesTotal = userTrans
                .filter(t => t.tipo === 'Gasto' && String(t.fecha || '').startsWith(mesActual))
                .reduce((s, t) => s + (Number(t.monto) || 0), 0);

            setGastosPorCategoria(gastosConPorcentaje);
            setIngresosYGastosMes({
                ingresos: Number(ingresosMesTotal) || 0,
                gastos: Number(gastosMesTotal) || 0
            });

            setCargando(false);
        } catch (err) {
            console.log('Error calculando gráficas:', err);
            setGastosPorCategoria([]);
            setIngresosYGastosMes({ ingresos: 0, gastos: 0 });
            setCargando(false);
        }
    }, [transacciones, usuario]);

    const renderBarraProgreso = (porcentaje, color) => {
        const valor = Number(porcentaje) || 0;
        const porcentajeLimitado = Math.min(valor, 100);

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

    const balance =
        (Number(ingresosYGastosMes.ingresos) || 0) -
        (Number(ingresosYGastosMes.gastos) || 0);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.titulo}>REPORTES</Text>

            {/* Gastos por Categoría */}
            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Gastos por Categoría</Text>

                {gastosPorCategoria.length > 0 ? (
                    gastosPorCategoria.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />
                                <Text style={styles.textoCategoria}>{item.categoria}</Text>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={styles.textoMonto}>${(Number(item.total) || 0).toFixed(2)}</Text>
                                <Text style={styles.textoPorcentaje}>
                                    {(Number(item.porcentaje) || 0).toFixed(2)}%
                                </Text>
                            </View>

                            {renderBarraProgreso(Number(item.porcentaje) || 0, item.color)}
                        </View>
                    ))
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.textoVacio}>No hay gastos registrados</Text>
                    </View>
                )}
            </View>

            {/* Ingresos vs Gastos */}
            <View style={styles.seccion}>
                <Text style={styles.subtitulo}>Ingresos vs Gastos del Mes Actual</Text>

                <View style={styles.comparacionContainer}>
                    <View style={styles.comparacionCard}>
                        <Text style={styles.comparacionLabel}>Ingresos</Text>
                        <Text style={[styles.comparacionMonto, { color: '#2e7d32' }]}>
                            ${(Number(ingresosYGastosMes.ingresos) || 0).toFixed(2)}
                        </Text>
                        {renderBarraProgreso(
                            ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos > 0
                                ? (Number(ingresosYGastosMes.ingresos) /
                                  (ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos)) * 100
                                : 0,
                            '#2e7d32'
                        )}
                    </View>

                    <View style={styles.comparacionCard}>
                        <Text style={styles.comparacionLabel}>Gastos</Text>
                        <Text style={[styles.comparacionMonto, { color: '#c62828' }]}>
                            ${(Number(ingresosYGastosMes.gastos) || 0).toFixed(2)}
                        </Text>
                        {renderBarraProgreso(
                            ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos > 0
                                ? (Number(ingresosYGastosMes.gastos) /
                                  (ingresosYGastosMes.ingresos + ingresosYGastosMes.gastos)) * 100
                                : 0,
                            '#c62828'
                        )}
                    </View>
                </View>

                {/* BALANCE */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Balance del Mes</Text>
                    <Text
                        style={[
                            styles.balanceMonto,
                            { color: balance >= 0 ? '#2e7d32' : '#c62828' }
                        ]}
                    >
                        ${balance.toFixed(2)}
                    </Text>
                </View>
            </View>

           
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
