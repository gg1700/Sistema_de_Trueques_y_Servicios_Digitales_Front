'use client'
import { getNavItems } from '@/Utils/navigation';
import { SideBar } from '@/Components/Organisms';
import { NavBar, HeaderPage } from '@/Components/Molecules';
import styles from './AppLayout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle: string;
  userRole: 'admin' | 'user';  
}

export default function AppLayout({
  children,
  pageTitle,
  pageSubtitle,
  userRole
}: LayoutProps) {
  
  const navItems = getNavItems(userRole);  

  return (
    <div className={styles.appLayout}>
      <SideBar title="MERRRCADITO">
        <NavBar navBar={navItems} />
      </SideBar>

      <main className={styles.mainContent}>
        <HeaderPage pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
        <div className={styles.childrenContainer}>
          {children}
        </div>
      </main>
    </div>
  );
}