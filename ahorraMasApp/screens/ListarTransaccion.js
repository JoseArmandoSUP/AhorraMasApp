import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, ScrollView } from "react-native";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { initDB, getDB } from "../src/db";

export default function ListarTransaccion() {
  const [transacciones, setTransacciones] = useState([]);
  const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]);
  const [db, setDb] = useState(null);
  const navigation = useNavigation();
  const { usuario } = useContext(AuthContext);
  
  // Estados para filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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
      cargarCategorias();
    } else if (db && !usuario) {
      setTransacciones([]);
      setTransaccionesFiltradas([]);
    }
  }, [db, usuario]);

  // Aplicar filtros cuando cambien los datos o los filtros
  useEffect(() => {
    aplicarFiltros();
  }, [transacciones, filtroCategoria, filtroFecha]);

  async function cargarCategorias() {
    try {
      if (!db || !usuario || !usuario.id) {
        return;
      }

      const categorias = await db.getAllAsync(
        "SELECT DISTINCT categoria FROM transacciones WHERE usuario_id = ? OR usuario_id IS NULL ORDER BY categoria",
        [usuario.id]
      );
      setCategoriasDisponibles(categorias.map(c => c.categoria).filter(Boolean));
    } catch (error) {
      console.log("Error cargando categorías:", error);
    }
  }

  async function cargarTransacciones() {
    try {
      if (!db) {
        return;
      }

      if (!usuario || !usuario.id) {
        setTransacciones([]);
        return;
      }

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

  function aplicarFiltros() {
    let filtradas = [...transacciones];

    // Filtrar por categoría
    if (filtroCategoria.trim()) {
      filtradas = filtradas.filter(t => 
        t.categoria && t.categoria.toLowerCase().includes(filtroCategoria.toLowerCase())
      );
    }

    // Filtrar por fecha
    if (filtroFecha.trim()) {
      filtradas = filtradas.filter(t => 
        t.fecha && t.fecha.includes(filtroFecha.trim())
      );
    }

    setTransaccionesFiltradas(filtradas);
  }

  function limpiarFiltros() {
    setFiltroCategoria("");
    setFiltroFecha("");
  }

  const renderItem = ({ item }) => {
    if (!item || !item.id) {
      return null;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.tipo}>{item.tipo?.toUpperCase() || ""} • {item.categoria || ""}</Text>
        <Text style={styles.monto}>${item.monto || 0}</Text>
        <Text style={styles.fecha}>{item.fecha || ""}</Text>
        {item.descripcion ? <Text style={styles.desc}>{item.descripcion}</Text> : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>TRANSACCIONES REGISTRADAS</Text>

      {/* Botón para mostrar/ocultar filtros */}
      <TouchableOpacity 
        style={styles.btnFiltros}
        onPress={() => setMostrarFiltros(!mostrarFiltros)}
      >
        <Text style={styles.btnFiltrosTexto}>
          {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Text>
      </TouchableOpacity>

      {/* Panel de Filtros */}
      {mostrarFiltros && (
        <View style={styles.filtrosContainer}>
          <Text style={styles.filtrosTitulo}>Filtrar por</Text>

          <View style={styles.filtroFila}>
            <Text style={styles.filtroLabel}>Categoría:</Text>
            <TextInput
              style={styles.filtroInput}
              placeholder="Ej: Comida, Transporte..."
              value={filtroCategoria}
              onChangeText={setFiltroCategoria}
            />
          </View>

          <View style={styles.filtroFila}>
            <Text style={styles.filtroLabel}>Fecha:</Text>
            <TextInput
              style={styles.filtroInput}
              placeholder="AAAA-MM-DD o AAAA-MM"
              value={filtroFecha}
              onChangeText={setFiltroFecha}
            />
          </View>

          <View style={styles.filtrosBotones}>
            <TouchableOpacity 
              style={styles.btnLimpiar}
              onPress={limpiarFiltros}
            >
              <Text style={styles.btnLimpiarTexto}>Limpiar Filtros</Text>
            </TouchableOpacity>
          </View>

          {/* Mostrar categorías disponibles como sugerencias */}
          {categoriasDisponibles.length > 0 && (
            <View style={styles.sugerenciasContainer}>
              <Text style={styles.sugerenciasTitulo}>Categorías disponibles:</Text>
              <View style={styles.sugerenciasFila}>
                {categoriasDisponibles.slice(0, 5).map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chipCategoria}
                    onPress={() => setFiltroCategoria(cat)}
                  >
                    <Text style={styles.chipTexto}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Contador de resultados */}
      <Text style={styles.contador}>
        Mostrando {transaccionesFiltradas.length} de {transacciones.length} transacciones
      </Text>

      {!usuario && (
        <Text style={styles.vacio}>Debe iniciar sesión para ver sus transacciones</Text>
      )}

      <FlatList
        data={transaccionesFiltradas}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            {usuario 
              ? (filtroCategoria || filtroFecha 
                  ? "No hay transacciones que coincidan con los filtros" 
                  : "No hay transacciones registradas")
              : "Debe iniciar sesión"}
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
    marginBottom: 15,
  },
  btnFiltros: {
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  btnFiltrosTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  filtrosContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  filtrosTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 12,
    textAlign: "center",
  },
  filtroFila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  filtroLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    width: "30%",
  },
  filtroInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  filtrosBotones: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  btnLimpiar: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  btnLimpiarTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  sugerenciasContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  sugerenciasTitulo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  sugerenciasFila: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipCategoria: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 6,
    marginBottom: 6,
  },
  chipTexto: {
    fontSize: 12,
    color: "#1976d2",
  },
  contador: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
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
