import { useState } from 'react';
import { DeleteSeccion } from '@/Components/Organisms';
import { CategoryService } from '@/services';

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
}: DeleteCategoryProps) {

  console.log("1. DeleteCategory recibió:", { categoryCod, categoryName });

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      console.log("Llamando SP para categoría:", categoryCod);
      await CategoryService.deleteCategory(categoryCod);
      onSuccess();
    } catch (error) {
      console.error("Error eliminando categoría:", error);
    } finally {
      setIsLoading(false);
    }
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