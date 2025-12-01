import { ReactNode } from 'react';
import Link from 'next/link';
import MenuIcon from '@/Components/Atoms/Icons/MenuIcon';
import styles from './SideBar.module.css';

export interface MenuItem {
    icon: string;
    label: string;
    href: string;
}

interface SideBarProps {
    children?: ReactNode;
    title?: string;
    isOpen?: boolean;
    onClose?: () => void;
    menuItems?: MenuItem[];
    currentPath?: string;
}

export default function SideBar({
    children,
    title = "Menú",
    isOpen = true,
    onClose,
    menuItems,
    currentPath = ''
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
                {menuItems ? (
                    <nav className={styles.sidebarNav}>
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.sidebarLink} ${currentPath === item.href ? styles.sidebarLinkActive : ''}`}
                            >
                                <MenuIcon name={item.icon} className={styles.menuIcon} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                ) : (
                    children
                )}
            </aside>
        </>
    );
}