import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { initDB } from "../src/db";
import { AuthContext } from "../context/AuthContext";

export default function EliminarPresupuesto() {
  const navigation = useNavigation();
  const { usuario } = useContext(AuthContext);

  const [db, setDb] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Inicializar DB
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

  // Cargar presupuestos del usuario
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

  const confirmarEliminacion = (item) => {
    Alert.alert(
      "Confirmar",
      `¿Desea eliminar el presupuesto de "${item.categoria}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await db.runAsync("DELETE FROM presupuestos WHERE id = ?", [item.id]);
              Alert.alert("Éxito", "Presupuesto eliminado");
              obtenerPresupuestos();
            } catch (error) {
              console.log("Error eliminando presupuesto:", error);
              Alert.alert("Error", "No se pudo eliminar el presupuesto");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.container}>
        <Text style={styles.titulo}>ELIMINAR PRESUPUESTO</Text>

        {presupuestos.length > 0 ? (
          presupuestos.map((item) => (
            <View key={item.id} style={styles.tarjeta}>
              <View style={styles.infoContainer}>
                <Text style={[styles.categoria, { color: "#1b5e20" }]}>{item.categoria}</Text>
                <Text style={styles.monto}>Límite: ${item.monto.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.btnEliminar} onPress={() => confirmarEliminacion(item)}>
                <Text style={styles.btnEliminarText}>ELIMINAR</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.textoVacio}>No hay presupuestos registrados</Text>
        )}

        <TouchableOpacity style={styles.volverBoton} onPress={() => navigation.goBack()}>
          <Text style={styles.volverBotonTexto}>Volver al menú de Presupuestos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddinTop: 70,
    paddingHorizontal: 25,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 25,
  },
  tarjeta: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: { flexDirection: "column" },
  categoria: { fontSize: 18, fontWeight: "bold" },
  monto: { fontSize: 14, color: "#555" },
  btnEliminar: {
    backgroundColor: "#c62828",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  btnEliminarText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  volverBoton: {
    backgroundColor: "#999",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  volverBotonTexto: { color: "#fff", fontWeight: "bold" },
  textoVacio: { textAlign: "center", color: "#999", marginTop: 20, fontSize: 14 },
});
