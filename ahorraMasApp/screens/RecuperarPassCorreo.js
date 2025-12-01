import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

const controller = new UsuarioController();

export default function RecuperarPassCorreo({ navigation }) {
    const [correo, setCorreo] = useState("");

    const verificarCorreo = async () => {
        if (!correo.trim()) {
            Alert.alert("Error", "Ingresa un correo");
            return;
        }

        try {
            await controller.initialize();
            const usuarios = await controller.listar();

            const existe = usuarios.find(u => u.correo === correo.trim());

            if (!existe) {
                Alert.alert("Correo no encontrado", "No existe un usuario con ese correo");
                return;
            }

            navigation.navigate("RecuperarPassNueva", { id: existe.id });

        } catch (e) {
            Alert.alert("Error", "No se pudo validar el correo");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Recuperar Contraseña</Text>

            <TextInput
                style={styles.input}
                placeholder="Ingresa tu correo"
                keyboardType="email-address"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.boton} onPress={verificarCorreo}>
                <Text style={styles.botonTexto}>Continuar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.regresar}>Volver al Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 25, backgroundColor: "#F9FAFB" },
    titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
    input: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    boton: {
        backgroundColor: "#2e7d32",
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
    },
    botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    regresar: { marginTop: 20, textAlign: "center", color: "#444" }
});
