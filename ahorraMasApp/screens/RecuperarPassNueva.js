import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { UsuarioController } from "../controllers/UsuarioController";

const controller = new UsuarioController();

export default function RecuperarPassNueva({ route, navigation }) {
    const { id } = route.params;
    const [pass, setPass] = useState("");
    const [pass2, setPass2] = useState("");

    const cambiarContrasena = async () => {
        if (!pass.trim() || !pass2.trim()) {
            Alert.alert("Error", "Llena todos los campos");
            return;
        }

        if (pass !== pass2) {
            Alert.alert("Error", "Las contraseñas no coinciden");
            return;
        }

        try {
            await controller.initialize();
            await controller.actualizarPassword(id, pass);

            Alert.alert("Cambio de contraseña", "Contraseña actualizada con éxito");
            navigation.navigate("Login");

        } catch (e) {
            Alert.alert("Error", "No se pudo actualizar la contraseña");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Nueva Contraseña</Text>

            <TextInput
                placeholder="Nueva contraseña"
                style={styles.input}
                onChangeText={setPass}
                value={pass}
            />

            <TextInput
                placeholder="Confirmar contraseña"
                style={styles.input}
                onChangeText={setPass2}
                value={pass2}
            />

            <TouchableOpacity style={styles.boton} onPress={cambiarContrasena}>
                <Text style={styles.botonTexto}>Guardar</Text>
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
});
