import styles from './RankingCard.module.css'

interface RankingCardProps{
    imagenUsuario: string | File,
    handlename: string,
    nombreUsuario: string,
    point: number | string,
}
export default function RankingCard(){
    return(
        <div className={styles.containerCard}>
            <div className={styles.userImage}>
                <img className={styles.imageUser}/>
            </div>
            <div>
                <span>#</span>
                <span className={styles.point}></span>
            </div>
            <div>
                <h1 className={styles.handlename}></h1>
                <h4 className={styles.userName}></h4>
            </div>
        </div>
    );
}