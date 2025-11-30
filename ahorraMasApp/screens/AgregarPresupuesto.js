import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { initDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";

export default function AgregarPresupuesto() {
  const navigation = useNavigation();
  const { usuario } = useContext(AuthContext);

  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [db, setDb] = useState(null);

  useEffect(() => {
    const cargarDB = async () => {
      try {
        const database = await initDB();
        setDb(database);
      } catch (error) {
        console.log("Error cargando BD:", error);
      }
    };
    cargarDB();
  }, []);

  const guardarPresupuesto = async () => {
    if (!categoria.trim() || !monto.trim() || !fecha.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    if (!usuario || !usuario.id) {
      Alert.alert("Error", "Debes iniciar sesión para guardar un presupuesto");
      return;
    }

    try {
      const valorMonto = parseFloat(monto);
      if (isNaN(valorMonto)) {
        Alert.alert("Error", "El monto debe ser un número válido");
        return;
      }

      await db.runAsync(
        "INSERT INTO presupuestos (categoria, monto, fecha, usuario_id) VALUES (?, ?, ?, ?)",
        [categoria, valorMonto, fecha, usuario.id]
      );

      Alert.alert("Éxito", "Presupuesto agregado");
      navigation.goBack();
    } catch (error) {
      console.log("Error guardando presupuesto:", error);
      Alert.alert("Error", "No se pudo guardar el presupuesto");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Agregar Presupuesto</Text>

      <TextInput
        style={styles.input}
        placeholder="Categoría"
        value={categoria}
        onChangeText={setCategoria}
      />
      <TextInput
        style={styles.input}
        placeholder="Monto"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />

      <TouchableOpacity style={styles.boton} onPress={guardarPresupuesto}>
        <Text style={styles.botonTexto}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#F9FAFB" },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#1b5e20" },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, fontSize: 16 },
  boton: { backgroundColor: "#2e7d32", paddingVertical: 15, borderRadius: 10, alignItems: "center" },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
