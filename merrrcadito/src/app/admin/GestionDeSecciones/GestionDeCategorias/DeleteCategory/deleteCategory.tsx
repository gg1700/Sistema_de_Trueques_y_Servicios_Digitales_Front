import { useState } from 'react';
import DeleteSeccion from '../../../../Components/Organisms/DeleteSeccionComponent/deleteSeccion'; 

interface DeleteCategoryProps {
  categoryCod: number;
  categoryName: string; 
  onSuccess: () => void; 
  onCancel: () => void;
}

export default function DeleteCategory({
  categoryCod, 
  categoryName, 
  onSuccess, 
  onCancel
}: DeleteCategoryProps){

  console.log("1. DeleteCategory recibió:", { categoryCod, categoryName });
    
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmDelete = () => {
        setIsLoading(true);

        console.log("Llamando SP para categoría:", categoryCod);
        onSuccess();
        setIsLoading(false);
    }
         
    return (
      <DeleteSeccion 
        type="category"
        seccionName={categoryName}
        onConfirm={handleConfirmDelete}
        onCancel={onCancel}
      />
    );
}