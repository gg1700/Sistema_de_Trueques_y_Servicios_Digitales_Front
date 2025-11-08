import styles from './AdminLayaout.module.css';
import { ReactNode } from "react";
import { HeaderPageAdmin } from "../../Molecules";

interface AdminLayoutProps{
    children: ReactNode,
    pageTitle: string,
    pageSubtitle: string
}

export default function AdminLayout({
    children,
    pageTitle,
    pageSubtitle
}:AdminLayoutProps){
    return(
        <div className={styles.adminLayout}>
            <HeaderPageAdmin
               pageTitle={pageTitle}
               pageSubtitle={pageSubtitle}
            />

            {children}
            
        </div>
    );
}