import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";

export default function AgregarTransaccion() {
  const navigation = useNavigation();

  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const alertaRegistro = async () => {
    if (!tipo || !categoria || !monto || !fecha || descripcion.trim() === "") {
      Alert.alert("Por favor complete todos los campos");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("ahorramas_v1.db");

      await db.runAsync(
        `INSERT INTO transacciones (tipo, categoria, monto, fecha, descripcion)
         VALUES (?, ?, ?, ?, ?);`,
        [tipo, categoria, parseFloat(monto), fecha, descripcion]
      );

      Alert.alert("Transacción guardada correctamente");

      // limpiar inputs
      setTipo("");
      setCategoria("");
      setMonto("");
      setFecha("");
      setDescripcion("");

    } catch (error) {
      console.log("ERROR al guardar transacción", error);
      Alert.alert("Error", "No se pudo guardar la transacción");
    }
  };

  const filtrarCaracteresM = (input) => {
    const numerico = input.replace(/[^0-9]/g, "");
    setMonto(numerico);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>AGREGAR TRANSACCIÓN</Text>

        <View style={styles.fomrulario}>
          <Text style={styles.label}>Tipo</Text>
          <TextInput
            style={styles.input}
            placeholder="Gasto o Ingreso"
            value={tipo}
            onChangeText={setTipo}
          />

          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            placeholder="Comida, Transporte, etc."
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text style={styles.label}>Monto</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={monto}
            placeholder="Ejemplo: 500"
            onChangeText={filtrarCaracteresM}
          />

          <Text style={styles.label}>Fecha</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            value={fecha}
            onChangeText={setFecha}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.areaTexto}
            placeholder="Detalles de la transacción"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline={true}
          />

          <TouchableOpacity style={styles.btnAgregar} onPress={alertaRegistro}>
            <Text style={styles.botonTexto}>Guardar Transacción</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.volverBoton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.volverBotonTexto}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 60, paddingHorizontal: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#1b5e20", textAlign: "center", marginBottom: 25 },
  fomrulario: { backgroundColor: "#fff", borderRadius: 15, padding: 20, marginBottom: 20, elevation: 3 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
  input: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 12, marginBottom: 15 },
  areaTexto: { borderWidth: 1, borderColor: "#ccc", padding: 15, height: 120, borderRadius: 10, marginBottom: 15, textAlignVertical: "top" },
  btnAgregar: { backgroundColor: "#2e7d32", borderRadius: 10, paddingVertical: 12, alignItems: "center" },
  botonTexto: { color: "#fff", fontWeight: "bold" },
  volverBoton: { backgroundColor: "#999", padding: 12, borderRadius: 10, alignItems: "center" },
  volverBotonTexto: { color: "#fff", fontWeight: "bold" },
});
