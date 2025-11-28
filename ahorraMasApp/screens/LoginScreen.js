import { Text, StyleSheet, View, Button, TextInput, Image, ScrollView, Alert, Switch } from "react-native";
import React, { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {

  const nav = useNavigation();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [db, setDb] = useState(null);

  // Abrir DB al iniciar
  useEffect(() => {
    abrirDB();
  }, []);

  const abrirDB = async () => {
    const database = await SQLite.openDatabaseAsync("finanzas.db");
    setDb(database);
  };

  const iniciarSesion = async () => {
    if (!correo.trim() || !password.trim()) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    const validarCorreo = /^[\w.%+-]+@gmail\.com$/;
    if (!validarCorreo.test(correo)) {
      Alert.alert("Correo inválido", "Debe ser correo Gmail");
      return;
    }

    try {
      const result = await db.getFirstAsync(
        "SELECT * FROM usuarios WHERE correo = ?",
        [correo]
      );

      if (!result) {
        Alert.alert("No encontrado", "No existe una cuenta con ese correo");
        return;
      }

      if (result.password !== password) {
        Alert.alert("Contraseña incorrecta", "Intente de nuevo");
        return;
      }

      Alert.alert("Bienvenido", `Hola ${result.nombre}`);
      nav.replace("Home");

    } catch (err) {
      Alert.alert("Error inesperado", "No se pudo validar el usuario");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.container}>
        <Image source={require("../assets/Logo.png")} />

        <Text style={styles.text}>Iniciemos Sesión..!</Text>
        <Text style={styles.text2}>Accede a tu cuenta</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="INICIAR SESIÓN" onPress={iniciarSesion} />

        <Text>¿No tienes cuenta?</Text>

        <Button title="Registrarse" onPress={() => nav.navigate("Registro")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F9FF",
  },
  text: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 30,
  },
  text2: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  input: {
    width: "80%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "white",
    marginTop: 20,
    marginBottom: 20,
    color: "#000",
  },
});
