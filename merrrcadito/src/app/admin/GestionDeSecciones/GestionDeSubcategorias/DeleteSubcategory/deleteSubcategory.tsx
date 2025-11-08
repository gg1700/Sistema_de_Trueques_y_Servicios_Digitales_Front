import { useState } from 'react';
import {DeleteSeccion} from '@/Components/Organisms'; 

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
        type='subcategory'
        seccionName={subcategoryName}
        onConfirm={handleConfirmDelete}
        onCancel={onCancel}
      />
    );
}