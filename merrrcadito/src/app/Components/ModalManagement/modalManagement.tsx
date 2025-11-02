import styles from './modalManagement.module.css'

export default function ModalManagement({onCancelar, children}:any){
    return(
        <div className={styles.modalContainer}>
            <div className={styles.modalBody}>
                {children}
            </div>
        </div>
    );
}