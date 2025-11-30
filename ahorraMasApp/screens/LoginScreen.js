import { Text, StyleSheet, View, Button, TextInput, Image, ScrollView, Alert, Switch } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { initDB, getDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen() {

  const nav = useNavigation();
  const { setUsuario } = useContext(AuthContext);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [db, setDb] = useState(null);

  // Inicializar BD usando el mismo método que el registro
  useEffect(() => {
    const abrirDB = async () => {
      try {
        // initDB() ahora retorna la base de datos directamente
        const database = await initDB();
        if (database) {
          setDb(database);
        } else {
          console.log("Error: initDB no retornó la base de datos");
        }
      } catch (error) {
        console.log("Error inicializando BD:", error);
        // No mostrar alerta aquí para evitar spam al cargar
      }
    };
    abrirDB();
  }, []);

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

    // Obtener la BD - usar la del estado o inicializar de nuevo
    let databaseToUse = db;
    
    if (!databaseToUse) {
      try {
        databaseToUse = await initDB();
        if (databaseToUse) {
          setDb(databaseToUse);
          // Esperar un momento adicional para asegurar que esté lista
          await new Promise(resolve => setTimeout(resolve, 100));
        } else {
          // Intentar obtener de getDB como respaldo
          databaseToUse = getDB();
        }
      } catch (error) {
        console.error("Error obteniendo BD:", error);
        Alert.alert("Error", "No se pudo inicializar la base de datos. Intente de nuevo.");
        return;
      }
    }

    if (!databaseToUse) {
      Alert.alert("Error", "La base de datos no está disponible. Por favor, cierre y abra la aplicación.");
      return;
    }

    try {
      // Hacer una consulta de prueba primero para asegurar que la BD esté lista
      try {
        await databaseToUse.getFirstAsync("SELECT 1");
      } catch (testError) {
        console.error("Error en prueba de BD:", testError);
        Alert.alert("Error", "La base de datos no está lista. Por favor, intente de nuevo.");
        return;
      }

      const result = await databaseToUse.getFirstAsync(
        "SELECT * FROM usuarios WHERE correo = ?",
        [correo.trim()]
      );

      if (!result) {
        Alert.alert("No encontrado", "No existe una cuenta con ese correo");
        return;
      }

      if (result.password !== password) {
        Alert.alert("Contraseña incorrecta", "Intente de nuevo");
        return;
      }

      // Guardar el usuario en el contexto
      setUsuario({
        id: result.id,
        nombre: result.nombre,
        correo: result.correo,
        usuario: result.usuario
      });

      Alert.alert("Bienvenido", `Hola ${result.nombre}`);
      nav.replace("Home");

    } catch (err) {
      console.log("Error en login:", err);
      Alert.alert("Error inesperado", `No se pudo validar el usuario: ${err.message || "Error desconocido"}`);
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

        <Text
        style={{ color: 'blue', marginTop: 10 }}
        onPress={() => nav.navigate("Recuperar")}
        >
        ¿Olvidaste tu contraseña?
        </Text>

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
  color:{color:'blue'},
});
