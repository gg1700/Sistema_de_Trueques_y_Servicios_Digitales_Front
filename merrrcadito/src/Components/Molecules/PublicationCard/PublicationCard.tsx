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
        estado_pub: 'activo' | 'inactivo',
        descripcion?: string,
        impacto_amb_pub?: number,
        marca?: string | null,
        cantidad?: number,
        unidad_medida?: string
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

    const truncateDescription = (text: string | undefined, maxLength: number = 100) => {
        if (!text) return 'Sin descripción disponible';
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const cod_publication = pub.cod_pub.toString();

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={pub.foto_pub || `${process.env.NEXT_PUBLIC_API_URL}/images/default_image.jpg`}
                    alt={pub.nombre_publicacion}
                    className={styles.image}
                    onError={(e) => {
                        e.currentTarget.src = `${process.env.NEXT_PUBLIC_API_URL}/images/default_image.jpg`;
                    }}
                />
                {/* Badge de estado en la esquina superior derecha */}
                <span className={`${styles.statusBadge} ${getStatusClass(pub.estado_pub)}`}>
                    {pub.estado_pub}
                </span>
                {/* Badge de impacto ambiental si existe */}
                {pub.impacto_amb_pub && pub.impacto_amb_pub > 0 && (
                    <div className={styles.environmentalBadge}>
                        <i className="bi bi-leaf-fill"></i>
                        <span>{pub.impacto_amb_pub} pts CO2</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                {/* Título y categoría */}
                <div className={styles.header}>
                    <h3 className={styles.title}>{pub.nombre_publicacion}</h3>
                    <p className={styles.category}>
                        {pub.nombre_categoria}
                        {pub.nombre_subcat && ` • ${pub.nombre_subcat}`}
                    </p>
                </div>

                {/* Vendedor */}
                <div className={styles.sellerSection}>
                    <div className={styles.seller}>
                        <i className="bi bi-person-circle"></i>
                        <span>@{pub.handlename}</span>
                    </div>
                </div>

                {/* Descripción truncada */}
                <p className={styles.description}>
                    {truncateDescription(pub.descripcion)}
                </p>

                {/* Información adicional */}
                <div className={styles.details}>
                    {pub.calidad && (
                        <div className={styles.detailItem}>
                            <i className="bi bi-gem"></i>
                            <span>Calidad: <strong>{pub.calidad}</strong></span>
                        </div>
                    )}
                    {pub.marca && (
                        <div className={styles.detailItem}>
                            <i className="bi bi-tag"></i>
                            <span>Marca: <strong>{pub.marca}</strong></span>
                        </div>
                    )}
                    {pub.cantidad && pub.unidad_medida && (
                        <div className={styles.detailItem}>
                            <i className="bi bi-box-seam"></i>
                            <span>Cantidad: <strong>{pub.cantidad} {pub.unidad_medida}</strong></span>
                        </div>
                    )}
                </div>

                {/* Precio destacado */}
                <div className={styles.priceSection}>
                    <div className={styles.priceContainer}>
                        <span className={styles.priceLabel}>Precio</span>
                        <div className={styles.priceValue}>
                            <span className={styles.price}>{pub.precio_pub}</span>
                            <span className={styles.currency}>CV</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className={styles.buttonContainer}>
                {onPurchaseClick && pub.estado_pub === 'activo' && (
                    <button
                        onClick={onPurchaseClick}
                        className={styles.buyButton}
                    >
                        <i className="bi bi-cart-plus"></i>
                        Comprar
                    </button>
                )}
                <button
                    onClick={onOpenModal}
                    className={styles.viewMoreButton}
                >
                    <i className="bi bi-eye"></i>
                    Ver más
                </button>
            </div>
        </div>
    );
}