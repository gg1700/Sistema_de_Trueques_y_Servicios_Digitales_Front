import styles from './eliminacionSubcategoriaCSS.module.css'



export default function ModalEliminar({onCancelar}:any){
    return(
        <div className={styles.modalContainer}>
            <div className={styles.modalBody}>
                <h3 className={styles.modalHeader}>Eliminar Subcategoria Seleccionada</h3>
                <p>¿Está seguro de eliminar ésta subcategoria?</p>
                <button className={styles.botonEliminar}>Si, eliminar</button>
                <button className={styles.botonCancelar} onClick={onCancelar}>Cancelar</button>
            </div>
        </div>
    );
}