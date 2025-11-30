import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { initDB, getDB } from "../src/db";
import { useNavigation } from "@react-navigation/native";

export default function RecuperarPasswordScreen() {
  const nav = useNavigation();
  const [correo, setCorreo] = useState("");
  const [db, setDb] = useState(null);

  useEffect(() => {
    const abrirDB = async () => {
      try {
        const database = await initDB();
        setDb(database);
      } catch (error) {
        console.log("Error inicializando BD en RecuperarPassword:", error);
      }
    };
    abrirDB();
  }, []);

  const verificarCorreo = async () => {
    if (!correo.trim()) {
      Alert.alert("Error", "Ingrese un correo");
      return;
    }

    const result = await db.getAllAsync(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (result.length === 0) {
      Alert.alert("Correo no encontrado", "Verifique el correo ingresado");
    } else {
      Alert.alert("Correo encontrado", "Ahora cambie su contraseña");
      nav.navigate("CambiarPassword", { correo });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar contraseña</Text>

      <TextInput
        placeholder="Correo registrado"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
      />

      <Button title="Verificar correo" onPress={verificarCorreo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
});
