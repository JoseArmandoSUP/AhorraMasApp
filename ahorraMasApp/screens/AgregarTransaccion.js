import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { initDB, getDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";

export default function AgregarTransaccion() {
  const navigation = useNavigation();
  const { usuario } = useContext(AuthContext);
  const [db, setDb] = useState(null);
  const [inicializando, setInicializando] = useState(true);

  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Inicializar BD al cargar el componente
  useEffect(() => {
    const inicializarBD = async () => {
      setInicializando(true);
      try {
        const database = await initDB();
        if (database) {
          setDb(database);
          console.log("BD inicializada correctamente en AgregarTransaccion");
        } else {
          console.error("initDB retornó null o undefined");
        }
      } catch (error) {
        console.error("Error inicializando BD en useEffect:", error);
      } finally {
        setInicializando(false);
      }
    };
    inicializarBD();
  }, []);

  const alertaRegistro = async () => {
    // Validación
    if (!tipo.trim() || !categoria.trim() || !monto.trim() || !fecha.trim()) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios");
      return;
    }

    const montoNumero = parseFloat(monto);
    if (isNaN(montoNumero) || montoNumero <= 0) {
      Alert.alert("Error", "El monto debe ser un número válido mayor a 0");
      return;
    }

    if (!usuario || !usuario.id) {
      Alert.alert("Error", "Debe iniciar sesión para agregar transacciones");
      return;
    }

    // Obtener la BD - usar la del estado o inicializar de nuevo
    let databaseToUse = db;
    
    if (!databaseToUse) {
      setInicializando(true);
      try {
        databaseToUse = await initDB();
        if (databaseToUse) {
          setDb(databaseToUse);
        } else {
          databaseToUse = getDB();
        }
      } catch (error) {
        console.error("Error obteniendo BD:", error);
        Alert.alert("Error", "No se pudo obtener la conexión a la base de datos. Por favor, cierre y abra la aplicación.");
        setInicializando(false);
        return;
      } finally {
        setInicializando(false);
      }
    }

    if (!databaseToUse) {
      Alert.alert("Error", "La base de datos no está disponible. Por favor, cierre y abra la aplicación.");
      return;
    }

    try {
      const descripcionFinal = descripcion.trim() || null;
      
      await databaseToUse.runAsync(
        "INSERT INTO transacciones (usuario_id, tipo, categoria, monto, fecha, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
        [usuario.id, tipo.trim(), categoria.trim(), montoNumero, fecha.trim(), descripcionFinal]
      );

      Alert.alert("Éxito", "Transacción guardada correctamente");

      // limpiar inputs
      setTipo("");
      setCategoria("");
      setMonto("");
      setFecha("");
      setDescripcion("");

    } catch (error) {
      console.error("ERROR al guardar transacción:", error);
      Alert.alert(
        "Error", 
        `No se pudo guardar la transacción.\n\nError: ${error.message || "Error desconocido"}`
      );
    }
  };

  const filtrarCaracteresM = (input) => {
    let numerico = input.replace(/[^0-9.]/g, "");
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

        {inicializando && (
          <Text style={styles.mensajeEstado}>Inicializando base de datos...</Text>
        )}

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
            style={[styles.btnAgregar, (!db || !usuario || inicializando) && styles.btnDisabled]} 
            onPress={alertaRegistro}
            disabled={!usuario || inicializando}
          >
            <Text style={styles.botonTexto}>
              {inicializando 
                ? "Inicializando..." 
                : !usuario 
                  ? "Debe iniciar sesión" 
                  : !db 
                    ? "BD no disponible" 
                    : "Guardar Transacción"}
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
  mensajeEstado: { textAlign: "center", color: "#666", marginBottom: 10, fontSize: 14 },
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
