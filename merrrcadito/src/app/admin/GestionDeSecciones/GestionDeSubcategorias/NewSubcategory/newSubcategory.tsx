'use client'
import { useRouter } from 'next/navigation';
import {FormSeccion} from '@/Components/Organisms';
import {SubcategoryService} from '@/services'

interface NewSubcategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewSubcategory(
 { onSubmit, onCancel }: NewSubcategoryProps
) {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    try{
      const subcategoryData = {
        cod_cat: formData.seccion,
        nom_subcat_prod: formData.nombre,
        descr_subcat_prod: formData.descripcion,
        imagen_representativa: formData.imagen
      };

      if (onSubmit) {
        onSubmit();
      }
      
      console.log("Creando subcategoría:", subcategoryData);
      return await SubcategoryService.registerSubcategory(subcategoryData);
    }catch(error){
      console.error('Error creando subcateoria: ', error);
    }
  }

  return(
    <FormSeccion 
      type={'subcategory'}
      initialData={undefined}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isEditing={false}
      selectOptions={selectOptions}
    />
  );
}