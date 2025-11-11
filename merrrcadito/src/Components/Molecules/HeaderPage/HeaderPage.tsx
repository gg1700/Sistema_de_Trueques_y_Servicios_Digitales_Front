'use client'
import styles from './HeaderPage.module.css'
import { PageTitleAdmin, PageSubtitleAdmin, ButtonIcon } from "../../Atoms";

interface HeaderTitleProps {
  pageTitle: string;
  pageSubtitle: string;
}

export default function HeaderPage({ pageTitle, pageSubtitle }: HeaderTitleProps) {
  return (
    <div className={styles.headerPage}>
        <div className={styles.headerContent}>
            <PageTitleAdmin text={pageTitle} />       
            <PageSubtitleAdmin text={pageSubtitle} />  
        </div>
        <div className={styles.headerActions}>
            <ButtonIcon
              icon='bi-person-circle'
              type='profile'
              onClick={() => console.log('Abrir profile')}
              name="Perfil"
            />
        </div>
    </div>
  );
}