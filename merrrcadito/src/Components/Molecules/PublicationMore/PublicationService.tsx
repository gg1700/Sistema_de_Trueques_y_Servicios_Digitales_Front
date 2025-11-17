import { ButtonCancel } from '@/Components/Atoms';
import styles from './PublicationMore.module.css';

interface PubServProps{
    pub:{
        descripcion: string,
        fecha_ini_pub: string,
        duracion: number,
        contacto_correo: string;
        contacto_numero: number;
        hrs_ini_serv: string,
        hrs_fin_serv: string,
        handlename: string
    },
    onCancel: () => void
}

export default function PublicationService({
   pub,
   onCancel
}:PubServProps){
    return(
        <div className={styles.container}>
            <div className={styles.description}>
                <p>{pub.descripcion}</p>
            </div>
            <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Duracion</span>
                    <span className={styles.pOrsBadge}>{pub.duracion}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Hora de inicio</span>
                    <span className={styles.pOrsBadge}>{pub.hrs_ini_serv}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Hora de finalización</span>
                    <span className={styles.pOrsBadge}>{pub.hrs_fin_serv}</span>
                </div>
            </div>
            <div className={styles.contactSection}>
                <h3 className={styles.contactTitle}>Información de Contacto</h3>
                <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                        <span className={styles.contactText}>{pub.contacto_correo}</span>
                    </div>
                    <div className={styles.contactItem}>
                        <span className={styles.contactText}>{pub.contacto_numero}</span>
                    </div>
                </div>
            </div>
            <ButtonCancel onClick={onCancel}/>
        </div>
    );
}