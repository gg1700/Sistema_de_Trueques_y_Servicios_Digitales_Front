import styles from './deleteSeccion.module.css'

interface DeleteSeccionProps{
    type: 'subcategoria' | 'categoria';
    seccionName: string;
    onConfirm: () => void;
    onCancel: () => void;
}


export default function DeleteSeccion({type,seccionName, onConfirm,onCancel}:DeleteSeccionProps){

    return(
        <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
                <h2>Está seguro que desea eliminar <strong>{seccionName}</strong>?</h2>
            </div>
            <div className={styles.modalActions}>
                <button onClick={onConfirm} className = {styles.buttonEliSub}>Eliminar</button>
                <button type ="button" onClick={onCancel} className={styles.buttonCancel}>Cancelar</button>
            </div>
            </div>    
    );
}