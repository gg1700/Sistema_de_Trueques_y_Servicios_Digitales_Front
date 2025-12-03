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
            onClick={() => router.push('/perfil')}
            name="Perfil"
          />
          <ButtonIcon
            icon='bi-box-arrow-right'
            type='logout'
            onClick={async () => {
              try {
                if (typeof window !== "undefined") {
                  const userId = localStorage.getItem("userId");

                  // Llamar al endpoint de logout si hay userId
                  if (userId) {
                    const AUTH_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

                    await fetch(`${AUTH_API_BASE}/auth/logout`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        cod_us: parseInt(userId)
                      })
                    });
                  }

                  // Limpiar localStorage
                  window.localStorage.removeItem("currentUserHandle");
                  window.localStorage.removeItem("currentUserRole");
                  window.localStorage.removeItem("userId");
                  window.localStorage.removeItem("accountType");
                  window.localStorage.removeItem("orgId");

                  // Redirigir al login
                  router.push("/login");
                }
              } catch (error) {
                console.error('[LOGOUT ERROR]', error);
                // Incluso si falla el API, limpiar localStorage y redirigir
                if (typeof window !== "undefined") {
                  window.localStorage.clear();
                  router.push("/login");
                }
              }
            }}
            name="Cerrar Sesión"
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