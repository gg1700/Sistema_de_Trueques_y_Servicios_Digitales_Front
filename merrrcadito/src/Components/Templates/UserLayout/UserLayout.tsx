import { getNavItems } from '@/Utils/navigation';
import { SideBar } from '@/Components/Organisms';
import { NavBar, HeaderPage } from '@/Components/Molecules';
import styles from './UserLayout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  pageSubtitle: string;
}

export default function UserLayout({
  children,
  pageTitle,
  pageSubtitle
}: LayoutProps) {
  
  const userNavItems = getNavItems('user');

  return (
    <div className={styles.userLayout}>
      <SideBar title="MERRRCADITO">
        <NavBar navBar={userNavItems} />
      </SideBar>
      
      <div className={styles.mainArea}>
        <HeaderPage pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}