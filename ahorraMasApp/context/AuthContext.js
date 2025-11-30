import React, { createContext, useState } from 'react';

// Crear contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Estado del usuario
  const [usuario, setUsuario] = useState(null);

  // Función para iniciar sesión
  const login = (userData) => {
    setUsuario(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    setUsuario(null);
  };

  // Función para actualizar datos del perfil
  const actualizarPerfil = (datosActualizados) => {
    setUsuario(prev => ({ ...prev, ...datosActualizados }));
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      setUsuario, 
      login, 
      logout, 
      actualizarPerfil 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
