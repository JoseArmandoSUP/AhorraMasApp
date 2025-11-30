import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { initDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";

export default function VerPresupuestos() {
  const { usuario } = useContext(AuthContext);
  const navigation = useNavigation();

  const [db, setDb] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDB = async () => {
      try {
        const database = await initDB();
        setDb(database);
      } catch (error) {
        console.log("Error cargando BD:", error);
        setCargando(false);
      }
    };
    cargarDB();
  }, []);

  useEffect(() => {
    if (db && usuario) {
      obtenerPresupuestos();
    }
  }, [db, usuario]);

  const obtenerPresupuestos = async () => {
    try {
      const resultados = await db.getAllAsync(
        "SELECT * FROM presupuestos WHERE usuario_id = ? ORDER BY fecha DESC",
        [usuario.id]
      );
      setPresupuestos(resultados || []);
      setCargando(false);
    } catch (error) {
      console.log("Error obteniendo presupuestos:", error);
      setCargando(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.categoria}>{item.categoria}</Text>
      <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
      <Text style={styles.fecha}>{item.fecha}</Text>
    </View>
  );

  if (cargando) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando presupuestos...</Text>
      </View>
    );
  }

  if (!presupuestos.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>No hay presupuestos registrados</Text>
        <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Volver al menú de presupuestos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Presupuestos</Text>
      <FlatList
        data={presupuestos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
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
  boton: { backgroundColor: "#2e7d32", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  botonTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
