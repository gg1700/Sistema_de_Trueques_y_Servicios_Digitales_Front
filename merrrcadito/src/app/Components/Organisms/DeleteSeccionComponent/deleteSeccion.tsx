import styles from './deleteSeccion.module.css'
import ButtonForm from '../../Atoms/ButtonForm/ButtonForm'
import ButtonCancel from '../../Atoms/ButtonCancel/ButtonCancel'

interface DeleteSeccionProps{
    type: 'subcategory' | 'category';
    seccionName: string;
    onConfirm: () => void;
    onCancel: () => void;
}


export default function DeleteSeccion({type,seccionName, onConfirm,onCancel}:DeleteSeccionProps){

     console.log("3. DeleteSeccion recibió:", { type, seccionName, onConfirm });

    return(
        <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
                <h2>Está seguro que desea eliminar <strong>{seccionName}</strong>?</h2>
            </div>
            <div className={styles.modalActions}>
                <ButtonForm 
                    type="delete"
                    action="delete"
                    entity={type}
                    onClick={onConfirm}
                />
                <ButtonCancel
                    onClick={onCancel}
                />
            </div>
        </div>   
    );
}