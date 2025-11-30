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
  container:{
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: "#F5F9FF"
  },

  nombre:{
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },

  usuario:{
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },

  info:{
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },

  infoItem:{
    fontSize: 16,
    marginBottom: 8,
  },

  btnCerrarS:{
    backgroundColor: "#c62828",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },

  botonText:{
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  error:{
    fontSize: 20,
    color: "red",
    marginBottom: 20,
  },

  botonLogin:{
    backgroundColor: "#2e7d32",
    padding: 12,
    borderRadius: 8,
  },
});