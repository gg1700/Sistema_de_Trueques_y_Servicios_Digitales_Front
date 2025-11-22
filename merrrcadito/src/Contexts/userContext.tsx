'use client'
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';

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

     useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const setUserPersisted = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const clearUserPersisted = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const valor = {
        user,
        setUser: setUserPersisted, 
        clearUser: clearUserPersisted 
    };

    console.log('👤 UserContext - Estado actual:', user);

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
