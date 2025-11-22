'use client'
import { createContext, useState, ReactNode, useContext } from 'react';

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

export default function UserContextProvide({children}: { children: ReactNode }){

    const [user, setUser]=useState<User | null>(null);

    const clearUser = () => {
        setUser(null);
    };

    const valor = {
        user,
        setUser,
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
