import React, { useContext, useEffect, useState} from "react";
import { Text, StyleSheet, View, ScrollView, ImageBackground, Animated, Easing, Image } from 'react-native'
//import TransaccionesScreem from './PantallaGestionTransacciones';
//import PantallaRegistro from "./PantallaRegistro";
//import PantallaPresupuesto from "./PresupuestosScreen";
//import LoginScreen from "./LoginScreen";
//import GraficasScreen from "./GraficasScreen";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";

export default function PantallaPrincipal(){
    
    //Para la animacion de la pantalla de carga
    const[cargando, setCargando] = useState(true);
    const desvanecido = new Animated.Value(1);
    // navegación no necesaria aquí (solo tarjetas)
    //Para las notificaciones de exceso del presupuesto y transacciones
    const { alertas, transacciones } = useContext(AppContext);

    // Totales del mes
    const [gastosMes, setGastosMes] = useState(0);
    const [ingresosMes, setIngresosMes] = useState(0);
    const [balanceMes, setBalanceMes] = useState(0);

    useEffect(()=>{
        const timer=setTimeout(()=>{
            Animated.timing(desvanecido,{
                toValue: 0,
                duration: 1000,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true
            }).start(()=> setCargando(false));
        }, 2000);
        return()=>clearTimeout(timer);
    },[]);

    // Calcular totales mensuales cuando cambien las transacciones
    useEffect(() => {
        try {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const gastos = transacciones
                .filter(t => {
                    if (!t.fecha) return false;
                    const d = new Date(t.fecha);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.tipo === 'Gasto';
                })
                .reduce((s, t) => s + Number(t.monto || 0), 0);

            const ingresos = transacciones
                .filter(t => {
                    if (!t.fecha) return false;
                    const d = new Date(t.fecha);
                    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.tipo === 'Ingreso';
                })
                .reduce((s, t) => s + Number(t.monto || 0), 0);

            setGastosMes(gastos);
            setIngresosMes(ingresos);
            setBalanceMes(ingresos - gastos);
        } catch (err) {
            console.log('Error calculando totales del mes:', err);
            setGastosMes(0);
            setIngresosMes(0);
            setBalanceMes(0);
        }
    }, [transacciones]);

    if(cargando){
        return(
            <Animated.View style={[styles.splashContainer, {opacity: desvanecido}]}>
                <ImageBackground
                    source={require('../assets/PantallaCarga_page-0002.png')}
                    resizeMode='cover'
                    style={styles.splashImagen}
                >
                    <Text style={styles.splashText}>Ahorra más, vive mejor</Text>
                </ImageBackground>
            </Animated.View>
        );
    }

    
    return(
        <ScrollView style={styles.container}>
        
            {/*ENCABEZADO*/}
            <Text style={styles.titulo}>AHORRA +</Text>
            <Image style={styles.logo}
                source={require('../assets/Logo.png')}
            />

            {/* Alertas de presupuesto */}
            {alertas.length > 0 && (
                <View style={styles.alertContainer}>
                    {alertas.map((a, index) => (
                        <Text key={index} style={styles.alertText}>{a}</Text>
                    ))}
                </View>
            )}

            {/* TARJETAS RESUMEN */}
            <View style={styles.cardsRow}>
                <View style={[styles.card, styles.cardLeft]}>
                    <Text style={styles.cardLabel}>Gastos mes</Text>
                    <Text style={styles.cardValue}>${gastosMes.toFixed(2)}</Text>
                </View>

                <View style={[styles.card, styles.cardRight]}>
                    <Text style={styles.cardLabel}>Ingresos mes</Text>
                    <Text style={styles.cardValue}>${ingresosMes.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.cardLabel}>Balance</Text>
                <Text style={[styles.cardValue, {color: balanceMes < 0 ? '#c62828' : '#2e7d32'}]}>${balanceMes.toFixed(2)}</Text>
            </View>

            {/* Sólo tarjetas y alertas — sin botones de navegación */}
    
        </ScrollView>
    );
     
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 70,
        paddingHorizontal: 25,
    },

    logo: {
        height: 100,
        width: 100,
        alignSelf: 'center',
        marginBottom: 20,
    }, 

    titulo:{
        fontSize: 30,
        fontWeight: 'bold',
        color: '#2e7d32',
        textAlign: 'center',
        marginBottom: 25,
    },

    todoContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },

    todoCajas:{
        backgroundColor: '#fff',
        width: '47%',
        borderRadius: 15,
        paddingVertical: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    todoLabel:{
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },

    todoAmount:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#333',
    },

    /* botones antiguos eliminados */

    //Estilos imagen de carga
    splashContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },

    splashImagen:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },

    splashText:{
        position: 'absolute',
        bottom: 100,
        fontSize: 20,
        color: 'white',
    },

    /* estilos de login eliminados */

    alertContainer: {
        backgroundColor: '#fff6f6',
        padding: 10,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f5c6c6'
    },
    alertText: { color: '#900', fontWeight: '700' },

    cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    card: { backgroundColor: '#fff', width: '48%', borderRadius: 12, padding: 16, elevation: 3 },
    cardLeft: {},
    cardRight: {},
    cardLabel: { color: '#666', fontSize: 14, fontWeight: '600' },
    cardValue: { fontSize: 22, fontWeight: '800', marginTop: 6 },

    balanceCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, elevation: 3, marginBottom: 16 },

    /* botones de navegación pequeños eliminados */

});