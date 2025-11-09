import { ReactNode } from 'react';
import styles from './SideBar.module.css'

interface SideBarProps{
    children: ReactNode
    title: string
}
export default function SideBar({
    children,
    title
}:SideBarProps){
    return(
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarHeader}>{title}</h2>
            </div>
            {children} 
        </aside>
    );
}