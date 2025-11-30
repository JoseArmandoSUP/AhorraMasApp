import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";

export default function EditarTransaccion() {
  const navigation = useNavigation();
  const route = useRoute();
  const { transaccion } = route.params; 
  console.log("Transacción recibida:", transaccion);

  const [tipo, setTipo] = useState(transaccion.tipo);
  const [categoria, setCategoria] = useState(transaccion.categoria);
  const [monto, setMonto] = useState(transaccion.monto.toString());
  const [fecha, setFecha] = useState(transaccion.fecha);
  const [descripcion, setDescripcion] = useState(transaccion.descripcion);

  const guardarCambios = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("ahorramas_v1.db");

      await db.runAsync(
        `UPDATE transacciones
         SET tipo = ?, categoria = ?, monto = ?, fecha = ?, descripcion = ?
         WHERE id = ?`,
        [tipo, categoria, parseFloat(monto), fecha, descripcion, transaccion.id]
      );

      Alert.alert("Éxito", "Transacción actualizada correctamente");
      navigation.goBack();
    } catch (error) {
      console.log("Error actualizando transacción", error);
      Alert.alert("Error", "No se pudo actualizar la transacción");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>EDITAR TRANSACCIÓN</Text>

      <TextInput style={styles.input} value={tipo} onChangeText={setTipo} />
      <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} />
      <TextInput style={styles.input} value={monto} keyboardType="numeric" onChangeText={setMonto} />
      <TextInput style={styles.input} value={fecha} onChangeText={setFecha} />
      <TextInput style={styles.textArea} value={descripcion} onChangeText={setDescripcion} multiline />

      <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios}>
        <Text style={styles.btnTexto}>Guardar Cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnRegresar} onPress={() => navigation.goBack()}>
        <Text style={styles.btnTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#F9FAFB" },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#1b5e20" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 15 },
  textArea: { backgroundColor: "#fff", padding: 12, borderRadius: 10, height: 100, marginBottom: 15, textAlignVertical: "top" },
  btnGuardar: { backgroundColor: "#2e7d32", padding: 15, borderRadius: 10, alignItems: "center" },
  btnRegresar: { backgroundColor: "#777", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  btnTexto: { color: "#fff", fontWeight: "bold" },
});
