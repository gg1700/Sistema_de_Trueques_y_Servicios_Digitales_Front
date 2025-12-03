'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import UserProfile from '@/Components/Templates/ModalsProfile/UserProfile';

export default function PerfilPage() {
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

  useEffect(() => {
    const storedRole = localStorage.getItem('currentUserRole');
    console.log('[PERFIL PAGE] Rol guardado en localStorage:', storedRole);

    // Mapear los valores del backend a admin/user
    if (storedRole === 'admin' || storedRole === 'administrador') {
      setUserRole('admin');
    } else if (storedRole === 'entrepreneur' || storedRole === 'emprendedor') {
      setUserRole('user'); // Por ahora emprendedor usa sidebar común
    } else {
      setUserRole('user');
    }
  }, []);

  return (
    <AppLayout
      pageTitle="Mi Perfil"
      pageSubtitle="Información de tu cuenta"
      userRole={userRole}
    >
      <UserProfile />
    </AppLayout>
  );
}