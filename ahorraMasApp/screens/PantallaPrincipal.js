import React, { useContext, useEffect, useState, useCallback} from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, ImageBackground, Animated, Easing, Image } from 'react-native'
import { Button } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
//Notificaciones
import { AppContext } from "../context/AppContext";
import { TransaccionController } from '../controllers/TransaccionController';
import { PresupuestoController } from "../controllers/PresupuestoController";

const presupuestoController = new PresupuestoController();
const controller = new TransaccionController();

export default function PantallaPrincipal(){
    
    //Para la animacion de la pantalla de carga
    const[cargando, setCargando] = useState(true);
    const desvanecido = new Animated.Value(1);
    
    //Para Navigation
    const navigation = useNavigation();
    
    //Para las notificaciones de ecceso del presupuesto
    const { alertas, setTransacciones } = useContext(AppContext);

    //Para el total de Gastos e Ingresos
    const[totalGastos, setTotalGastos] = useState(0);
    const[totalIngresos, setTotalIngresos] = useState(0);

    const[lista, setLista] = useState([]);

    //Carga las Transacciones y calcula totales
    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                await controller.initialize();
                const data = await controller.listar();

                setTransacciones(data);

                let gastos = 0;
                let ingresos = 0;

                data.forEach(t => {
                    if(t.tipo.toLowerCase() === "gasto") gastos += Number(t.monto);
                    if(t.tipo.toLowerCase() === "ingreso") ingresos += Number(t.monto);
                });

                setTotalGastos(gastos);
                setTotalIngresos(ingresos);
            };
            load();
        }, [])
    );

    //Resumen de Presupuestos
    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                try{
                    await presupuestoController.initialize();
                    await controller.initialize();

                    const presupuestosDB = await presupuestoController.listar();
                    const transDB = await controller.listar();

                    setTransacciones(transDB);

                    //Total gastado en cada presupuesto
                    const calculados = presupuestosDB.map(p => {
                        const gastado = transDB.filter(
                            t => t.tipo === "Gasto" && t.categoria.toLowerCase() === p.categoria.toLowerCase()
                        )
                        .reduce((sum, t) => sum + Number(t.monto), 0);
                        return{
                            ...p,
                            gastado,
                            color: "#2e7d32"
                        };
                    });

                    setLista(calculados)
                }catch(error){
                    console.log("Error cargando presupuestos: ", error);
                }
            };
            cargarDatos();
        },[])
    );

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
        <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
        
            {/*ENCABEZADO*/}
            <Text style={styles.titulo}>AHORRA +</Text>
            <Image style={styles.logo}
                source={require('../assets/Logo.png')}
            />

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
            
            {/*CONTENEDOR DE GASTOS E INGRESOS*/}
            <View style={styles.todoContainer}>
                
                <View style={styles.todoCajas}>
                    <Text style={styles.todoLabel1}>GASTOS</Text>
                    <Text style={styles.todoAmount}>${totalGastos}</Text>
                    {/*<Ionicons>*/}
                </View>
    
                <View style={styles.todoCajas}>
                    <Text style={styles.todoLabel2}>INGRESOS</Text>
                    <Text style={styles.todoAmount}>${totalIngresos}</Text>
                    {/*<Ionicons>*/}
                </View>
    
            </View>

            {lista.length === 0 && (
                <Text style={{textAlign: "center", marginTop: 10, color: "#666"}}>
                    No hay presupuestos, registre uno para visalizar el resumen aqui
                </Text>
            )}
            
            {lista.map(item=>{
                const porcentaje = Math.min(Math.round((item.gastado / item.montolimite)*100), 100);
                return(
                    
                    <View key={item.id} style={styles.tarjeta}>
                    
                        <View style={styles.fila}>
                            
                            <Text style={[styles.categoria, {color: item.color}]}>
                                {item.categoria} -- {item.mes} / {item.anio}
                            </Text>

                            <Text style={styles.cantidad}>
                                ${item.gastado} / ${item.montolimite}
                            </Text>

                        </View>

                        <View style={styles.progresoBarra}>
                            <View 
                                style={[styles.llenarProgreso, {width: `${porcentaje}%`, backgroundColor: item.color},]}
                            ></View>
                        </View>

                        <Text style={styles.porcentaje}>{porcentaje}% del presupuesto usado</Text>

                    </View>
                    
                );
            })}
    
            {/*BOTONES PRINCIPALES
            <View style={styles.botonesContainer}>
    
                <TouchableOpacity style={styles.boton} onPress={()=>navigation.navigate("Transacciones")}>
                    
                    <Text style={styles.botonText}>Transacciones</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.boton} onPress={()=>navigation.navigate("Presupuestos")}>
            
                    <Text style={styles.botonText}>Presupuesto Mensual</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.boton} onPress={()=>navigation.navigate("Graficas")}>
                    <Ionicons>*
                    <Text style={styles.botonText}>Ver Graficas</Text>
                </TouchableOpacity>
    
                <TouchableOpacity style={styles.boton} onPress={()=>navigation.navigate("Perfil")}>
                    <Ionicons>*
                    <Text style={styles.botonText}>Configuración de Perfil</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.loginBoton} onPress={()=> navigation.navigate("Login")}>
                    <Text style={styles.loginBotonTexto}>Iniciar Sesion</Text>
                </TouchableOpacity>

            </View>*/}
    
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

    todoLabel1:{
        fontSize: 14,
        fontWeight: '600',
        color: '#c20a0aff',
    },

    todoLabel2:{
        fontSize: 14,
        fontWeight: '600',
        color: '#1f4de4ff',
    },

    todoAmount:{
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#333',
    },

    botonesContainer:{
        marginTop: 10,
    },

    boton:{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    botonText:{
        margin: 10,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        fontWeight: "bold",
    },

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

    loginBoton:{
        backgroundColor: '#2e7d32',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    loginBotonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
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
});