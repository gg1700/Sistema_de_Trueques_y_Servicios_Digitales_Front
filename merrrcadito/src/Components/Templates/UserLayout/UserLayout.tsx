import { getNavItems } from '@/Utils/navigation';
import { SideBar } from '@/Components/Organisms';
import { NavBar, HeaderPage } from '@/Components/Molecules';
import Footer from '@/Components/Organisms/Footer/Footer';
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
      <SideBar
        title="Menú"
        menuItems={userNavItems.map(item => ({
          icon: item.icon || 'home',
          label: item.name,
          href: item.route
        }))}
        currentPath={typeof window !== 'undefined' ? window.location.pathname : ''}
      />

      <div className={styles.mainContent}>
        <HeaderPage pageTitle={pageTitle} pageSubtitle={pageSubtitle} />
        <div className={styles.content}>
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}