import { ButtonForm } from '@/Components/Atoms';
import styles from './PublicationCard.module.css'

interface PublicationProps {
    pub: {
        cod_pub: number,
        nombre_publicacion: string,
        nombre_categoria: string,
        nombre_subcat?: string,
        precio_pub?: number,
        foto_pub: string | null,
        calif_pond_pub: number,
        calidad?: string,
        handlename: string,
        estado_pub: 'activo' | 'inactivo'
    },
    onOpenModal: () => void,
    onPurchaseClick?: () => void
}

export default function PublicationCard({
    pub,
    onOpenModal,
    onPurchaseClick
}: PublicationProps) {

    const getStatusClass = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case 'activo': return styles.statusActive;
            case 'inactivo': return styles.statusInactive;
            default: return '';
        }
    };

    const cod_publication = pub.cod_pub.toString();

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {pub.foto_pub && (
                    <img
                        src={pub.foto_pub}
                        alt={cod_publication}
                        className={styles.image}
                    />
                )}
            </div>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{pub.nombre_publicacion}</h1>
                    <h3 className={styles.seccion}>{pub.nombre_categoria}</h3>
                    <h2 className={styles.seccion}>{pub.handlename}</h2>
                </div>
                <div className={styles.priceSection}>
                    <p className={styles.price}>
                        {pub.precio_pub}
                    </p>
                    <p className={styles.tokens}>Tokens</p>
                </div>
                <div className={styles.infoContainer}>
                    <span className={`${styles.status} ${getStatusClass(pub.estado_pub)}`}>
                        Estado: {pub.estado_pub}
                    </span>
                </div>
                {pub.calidad && <div className={styles.qualitySection}>
                    <span className={styles.qualityLabel}>Calidad:</span>
                    <span className={styles.qualityValue}>{pub.calidad}</span>
                </div>
                }
            </div>
            <div className={styles.buttonContainer}>
                {onPurchaseClick && pub.estado_pub === 'activo' && (
                    <button
                        onClick={onPurchaseClick}
                        style={{
                            backgroundColor: '#1fb7a1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 12px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginBottom: '8px',
                            width: '100%',
                            minWidth: '90px'
                        }}
                    >
                        Comprar
                    </button>
                )}
                <ButtonForm
                    type='open'
                    action='watch'
                    entity='publication'
                    onClick={onOpenModal}
                />
            </div>
        </div>
    );
}