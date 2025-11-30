import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { initDB, getDB } from "../src/db";

export default function AgregarTransaccion() {
  const navigation = useNavigation();
  const [db, setDb] = useState(null);

  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Inicializar BD al cargar el componente - usando el mismo patrón que PantallaRegistro
  useEffect(() => {
    const inicializarBD = async () => {
      try {
        // Asegurar que la BD esté inicializada
        await initDB();
        // Obtener la conexión usando getDB() en lugar de abrir una nueva
        const database = getDB();
        if (database) {
          setDb(database);
        } else {
          Alert.alert("Error", "No se pudo obtener la conexión a la base de datos");
        }
      } catch (error) {
        console.log("Error inicializando BD:", error);
        Alert.alert("Error", "No se pudo inicializar la base de datos");
      }
    };
    inicializarBD();
  }, []);

  const alertaRegistro = async () => {
    // Validación corregida
    if (!tipo.trim() || !categoria.trim() || !monto.trim() || !fecha.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios");
      return;
    }

    // Validar que monto sea un número válido
    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      Alert.alert("Error", "El monto debe ser un número válido mayor a 0");
      return;
    }

    // Validar que la BD esté lista
    if (!db) {
      Alert.alert("Error", "La base de datos no está lista. Intente de nuevo.");
      return;
    }

    try {
      // Manejar descripción vacía correctamente
      const descripcionFinal = descripcion.trim() || null;
      
      await db.runAsync(
        `INSERT INTO transacciones (tipo, categoria, monto, fecha, descripcion)
         VALUES (?, ?, ?, ?, ?)`,
        [tipo.trim(), categoria.trim(), montoNumero, fecha.trim(), descripcionFinal]
      );

      Alert.alert("Éxito", "Transacción guardada correctamente");

      // limpiar inputs
      setTipo("");
      setCategoria("");
      setMonto("");
      setFecha("");
      setDescripcion("");

    } catch (error) {
      console.log("ERROR al guardar transacción", error);
      Alert.alert("Error", `No se pudo guardar la transacción: ${error.message || "Error desconocido"}`);
    }
  };

  const filtrarCaracteresM = (input) => {
    // Permitir números y un punto decimal
    let numerico = input.replace(/[^0-9.]/g, "");
    // Asegurar que solo haya un punto decimal
    const partes = numerico.split(".");
    if (partes.length > 2) {
      numerico = partes[0] + "." + partes.slice(1).join("");
    }
    setMonto(numerico);
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>AGREGAR TRANSACCIÓN</Text>

        <View style={styles.fomrulario}>
          <Text style={styles.label}>Tipo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Gasto o Ingreso"
            value={tipo}
            onChangeText={setTipo}
          />

          <Text style={styles.label}>Categoría *</Text>
          <TextInput
            style={styles.input}
            placeholder="Comida, Transporte, etc."
            value={categoria}
            onChangeText={setCategoria}
          />

          <Text style={styles.label}>Monto *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={monto}
            placeholder="Ejemplo: 500"
            onChangeText={filtrarCaracteresM}
          />

          <Text style={styles.label}>Fecha *</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD (ej: 2025-01-15)"
            value={fecha}
            onChangeText={setFecha}
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={styles.areaTexto}
            placeholder="Detalles de la transacción (opcional)"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline={true}
          />

          <TouchableOpacity 
            style={[styles.btnAgregar, !db && styles.btnDisabled]} 
            onPress={alertaRegistro}
            disabled={!db}
          >
            <Text style={styles.botonTexto}>
              {db ? "Guardar Transacción" : "Inicializando..."}
            </Text>
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
  btnDisabled: { backgroundColor: "#999", opacity: 0.6 },
  botonTexto: { color: "#fff", fontWeight: "bold" },
  volverBoton: { backgroundColor: "#999", padding: 12, borderRadius: 10, alignItems: "center" },
  volverBotonTexto: { color: "#fff", fontWeight: "bold" },
});
