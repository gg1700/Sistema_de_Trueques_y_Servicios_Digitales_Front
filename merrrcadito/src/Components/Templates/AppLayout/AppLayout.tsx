'use client';

import React, { useState } from 'react';
import { getNavItems } from '@/Utils/navigation';
import { SideBar } from '@/Components/Organisms';
import { NavBar } from '@/Components/Molecules';
import { ButtonIcon } from '@/Components/Atoms';
import Footer from '@/Components/Organisms/Footer/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AppLayout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle: string;
  userRole: 'admin' | 'user';
  actionButton?: React.ReactNode;
}

export default function AppLayout({
  children,
  pageTitle,
  pageSubtitle,
  userRole = 'user',
  actionButton
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔹 Usar navegación de admin si el rol es admin
  const navRole = userRole === 'admin' ? 'admin' : 'user';
  let navItems = getNavItems(navRole);

  // 🔹 Filtrar "Intercambios" para organizaciones
  if (typeof window !== 'undefined') {
    const accountType = localStorage.getItem('accountType');
    if (accountType === 'organization') {
      navItems = navItems.filter(item => item.route !== '/intercambios');
    }
  }

  const router = useRouter();

  return (
    <div className={styles.adminLayout}>
      {/* Top Header Fixed */}
      <header className={styles.topHeader}>
        <button
          className={styles.hamburgerButton}
          onClick={() => setSidebarOpen(true)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <img
          src="/images/logo_merrrcadito.png"
          alt="MERRRCADITO"
          className={styles.logoImage}
          onClick={() => router.push('/Home')}
        />

        <div className={styles.headerActions}>
          <ButtonIcon type="profile" icon="bi-wallet2" name="Billetera" onClick={() => router.push('/billetera')} />
          <ButtonIcon type="profile" icon="bi-person-circle" name="Perfil" onClick={() => router.push('/perfil')} />
          <ButtonIcon
            type="logout"
            icon="bi-box-arrow-right"
            name="Cerrar Sesión"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.localStorage.removeItem("currentUserHandle");
                window.localStorage.removeItem("currentUserRole");
                router.push("/login");
              }
            }}
          />
        </div>
      </header>

      {/* Sub Header */}
      <div className={styles.subHeader}>
        <div>
          <h2 className={styles.pageTitle}>{pageTitle}</h2>
          <p className={styles.pageSubtitle}>{pageSubtitle}</p>
        </div>
        {actionButton && (
          <div className={styles.headerAction}>
            {actionButton}
          </div>
        )}
      </div>

      {/* Sidebar Overlay */}
      <SideBar
        title="Menú"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={navItems.map(item => ({
          icon: (item as any).icon || 'dashboard',
          label: item.name,
          href: item.route
        }))}
        currentPath={typeof window !== 'undefined' ? window.location.pathname : ''}
      />

      <main className={styles.mainContent}>
        <div className={styles.childrenContainer}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}