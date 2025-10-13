import { Children } from 'react';
import styles from './eliminacionSubcategoriaCSS.module.css'



export default function ModalEliminar({onCancelar, Children}:any){
    return(
        <div className={styles.modalContainer}>
            <div className={styles.modalBody}>
                {Children}
            </div>
        </div>
    );
}