'use client'
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { getUserSession, saveUserSession, clearUserSession } from '@/lib/authStorage';

interface User {
  cod_us: number,
  handlename: string,
  cod_rol: number
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export default function UserContextProvide({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const session = getUserSession();
    if (session) {
      setUser({
        cod_us: session.cod_us,
        handlename: session.handle_name,
        cod_rol: session.cod_rol
      });
    }
  }, []);

  // Función para establecer usuario y guardarlo en localStorage
  const setUserWithPersistence = (newUser: User) => {
    setUser(newUser);
    saveUserSession({
      cod_us: newUser.cod_us,
      handle_name: newUser.handlename,
      cod_rol: newUser.cod_rol,
      role: newUser.cod_rol === 3 ? 'admin' : newUser.cod_rol === 2 ? 'entrepreneur' : 'user'
    });
  };

  const clearUser = () => {
    setUser(null);
    clearUserSession();
  };

  const valor = {
    user,
    setUser: setUserWithPersistence,
    clearUser
  };

  return (
    <UserContext.Provider value={valor} >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserContextProvider');
  }
  return context;
};
