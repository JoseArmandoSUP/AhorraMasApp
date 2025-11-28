import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function CambiarPasswordScreen() {
  const { params } = useRoute();
  const nav = useNavigation();
  const correo = params.correo; // viene de la pantalla anterior

  const [password, setPassword] = useState("");
  const [db, setDb] = useState(null);

  useEffect(() => {
    SQLite.openDatabaseAsync("finanzas.db").then(setDb);
  }, []);

  const actualizarPassword = async () => {
    if (!password.trim()) {
      Alert.alert("Error", "Ingrese una nueva contraseña");
      return;
    }

    await db.runAsync(
      "UPDATE usuarios SET password = ? WHERE correo = ?",
      [password, correo]
    );

    Alert.alert("Éxito", "La contraseña ha sido actualizada");
    nav.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva contraseña</Text>

      <TextInput
        placeholder="Escriba la nueva contraseña"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Guardar contraseña" onPress={actualizarPassword} />
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
