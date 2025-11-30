import { Text, StyleSheet, View, Button, ScrollView, TextInput, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { initDB, getDB } from "../src/db";  // IMPORTACIÓN CORRECTA

export default function PantallaRegistro() {
  const nav = useNavigation();

  const [db, setDb] = useState(null);

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [edad, setEdad] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");

  // Inicializa la BD una sola vez
  useEffect(() => {
    const loadDB = async () => {
      await initDB();          // crea las tablas
      const database = getDB(); // obtiene la conexión
      setDb(database);
    };

    loadDB();
  }, []);

  // Valida que no falten campos
  const validarCampos = () => {
    return (
      nombre.trim() &&
      usuario.trim() &&
      edad.trim() &&
      correo.trim() &&
      telefono.trim() &&
      password.trim()
    );
  };

  // Solo Gmail válido
  const esCorreoValido = () => /^[\w.%+-]+@gmail\.com$/.test(correo);

  const registrarUsuario = async () => {
    if (!db) {
      Alert.alert("Error", "Base de datos no lista");
      return;
    }

    if (!validarCampos()) {
      Alert.alert("Campos vacíos", "Por favor completa todos los campos.");
      return;
    }

    if (!esCorreoValido()) {
      Alert.alert("Correo inválido", "El correo debe ser @gmail.com");
      return;
    }

    try {
      await db.runAsync(
        "INSERT INTO usuarios (nombre, usuario, edad, correo, telefono, password) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, usuario, edad, correo, telefono, password]
      );

      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente", [
        { text: "OK", onPress: () => nav.replace("Login") },
      ]);

    } catch (error) {
      console.log("Error registrando usuario:", error);
      Alert.alert("Error", "El correo ya está registrado");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/Logo.png")} />

        <Text style={styles.text}>REGÍSTRATE</Text>
        <Text style={styles.text2}>Completa la información para crear tu cuenta</Text>

        <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Usuario" value={usuario} onChangeText={setUsuario} />
        <TextInput style={styles.input} placeholder="Edad" keyboardType="numeric" value={edad} onChangeText={(txt) => setEdad(txt.replace(/[^0-9]/g, ""))} />
        <TextInput style={styles.input} placeholder="Correo Gmail" value={correo} onChangeText={setCorreo} />
        <TextInput style={styles.input} placeholder="Teléfono" keyboardType="numeric" value={telefono} onChangeText={(txt) => setTelefono(txt.replace(/[^0-9]/g, ""))} />
        <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={password} onChangeText={setPassword} />

        <Button title="Registrarse" color="blue" onPress={registrarUsuario} />
        <Button title="Volver al Login" onPress={() => nav.navigate("Login")} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F9FF" },
  text: { alignSelf: "flex-start", marginLeft: 20, fontWeight: "bold", fontSize: 30 },
  text2: { alignSelf: "flex-start", marginLeft: 20 },
  input: { width: "80%", borderWidth: 2, borderColor: "white", borderRadius: 10, padding: 20, backgroundColor: "white", marginTop: 20, marginBottom: 20 },
  logo: { height: 250, width: 250 },
});
