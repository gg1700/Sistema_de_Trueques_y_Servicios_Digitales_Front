'use client';

import { useEffect, useState, Suspense } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import UserProfile from '@/Components/Templates/ModalsProfile/UserProfile';

export default function PerfilPage() {
  const [userRole, setUserRole] = useState<'admin' | 'user' | 'entrepreneur'>('user');

  useEffect(() => {
    const storedRole = localStorage.getItem('currentUserRole');
    if (storedRole === 'admin' || storedRole === 'user' || storedRole === 'entrepreneur') {
      setUserRole(storedRole as 'admin' | 'user' | 'entrepreneur');
    }
  }, []);

  return (
    <AppLayout
      pageTitle="Mi Perfil"
      pageSubtitle="Información de tu cuenta"
      userRole={userRole}
    >
      <Suspense fallback={<div>Cargando perfil...</div>}>
        <UserProfile />
      </Suspense>
    </AppLayout>
  );
}