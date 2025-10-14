
import styles from './eliminacionSubcategoriaCSS.module.css'



export default function ModalEliminar({onCancelar, children}:any){
    return(
        <div className={styles.modalContainer}>
            <div className={styles.modalBody}>
                {children}
            </div>
        </div>
    );
}