import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { initDB, getDB } from "../src/db";

export default function ListarTransaccion() {
  const [transacciones, setTransacciones] = useState([]);
  const [db, setDb] = useState(null);
  const { usuario } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const inicializar = async () => {
      try {
        await initDB();
        const database = getDB();
        setDb(database);
      } catch (error) {
        console.log("Error inicializando BD en ListarTransaccion:", error);
      }
    };
    inicializar();
  }, []);

  useEffect(() => {
    if (db) cargarTransacciones();
  }, [db, usuario]);

  async function cargarTransacciones() {
    try {
      if (!db) return;

      const uid = usuario?.id || null;
      const result = await db.getAllAsync(
        "SELECT * FROM transacciones WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY fecha DESC",
        [uid]
      );
      setTransacciones(result || []);
    } catch (error) {
      console.log("Error cargando transacciones:", error);
      setTransacciones([]);
    }
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          Alert.alert(
            `Transacción #${item.id}`,
            `${item.tipo} • ${item.categoria}\nMonto: $${item.monto}\nFecha: ${item.fecha}\n${item.descripcion || ""}`
          )
        }
      >
        <Text style={styles.tipo}>{(item.tipo || "").toUpperCase()} • {item.categoria}</Text>
        <Text style={styles.monto}>${item.monto}</Text>
        <Text style={styles.fecha}>{item.fecha}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>LISTA DE TRANSACCIONES</Text>

      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vacio}>No hay transacciones registradas</Text>}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8", padding: 15, paddingTop: 50 },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#1b5e20", textAlign: "center", marginBottom: 15 },
  card: { backgroundColor: "#fff", marginBottom: 12, padding: 12, borderRadius: 10, elevation: 2 },
  tipo: { fontSize: 16, fontWeight: "600", color: "#2e7d32" },
  monto: { fontSize: 16, marginTop: 6, fontWeight: "700", color: "#000" },
  fecha: { fontSize: 12, color: "#666", marginTop: 4 },
  vacio: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#999" },
});