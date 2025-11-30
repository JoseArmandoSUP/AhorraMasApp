import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { initDB, getDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const { usuario, setUsuario, logout } = useContext(AuthContext);

  const [db, setDb] = useState(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const database = await initDB();
        setDb(database);

        const resultado = await database.getFirstAsync(
          "SELECT * FROM usuarios WHERE id = ?",
          [usuario.id]
        );

        if (resultado) {
          setNombre(resultado.nombre);
          setCorreo(resultado.correo);
          setTelefono(resultado.telefono);
        }

        setCargando(false);
      } catch (error) {
        console.log("Error cargando perfil:", error);
        Alert.alert("Error", "No se pudo cargar el perfil");
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []);

  const guardarPerfil = async () => {
    if (!nombre.trim() || !correo.trim() || !telefono.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      await db.runAsync(
        "UPDATE usuarios SET nombre = ?, correo = ?, telefono = ? WHERE id = ?",
        [nombre, correo, telefono, usuario.id]
      );

      // Actualizar contexto
      setUsuario({ ...usuario, nombre, correo, telefono });
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (error) {
      console.log("Error guardando perfil:", error);
      Alert.alert("Error", "No se pudo guardar el perfil");
    }
  };

  const cerrarSesion = () => {
    logout(); // Borra usuario del contexto
    navigation.navigate("Login");
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Configuración de Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        keyboardType="email-address"
        value={correo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      <TouchableOpacity style={styles.boton} onPress={guardarPerfil}>
        <Text style={styles.botonTexto}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.boton, {backgroundColor: "#c62828"}]} onPress={cerrarSesion}>
        <Text style={styles.botonTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.volverBoton} onPress={() => navigation.goBack()}>
        <Text style={styles.volverBotonTexto}>Volver al Menú Principal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 60,
    backgroundColor: "#F9FAFB",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  volverBoton: {
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  volverBotonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});
