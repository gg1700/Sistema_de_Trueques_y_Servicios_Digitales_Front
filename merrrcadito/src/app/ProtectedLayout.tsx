'use client'
import { useUser } from '@/Contexts/userContext';
import AppLayout from '../Components/Templates/AppLayout/AppLayout';
import { redirect } from 'next/navigation';
import { mapCodRolToRole } from '../Utils/mapRol';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  pageTitle?: string; 
  pageSubtitle?: string;  
}

export default function ProtectedLayout({ 
  children, 
  pageTitle = "Dashboard",  
  pageSubtitle  
}: ProtectedLayoutProps) {
  const { user } = useUser();

  if (!user) {
    redirect('/');
  }

  const userRole = mapCodRolToRole(user.cod_rol);
  const subtitle = pageSubtitle || `Bienvenido ${user.handlename}`; 

  return (
    <AppLayout 
      userRole={userRole}
      pageTitle={pageTitle}
      pageSubtitle={subtitle}
    >
      {children}
    </AppLayout>
  );
}