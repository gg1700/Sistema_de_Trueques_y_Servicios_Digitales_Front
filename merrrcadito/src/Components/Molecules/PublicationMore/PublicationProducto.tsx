import { ButtonCancel } from '@/Components/Atoms';
import styles from './PublicationMore.module.css'

interface PubPropsProd {
    pub:{
        descripcion: string,
        fecha_ini_pub: string,
        contacto_correo: string,
        contacto_numero: number,
        cantidad: number,
        marca?: string,
        handlename: string
    },
    onCancel: () => void
}

export default function PublicationMore({
    pub,
    onCancel
}:PubPropsProd) {
    
    return(
        <div className={styles.container}>
            <div className={styles.description}>
                <p>{pub.descripcion}</p>
            </div>
                <div className={styles.detailsGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Cantidad</span>
                        <span className={styles.pOrsBadge}>{pub.cantidad} unidades</span>
                    </div>
                    {pub.marca && (
                        <div className={styles.detailItem}>
                            <span className={styles.detailLabel}>Marca</span>
                            <span className={styles.pOrsBadge}>{pub.marca}</span>
                        </div>
                    )}
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