'use client';

import React, { useState } from 'react';
import { getNavItems } from '@/Utils/navigation';
import { SideBar } from '@/Components/Organisms';
import { NavBar } from '@/Components/Molecules';
import { ButtonIcon } from '@/Components/Atoms';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './AdminLayout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle: string;
}

export default function AdminLayout({
  children,
  pageTitle,
  pageSubtitle
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminNavItems = getNavItems('admin');
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
        <h1 className={styles.logoText}>MERRRCADITO</h1>

        <div className={styles.headerActions}>
          <ButtonIcon type="profile" icon="bi-wallet2" name="Billetera" onClick={() => router.push('/billetera')} />
          <ButtonIcon type="profile" icon="bi-person-circle" name="Perfil" onClick={() => router.push('/mi-perfil')} />
        </div>
      </header>

      {/* Sub Header */}
      <div className={styles.subHeader}>
        <h2 className={styles.pageTitle}>{pageTitle}</h2>
        <p className={styles.pageSubtitle}>{pageSubtitle}</p>
      </div>

      {/* Sidebar Overlay */}
      <SideBar
        title="Menú"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={adminNavItems.map(item => ({
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
    </div>
  );
}