import styles from './RankingCard.module.css'

interface RankingCardProps{
    cod_us: number,
    imagenUsuario: string | File,
    handlename: string,
    nombreUsuario: string,
    points: number | string,
    puesto: number
}
export default function RankingCard({
    cod_us,
    imagenUsuario,
    handlename,
    nombreUsuario,
    points,
    puesto
}:RankingCardProps){
    return(
        <div className={styles.containerCard}>
             <div className={styles.rankBadge}>
                #{puesto}
            </div>
            <div className={styles.userImage}>
                <img 
                  src={imagenUsuario}
                  alt={cod_us.toString()}
                  className={styles.imageUser}
                />
            </div>
            <div className={styles.userInfo}>
                <h1 className={styles.handlename}>{handlename}</h1>
                <h4 className={styles.userName}>{nombreUsuario}</h4>
            </div>
             <div className={styles.pointsContainer}>
                <span className={styles.pointsLabel}>Puntos</span>
                <span className={styles.point}>{points}</span>
            </div>
        </div>
    );
}