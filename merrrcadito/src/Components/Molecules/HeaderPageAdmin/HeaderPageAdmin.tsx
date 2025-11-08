import styles from './HeaderPageAdmin.module.css'
import { PageTitleAdmin, PageSubtitleAdmin, ButtonIcon } from "../../Atoms";

interface HeaderTitleProps {
  pageTitle: string;
  pageSubtitle: string;
}

export default function HeaderPageAdmin({ pageTitle, pageSubtitle }: HeaderTitleProps) {
  return (
    <div className={styles.headerPageAdmin}>
      <ButtonIcon 
         icon='bi-list'
         type="burguer"
         onClick={() => console.log('Abrir menú')}
         name="Menú"
      />
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