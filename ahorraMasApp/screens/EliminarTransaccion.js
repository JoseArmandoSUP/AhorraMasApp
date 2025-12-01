import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { initDB } from '../src/db';
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";

export default function EliminarTransaccion() {
  const route = useRoute();
  const navigation = useNavigation();
  const id = route.params?.id; // Usar optional chaining para evitar el error
  const [db, setDb] = useState(null);

  useEffect(() => {
    const init = async () => {
      const database = await initDB();
      setDb(database);
    };
    init();
  }, []);

  // Validar que el id existe
  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "No se pudo obtener el ID de la transacción");
      navigation.goBack();
    }
  }, [id]);

  async function eliminar() {
    if (!id || !db) {
      Alert.alert("Error", "No se puede eliminar la transacción");
      return;
    }
    
    try {
      await db.runAsync("DELETE FROM transacciones WHERE id = ?", [id]);
      navigation.goBack(); // vuelve a la lista
    } catch (error) {
      console.log("Error eliminando transacción:", error);
      Alert.alert("Error", "No se pudo eliminar la transacción");
    }
  }

  if (!id) {
    return null; // No renderizar si no hay id
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>¿Eliminar transacción #{id}?</Text>

      <View style={styles.botonesContainer}>
        <TouchableOpacity style={styles.btnEliminar} onPress={eliminar}>
          <Text style={styles.btnTexto}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
          <Text style={styles.btnTextoCancelar}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F6F8",
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  botonesContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
    justifyContent: "center",
  },
  btnEliminar: {
    backgroundColor: "#c62828",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  btnCancelar: {
    backgroundColor: "#777",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnTextoCancelar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
