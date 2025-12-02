import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Button, TextInput, Alert } from "react-native";
import React, {useState, useEffect, useContext} from "react";
//import PresupuestosScreen from "./PresupuestosScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PresupuestoController } from "../controllers/PresupuestoController";
import { AppContext } from "../context/AppContext";

const controller = new PresupuestoController();

export default function EditarPresupuesto({/*{route}*/}){
    const navigatation = useNavigation();
    const route = useRoute();
    const {id} = route.params;

    const{transacciones, setAlertas} = useContext(AppContext) || {};

    {/* const {categoria: cat, monto: mon} = route.params; */}
    const[categoria, setCategoria] = useState(""); {/* useState(cat) */}
    const[montolimite, setMontolimite] = useState(""); {/* useState(mont) */}
    const[mes, setMes] = useState("");
    const[anio, setAnio] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                await controller.initialize();
                const lista = await controller.listar();
                const encontrado = lista.find(p => p.id === id);

                if (!encontrado) {
                    Alert.alert("Error", "Presupuesto no encontrado");
                    navigatation.goBack();
                    return;
                }

                setCategoria(encontrado.categoria);
                setMontolimite(String(encontrado.montolimite));
                setMes(String(encontrado.mes));
                setAnio(String(encontrado.anio));
            } catch (error) {
                console.log("Error al cargar presupuesto:", error);
            }
        };
        cargar();
    }, []);

    async function alertaAgregar() {
        try {
            if (!categoria || !montolimite || !mes || !anio) {
                Alert.alert("Campos incompletos");
                return;
            }

            await controller.actualizar(
                id,
                categoria.trim(),
                Number(montolimite),
                Number(mes),
                Number(anio)
            );

            recalcularAlertas(Number(montolimite), categoria);

            Alert.alert("Éxito", "Presupuesto actualizado correctamente");
            navigatation.goBack();

        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar: " + error.message);
        }
    }
    
    function recalcularAlertas(nuevoMontoLimite, categoria) {
        let totalGastado = 0;

        transacciones.forEach(t => {
            if (t.tipo.toLowerCase() === "gasto" && t.categoria.toLowerCase() === categoria.toLowerCase()) {
                totalGastado += Number(t.monto);
            }
        });

        // Si el contexto no tiene setAlertas, solo salimos sin romper nada
        if (!setAlertas) {
            return;
        }

        if (totalGastado > nuevoMontoLimite) {
            setAlertas(prev => {
                if (!prev.includes(`¡¡!! Se ha excedido el presupuesto de ${categoria}`)) {
                    return [...prev, `¡¡!! Se ha excedido el presupuesto de ${categoria}`];
                }
                return prev;
            });
        } else {
            setAlertas(prev =>
                prev.filter(a => !a.includes(`presupuesto de ${categoria}`))
            );
        }
    }



    const filtrarCaracteresM = (input) => {
        const numerico = input.replace(/[^0-9]/g, '');
        setMontolimite(numerico);
    };

    return(
        <ScrollView style={styles.container}>

            <Text style={styles.titulo}>EDITAR PRESUPUESTO</Text>

            <View style={styles.formulaioContainer}>

                <Text style={styles.label}>Categoría</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Comida"
                    placeholderTextColor="#999"
                    value={categoria}
                    onChangeText={setCategoria}
                ></TextInput>

                <Text style={styles.label}>Monto Límite</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Ejemplo: $500"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                    value={montolimite}
                    onChangeText={filtrarCaracteresM}
                ></TextInput>

                <View style={styles.definirColumna}>
                    <Text style={styles.definirLabel}>Mes:</Text>
                    <View style={styles.definirInput}>
                        <TextInput
                            keyboardType="numeric"
                            maxLength={2}
                            style={styles.input} 
                            placeholder="1 - 12"
                            value={mes}
                            onChangeText={setMes}
                        ></TextInput>
                    </View>
                </View>

                <View style={styles.definirColumna}>
                    <Text style={styles.definirLabel}>Año:</Text>
                    <View style={styles.definirInput}>
                        <TextInput
                            keyboardType="numeric"
                            maxLength={4}
                            style={styles.input} 
                            value={anio}
                            onChangeText={setAnio}
                        ></TextInput>
                    </View>
                </View>
                

                <TouchableOpacity style={styles.definirBoton} onPress={alertaAgregar}>
                    <Text style={styles.definirBotonTexto}>Editar Presupuesto</Text>
                </TouchableOpacity>

            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.volverBoton} onPress={()=>navigatation.goBack()}>
                    <Text style={styles.volverBotonTexto}>Volver al menú de Presupuestos</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#F9FAFB",
        paddingTop: 70,
        paddingHorizontal: 25,
    },

    titulo:{
        fontSize: 22,
        fontWeight: 'bold',
        color: "#1b5e20",
        textAlign: "center",
        marginBottom: 25,
    },

    formulaioContainer:{
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 30,
    },

    label:{
        fontSize: 15,
        color: "#333",
        marginBottom: 6,
        fontWeight: "600",
    },

    input:{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
        fontSize: 15,
        color: "#000",
    },

    btnContainer:{
        marginTop: 10,
        alignItems: "center",
    },

    definirBoton:{
        backgroundColor: '#2e7d32',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 5,
        alignItems: 'center',
    },

    definirBotonTexto:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },

    volverBoton: {
        backgroundColor: "#999",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 15,
    },

    volverBotonTexto: {
        color: "#fff",
        fontWeight: "bold",
    },
});