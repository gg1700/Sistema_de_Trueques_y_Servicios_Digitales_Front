'use client';

import UserProfile from '@/Components/Templates/ModalsProfile/UserProfile';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';

export default function PerfilPage() {
  return (
    <AppLayout
      pageTitle="Mi Perfil"
      pageSubtitle="Gestiona tu información personal y actividad"
    >
      <UserProfile />
    </AppLayout>
  );
}