'use client'
import styles from './RankingCard.module.css'
import { useState } from 'react'

const USERS_API_BASE =
    process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
    "http://localhost:5000/api/users";

interface RankingCardProps {
    cod_us: number,
    imagenUsuario: string | File,
    handlename: string,
    nombreUsuario: string,
    points: number | string,
    puesto: number,
    label?: string
}
export default function RankingCard({
    cod_us,
    imagenUsuario,
    handlename,
    nombreUsuario,
    points,
    puesto,
    label = "Puntos"
}: RankingCardProps) {
    const [imageError, setImageError] = useState(false);

    // Construir la URL de la imagen usando el código de usuario
    const imageUrl = `${USERS_API_BASE}/${cod_us}/image`;

    // Construir la URL de la imagen por defecto del backend
    // Quitamos /api/users y accedemos a la ruta estática
    const baseUrl = USERS_API_BASE.split('/api')[0]; // http://localhost:5000
    const defaultImageUrl = `${baseUrl}/src/images/user_default_image.png`;

    return (
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
                <span className={styles.pointsLabel}>{label}</span>
                <span className={styles.point}>{points}</span>
            </div>
        </div>
    );
}