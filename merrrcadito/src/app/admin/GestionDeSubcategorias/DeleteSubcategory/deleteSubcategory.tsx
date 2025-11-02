import { useState } from 'react';
import styles from  './deleteSubcategory.module.css'

interface DeleteSubcategoryProps {
  subcategoryCod: number;
  subcategoryName: string; 
  onSuccess: () => void; 
  onCancel: () => void;
}

export default function DeleteSubcategory({subcategoryCod, subcategoryName, onSuccess, onCancel}:DeleteSubcategoryProps){
    
    const [remove, setRemove] = useState(false);

    const handleDelete = () => {
        setRemove(true);
        //LLAMA SP
        console.log("Subcategoria eliminada");
        onSuccess();
        setRemove(false);
    }
         
    return (
    <>
      <div className={styles.modalContent}>
       <div className={styles.modalHeader}>
          <h2>Está seguro que desea eliminar <strong>{subcategoryName}</strong>?</h2>
       </div>
       <div className={styles.modalActions}>
          <button onClick={handleDelete} className = {styles.buttonEliSub}>{remove ? 'Eliminando...' : 'Si, eliminar'}</button>
          <button type ="button" onClick={onCancel} className={styles.buttonCancel}>Cancelar</button>
       </div>
      </div>
    </>
    );

}