import { useState } from 'react';
import DeleteSeccion from '../../DeleteSeccionComponent/deleteSeccion'; // Importar el componente reutilizable

interface DeleteSubcategoryProps {
  categoryCod: number;
  categoryName: string; 
  onSuccess: () => void; 
  onCancel: () => void;
}

export default function DeleteSubcategory({
  categoryCod, 
  categoryName, 
  onSuccess, 
  onCancel
}: DeleteSubcategoryProps){
    
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmDelete = () => {
        setIsLoading(true);

        console.log("Llamando SP para categoría:", categoryCod);
        onSuccess();
        setIsLoading(false);
    }
         
    return (
      <DeleteSeccion 
        type="categoria"
        seccionName={categoryName}
        onConfirm={handleConfirmDelete}
        onCancel={onCancel}
      />
    );
}