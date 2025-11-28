import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const[usuario, setUsuario]= useState(null);

    return(
        <AuthContext.Provider value={{usuario, setUsuario}}>
            {children}
        </AuthContext.Provider>
    );
}