import React,{useState} from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import PantallaPrincipal from './PantallaPrincipal';

export default function GraficasScreen() {
    
    const[screen, setScreen]=useState('menu');

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

    switch(screen){
        case 'pantallaPrincipal':
            return<PantallaPrincipal></PantallaPrincipal>
        case 'menu':
            default:
                return (
                    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
                        <Text style={styles.titulo}>REPORTES</Text>

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

                        <Button onPress={()=> setScreen('pantallaPrincipal')} title="Volver al menú"></Button>
                    </ScrollView>
                );
    }    
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
});