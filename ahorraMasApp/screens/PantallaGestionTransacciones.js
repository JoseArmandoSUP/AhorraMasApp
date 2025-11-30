import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PantallaGestionTransacciones() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      
      {/* TÍTULO */}
      <Text style={styles.titulo}>TRANSACCIONES</Text>

      {/* CAJAS DE GASTOS E INGRESOS */}
      <View style={styles.todoContainer}>
        <View style={styles.todoCajas}>
          <Text style={styles.todoLabel}>GASTOS</Text>
          <Text style={styles.todoAmount}>$1000</Text>
        </View>

        <View style={styles.todoCajas}>
          <Text style={styles.todoLabel}>INGRESOS</Text>
          <Text style={styles.todoAmount}>$1200</Text>
        </View>
      </View>

      {/* BOTONES CRUD */}
      <View style={styles.botonesContainer}>

        {/* BOTÓN DE LISTA */}
        <TouchableOpacity style={styles.boton} onPress={()=>navigation.navigate("ListarTransaccion")}>
                    {/*<Ionicons>*/}
                    <Text style={styles.botonText}>Lista de Transacciones</Text>
                </TouchableOpacity>

        {/* BOTÓN EDITAR TRANSACCIÓN - Va a una lista seleccionable para editar */}
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("ListarParaEditar")}>
          <Text style={styles.botonText}>Editar Transacción</Text>
        </TouchableOpacity>

        {/* AGREGAR */}
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("AgregarTransaccion")}>
          <Text style={styles.botonText}>Agregar Transacción</Text>
        </TouchableOpacity>

        {/* ELIMINAR - Va a una lista seleccionable para eliminar */}
        <TouchableOpacity style={styles.boton} onPress={() => navigation.navigate("ListarParaEliminar")}>
          <Text style={styles.botonText}>Eliminar Transacción</Text>
        </TouchableOpacity>

        {/* VOLVER */}
        <TouchableOpacity style={styles.volverBoton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.volverBotonTexto}>Volver al menú</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#F9FAFB', paddingTop:60, paddingHorizontal:20 },
  titulo:{ fontSize:22, fontWeight:'bold', color:'#1b5e20', textAlign:'center', marginBottom:25 },
  todoContainer:{ flexDirection:'row', justifyContent:'space-between', marginBottom:25 },
  todoCajas:{ backgroundColor:'#fff', width:'47%', borderRadius:15, paddingVertical:15, alignItems:'center', elevation:3 },
  todoLabel:{ fontSize:14, fontWeight:'600', color:'#444' },
  todoAmount:{ fontSize:20, fontWeight:'bold', marginVertical:5, color:'#333' },
  botonesContainer:{ marginTop:20 },
  boton:{ backgroundColor:'#fff', paddingVertical:15, borderRadius:15, marginBottom:15, alignItems:'center', elevation:3 },
  botonText:{ fontSize:16, color:'#333', fontWeight:'500' },
  volverBoton:{ backgroundColor:'#2e7d32', borderRadius:10, paddingVertical:10, alignItems:'center' },
  volverBotonTexto:{ color:'#fff', fontWeight:'bold', fontSize:15 }
});
