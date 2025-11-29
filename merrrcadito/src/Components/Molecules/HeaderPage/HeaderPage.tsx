'use client'
import { useState, useEffect } from 'react';
import styles from './HeaderPage.module.css'
import { PageTitleAdmin, PageSubtitleAdmin, ButtonIcon } from "../../Atoms";
import { useRouter } from 'next/navigation';
// import NotificationBell from '@/Components/Molecules/NotificationBell/NotificationBell';
// import NotificationDropdown from '@/Components/Molecules/NotificationDropdown/NotificationDropdown';

interface HeaderTitleProps {
  pageTitle: string;
  pageSubtitle: string;
}

export default function HeaderPage({ pageTitle, pageSubtitle }: HeaderTitleProps) {
  const router = useRouter();
  // const [showNotifications, setShowNotifications] = useState(false);
  // const [userId, setUserId] = useState<number>(0);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const storedUserId = localStorage.getItem("userId");
  //     if (storedUserId) {
  //       setUserId(parseInt(storedUserId));
  //     }
  //   }
  // }, []);

  return (
    <>
      <div className={styles.headerPage}>
        <div className={styles.headerContent}>
          <PageTitleAdmin text={pageTitle} />
          <PageSubtitleAdmin text={pageSubtitle} />
        </div>
        <div className={styles.headerActions}>
          {/* Campana de notificaciones */}
          {/* {userId > 0 && (
            <div style={{ position: 'relative' }}>
              <NotificationBell
                userId={userId}
                onClick={() => setShowNotifications(!showNotifications)}
              />
            </div>
          )} */}

          <ButtonIcon
            icon='bi-wallet2'
            type='profile'
            onClick={() => router.push('/billetera')}
            name="Billetera"
          />
          <ButtonIcon
            icon='bi-person-circle'
            type='profile'
            onClick={() => console.log('Abrir profile')}
            name="Perfil"
          />
        </div>
      </div>

      {/* Modal de notificaciones - Se renderiza fuera del header para evitar problemas de z-index */}
      {/* {userId > 0 && (
        <NotificationDropdown
          userId={userId}
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      )} */}
    </>
  );
}