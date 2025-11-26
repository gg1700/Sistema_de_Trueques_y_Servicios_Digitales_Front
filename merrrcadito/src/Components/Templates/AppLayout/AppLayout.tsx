'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCodRol } from '@/lib/authStorage';
import { getNavItems } from '@/Utils/navigation';
import { SideBar } from '@/Components/Organisms';
import { NavBar } from '@/Components/Molecules';
import { ButtonIcon } from '@/Components/Atoms';
import styles from './AppLayout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle: string;
}

export default function AppLayout({
  children,
  pageTitle,
  pageSubtitle
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navItems, setNavItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Detectar rol desde localStorage
    const codRol = getCodRol();

    // Mapear cod_rol a role string
    let role: 'admin' | 'user' = 'user'; // Default

    if (codRol === 3) {
      role = 'admin';  // Administrador
    } else if (codRol === 1) {
      role = 'user';   // Usuario común
    }
    // cod_rol === 2 (entrepreneur) usará 'user' por ahora

    // Obtener navItems según el rol
    const items = getNavItems(role);
    setNavItems(items);
  }, []);

  return (
    <div className={styles.appLayout}>
      {/* Top Header Fixed */}
      <header className={styles.topHeader}>
        <button
          className={styles.hamburgerButton}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className={styles.logoText}>MERRRCADITO</h1>

        <div className={styles.headerActions}>
          <ButtonIcon
            type="profile"
            icon="bi-wallet2"
            name="Billetera"
            onClick={() => router.push('/billetera')}
          />
          <ButtonIcon
            type="profile"
            icon="bi-person-circle"
            name="Perfil"
            onClick={() => router.push('/perfil')}
          />
        </div>
      </header>

      {/* Sub Header */}
      <div className={styles.subHeader}>
        <h2 className={styles.pageTitle}>{pageTitle}</h2>
        <p className={styles.pageSubtitle}>{pageSubtitle}</p>
      </div>

      {/* Sidebar Overlay */}
      <SideBar
        title="MERRRCADITO"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <NavBar navBar={navItems} />
      </SideBar>

      <main className={styles.mainContent}>
        <div className={styles.childrenContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}