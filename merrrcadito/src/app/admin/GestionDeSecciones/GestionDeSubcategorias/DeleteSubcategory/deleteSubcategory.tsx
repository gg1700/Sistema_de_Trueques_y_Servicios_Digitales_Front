import { useState } from 'react';
import { DeleteSeccion } from '@/Components/Organisms';
import { SubcategoryService } from '@/services';

interface DeleteSubcategoryProps {
  subcategoryCod: number;
  subcategoryName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeleteSubcategory({
  subcategoryCod,
  subcategoryName,
  onCancel,
  onSuccess
}: DeleteSubcategoryProps) {

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      console.log("Llamando SP para subcategoría:", subcategoryCod);
      await SubcategoryService.deleteSubcategory(subcategoryCod);
      onSuccess();
    } catch (error) {
      console.error("Error eliminando subcategoría:", error);
    } finally {
      setIsLoading(false);
    }
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