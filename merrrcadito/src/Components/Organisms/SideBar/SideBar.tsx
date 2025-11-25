import { ReactNode } from 'react';
import styles from './SideBar.module.css'

interface SideBarProps {
    children: ReactNode
    title: string
    isOpen?: boolean
    onClose?: () => void
}
export default function SideBar({
    children,
    title,
    isOpen = true,
    onClose
}: SideBarProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay para cerrar al hacer clic fuera */}
            {onClose && (
                <div className={styles.overlay} onClick={onClose}></div>
            )}
            <aside className={`${styles.sidebar} ${onClose ? styles.sidebarOverlay : ''}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>{title}</h2>
                    {onClose && (
                        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar menú">
                            ✕
                        </button>
                    )}
                </div>
                {children}
            </aside>
        </>
    );
}