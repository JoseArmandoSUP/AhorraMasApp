import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { initDB, getDB } from "../src/db";

export default function ListarParaEliminar() {
  const [transacciones, setTransacciones] = useState([]);
  const [db, setDb] = useState(null);
  const navigation = useNavigation();
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    const inicializarBD = async () => {
      try {
        await initDB();
        const database = getDB();
        if (database) {
          setDb(database);
        }
      } catch (error) {
        console.log("Error inicializando BD:", error);
      }
    };
    inicializarBD();
  }, []);

  useEffect(() => {
    if (db && usuario) {
      cargarTransacciones();
    } else if (db && !usuario) {
      setTransacciones([]);
    }
  }, [db, usuario]);

  async function cargarTransacciones() {
    try {
      if (!db) {
        return;
      }

      if (!usuario || !usuario.id) {
        setTransacciones([]);
        return;
      }

      // Filtrar por usuario_id, pero también incluir transacciones sin usuario_id (para migración)
      const result = await db.getAllAsync(
        "SELECT * FROM transacciones WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY fecha DESC",
        [usuario.id]
      );
      setTransacciones(result || []);
    } catch (error) {
      console.log("Error cargando transacciones", error);
      setTransacciones([]);
    }
  }

  const renderItem = ({ item }) => {
    if (!item || !item.id) {
      return null;
    }

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate("EliminarTransaccion", { id: item.id })}
      >
        <Text style={styles.tipo}>{item.tipo?.toUpperCase() || ""} • {item.categoria || ""}</Text>
        <Text style={styles.monto}>${item.monto || 0}</Text>
        <Text style={styles.fecha}>{item.fecha || ""}</Text>
        {item.descripcion ? <Text style={styles.desc}>{item.descripcion}</Text> : null}
        <Text style={styles.instruccion}>Toca para eliminar</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>SELECCIONA UNA TRANSACCIÓN PARA ELIMINAR</Text>

      {!usuario && (
        <Text style={styles.vacio}>Debe iniciar sesión para eliminar transacciones</Text>
      )}

      <FlatList
        data={transacciones}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            {usuario ? "No hay transacciones registradas" : "Debe iniciar sesión"}
          </Text>
        }
      />

      <TouchableOpacity style={styles.btnRegresar} onPress={() => navigation.goBack()}>
        <Text style={styles.btnTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 15,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 12,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  tipo: { fontSize: 16, fontWeight: "bold", color: "#2e7d32" },
  monto: { fontSize: 18, fontWeight: "bold", marginTop: 5, color: "black" },
  fecha: { fontSize: 13, color: "#777", marginTop: 3 },
  desc: { fontSize: 14, marginTop: 6, color: "#555" },
  instruccion: { fontSize: 12, color: "#c62828", marginTop: 8, fontStyle: "italic" },
  vacio: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#999" },
  btnRegresar: {
    backgroundColor: "#777",
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  btnTexto: { color: "#fff", fontWeight: "bold" },
});
