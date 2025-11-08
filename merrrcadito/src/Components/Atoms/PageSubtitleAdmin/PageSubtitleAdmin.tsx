import styles from './PageSubtitleAdmin.module.css'

interface PageSubtitleAdminProps{
    text: string;
}

export default function PageSubtitleAdmin({text}:PageSubtitleAdminProps){
    return(
        <h2 className={styles.pageSubtitle}>{text}</h2>
    );
}