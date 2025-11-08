import styles from './PageTitleAdmin.module.css'

interface PageTitleAdminProps{
    text: string
}

export default function PageTitleAdmin({text}:PageTitleAdminProps){

    return(
        <h1 className={styles.pageTitle}>{text}</h1>
    );
}