import { getNavItems } from '@/Utils/navigation';
import {SideBar} from '@/Components/Organisms';
import {NavBar, HeaderPage} from '@/Components/Molecules';
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
  
  const adminNavItems = getNavItems('admin');

  return (
    <div className={styles.adminLayout}>
      <SideBar title="MERRRCADITO">
        <NavBar navBar={adminNavItems} />
      </SideBar>
      <main className={styles.main}>
        <HeaderPage pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
            {children}
      </main>
    </div>
  );
}