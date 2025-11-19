import { useEffect } from 'react';
import { inicializarBasedatos } from './database/database';
import PantallaPrincipal from './screens/PantallaPrincipal';

export default function App() {
  
  useEffect(()=>{
    inicializarBasedatos()
      .then(()=>console.log("Base de Datos cargada"))
      .catch((err)=>console.log("Error al cargar BD:", err));
  }, []);
  
  return (
    <PantallaPrincipal></PantallaPrincipal>
  );
}