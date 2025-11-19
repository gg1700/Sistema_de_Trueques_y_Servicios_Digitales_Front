import styles from './RankingCard.module.css'

interface RankingCardProps{
    cod_us: number,
    imagenUsuario: string | File,
    handlename: string,
    nombreUsuario: string,
    point: number | string,
    puesto: number
}
export default function RankingCard({
    cod_us,
    imagenUsuario,
    handlename,
    nombreUsuario,
    point,
    puesto
}:RankingCardProps){
    return(
        <div className={styles.containerCard}>
            <div className={styles.userImage}>
                <img 
                  src={imagenUsuario}
                  alt={cod_us.toString()}
                  className={styles.imageUser}
                />
            </div>
            <div>
                <span>#</span>
                <span className={styles.point}></span>
            </div>
            <div>
                <h1 className={styles.handlename}>{handlename}</h1>
                <h4 className={styles.userName}>{nombreUsuario}</h4>
            </div>
        </div>
    );
}