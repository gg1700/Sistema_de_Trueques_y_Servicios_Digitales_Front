import { useState } from 'react';
import DeleteSeccion from '../../DeleteSeccionComponent/deleteSeccion'; // Importar el componente reutilizable

interface DeleteSubcategoryProps {
  subcategoryCod: number;
  subcategoryName: string; 
  onSuccess: () => void; 
  onCancel: () => void;
}

export default function DeleteSubcategory({
  subcategoryCod, 
  subcategoryName, 
  onSuccess, 
  onCancel
}: DeleteSubcategoryProps){
    
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirmDelete = () => {
        setIsLoading(true);

        console.log("Llamando SP para subcategoría:", subcategoryCod);
        onSuccess();
        setIsLoading(false);
    }
         
    return (
      <DeleteSeccion 
        type="subcategoria"
        seccionName={subcategoryName}
        onConfirm={handleConfirmDelete}
        onCancel={onCancel}
      />
    );
}