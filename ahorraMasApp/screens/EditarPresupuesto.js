import React, { useEffect, useState, useContext } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { initDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";

export default function EditarPresupuesto() {
  const { usuario } = useContext(AuthContext);
  const navigation = useNavigation();

  const [db, setDb] = useState(null);
  const { presupuestos } = useContext(AppContext);
  const [presupuestoSeleccionado, setPresupuestoSeleccionado] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  // initialize DB only when performing updates
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const database = await initDB();
        if (mounted) setDb(database);
      } catch (e) {
        console.log('Error inicializando DB:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Seleccionar un presupuesto para editar
  const seleccionarPresupuesto = (presupuesto) => {
    setPresupuestoSeleccionado(presupuesto);
    setCategoria(presupuesto.categoria);
    setMonto(presupuesto.monto.toString());
    setFecha(presupuesto.fecha);
  };

  // Guardar cambios del presupuesto
  const guardarCambios = async () => {
    if (!categoria.trim() || !monto.trim() || !fecha.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const valorMonto = parseFloat(monto);
      if (isNaN(valorMonto)) {
        Alert.alert("Error", "El monto debe ser un número válido");
        return;
      }
      const database = db || (await initDB());
      await database.runAsync(
        "UPDATE presupuestos SET categoria = ?, monto = ?, fecha = ? WHERE id = ?",
        [categoria, valorMonto, fecha, presupuestoSeleccionado.id]
      );
      Alert.alert("Éxito", "Presupuesto actualizado");

      // Limpiar selección; AppContext will refresh list via DB change listener
      setPresupuestoSeleccionado(null);
      setCategoria("");
      setMonto("");
      setFecha("");
    } catch (error) {
      console.log("Error actualizando presupuesto:", error);
      Alert.alert("Error", "No se pudo actualizar el presupuesto");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => seleccionarPresupuesto(item)}>
      <Text style={styles.categoria}>{item.categoria}</Text>
      <Text style={styles.monto}>${(Number(item.monto) || 0).toFixed(2)}</Text>
      <Text style={styles.fecha}>{item.fecha}</Text>
    </TouchableOpacity>
  );

  // show UI directly; presupuestos come from AppContext and update automatically

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Presupuesto</Text>

      {presupuestoSeleccionado && (
        <View style={styles.formulario}>
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

          <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
            <Text style={styles.botonTexto}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={presupuestos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.textoVacio}>No hay presupuestos registrados</Text>}
      />

      <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
        <Text style={styles.botonTexto}>Volver al menú de presupuestos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: "#F9FAFB" },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#1b5e20" },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  categoria: { fontSize: 16, fontWeight: "600", color: "#333" },
  monto: { fontSize: 16, fontWeight: "bold", color: "#2e7d32" },
  fecha: { fontSize: 14, color: "#777", marginTop: 5 },
  formulario: { marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, fontSize: 16 },
  boton: { backgroundColor: "#2e7d32", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  textoVacio: { textAlign: "center", marginTop: 20, color: "#999" },
});
