import React, {useContext} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function Perfil() {
  
  const navigation = useNavigation();
  const {usuario, setUsuario} = useContext(AuthContext);

  //Si no hay usuario
  if(!usuario){
    return(
      <View style={styles.container}>
        <Text style={styles.error}>No hay sesion</Text>
        <TouchableOpacity
          style={styles.botonLogin}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.botonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cerrarSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Confirmar cerrar sesión?",
      [
        {text: "Cancelar", style: "cancel"},
        {
          text: "Cerrar",
          style: "destructive",
          onPress:(() => {setUsuario(null); navigation.navigate("Login");})
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.nombre}>{usuario?.nombre}</Text>
      
      <Text style={styles.usuario}>@{usuario.usuario}</Text>

      {/* Informacion del Usuario */}
      <View style={styles.info}>
        <Text style={styles.infoItem}>Edad: {usuario?.edad}</Text>
        <Text style={styles.infoItem}>Correo: {usuario?.correo}</Text>
        <Text style={styles.infoItem}>Teléfono: {usuario?.telefono}</Text>
        <Text style={styles.infoItem}>Fecha de Alta: {usuario.fechaCreacion || usuario.fecha_creacion}</Text>
      </View>

      {/* Boton para cerrar sesión */}
      <TouchableOpacity style={styles.btnCerrarS} onPress={cerrarSesion}>
        <Text style={styles.cerrarTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: "#F5F9FF",
  },

  nombre: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937", 
    textAlign: "center",
    marginBottom: 2,
  },

  usuario: {
    fontSize: 14,
    color: "#6B7280", 
    textAlign: "center",
    marginBottom: 20,
  },

  info: {
    backgroundColor: "#FFFFFF",
    width: "90%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },

  infoItem: {
    fontSize: 16,
    color: "#111827",
    marginVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
  },

  btnCerrarS: {
    marginTop: 30,
    backgroundColor: "#EF4444", 
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
  },

  cerrarTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },

  error: {
    fontSize: 20,
    color: "red",
    marginBottom: 20,
  },

  botonLogin: {
    backgroundColor: "#3B82F6", 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  botonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
