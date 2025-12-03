'use client'
import styles from './RankingCO2Card.module.css'
import { useState, useEffect } from 'react'
import { ReportService } from '@/services'

const USERS_API_BASE =
    process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
    "http://localhost:5000/api/users";

interface RankingCO2CardProps {
    cod_us: number,
    imagenUsuario: string | File,
    handlename: string,
    nombreUsuario: string,
    points: number | string,
    puesto: number
}

export default function RankingCO2Card({
    cod_us,
    imagenUsuario,
    handlename,
    nombreUsuario,
    points,
    puesto
}: RankingCO2CardProps) {
    const [imageError, setImageError] = useState(false);
    const [environmentalData, setEnvironmentalData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    // Construir la URL de la imagen usando el código de usuario
    const imageUrl = `${USERS_API_BASE}/${cod_us}/image`;

    // Construir la URL de la imagen por defecto del backend
    const baseUrl = USERS_API_BASE.split('/api')[0];
    const defaultImageUrl = `${baseUrl}/src/images/user_default_image.png`;

    useEffect(() => {
        async function fetchEnvironmentalData() {
            try {
                const response = await ReportService.get_user_environmental_impact(cod_us);
                setEnvironmentalData(response.data);
            } catch (error) {
                console.error('Error fetching environmental data:', error);
            }
        }
        fetchEnvironmentalData();
    }, [cod_us]);

    return (
        <>
            <div className={styles.containerCard}>
                <div className={styles.rankBadge}>
                    #{puesto}
                </div>
                <div className={styles.userImage}>
                    {!imageError ? (
                        <img
                            src={imageUrl}
                            alt={handlename}
                            className={styles.imageUser}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <img
                            src={defaultImageUrl}
                            alt="Usuario sin foto"
                            className={styles.imageUser}
                        />
                    )}
                </div>
                <div className={styles.userInfo}>
                    <h1 className={styles.handlename}>{handlename}</h1>
                    <h4 className={styles.userName}>{nombreUsuario}</h4>
                </div>
                <div className={styles.pointsContainer}>
                    <span className={styles.pointsLabel}>Puntaje CO2</span>
                    <span className={styles.point}>{points}</span>
                </div>

                <button
                    className={styles.detailsButton}
                    onClick={() => setShowModal(true)}
                >
                    Ver Detalles
                </button>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Detalles de Impacto Ambiental</h2>
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.userInfoModal}>
                                <h3>{handlename}</h3>
                                <p>{nombreUsuario}</p>
                            </div>
                            {environmentalData && (
                                <div className={styles.detailsGrid}>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Impacto Total:</span>
                                        <span className={styles.detailValue}>{environmentalData.huella_co2_total?.toFixed(2) || 0} kg CO2</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Impacto Promedio por Publicación de Productos Comprada:</span>
                                        <span className={styles.detailValue}>{environmentalData.impacto_promedio_productos?.toFixed(2) || 0} kg CO2</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Impacto Promedio por Publicación de Servicios Comprada:</span>
                                        <span className={styles.detailValue}>{environmentalData.impacto_promedio_servicios?.toFixed(2) || 0} kg CO2</span>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <span className={styles.detailLabel}>Impacto Promedio por Publicación de Intercambios:</span>
                                        <span className={styles.detailValue}>{environmentalData.impacto_promedio_intercambios?.toFixed(2) || 0} kg CO2</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
