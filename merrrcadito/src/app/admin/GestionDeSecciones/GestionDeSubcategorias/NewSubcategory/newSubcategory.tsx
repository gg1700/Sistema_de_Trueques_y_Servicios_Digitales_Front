'use client'
import { useRouter } from 'next/navigation';
import {FormSeccion} from '@/Components/Organisms';

interface NewSubcategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewSubcategory(
 { onSubmit, onCancel }: NewSubcategoryProps
) {
  const router = useRouter();

  const dataCategories=[
    {codCat:1,nombreCat:"Textil"},
    {codCat:2,nombreCat:"Casa"},
    {codCat:3,nombreCat:"Limpieza"}
  ];

  const selectOptions = dataCategories.map(cat => ({
    value: cat.codCat.toString(),  
    label: cat.nombreCat
  }));

  const handleSubmit = async (formData: any) => {
    const adaptedFormData = {
      categoria: formData.seccion,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      imagen: formData.imagen
    };

    if (onSubmit) {
      onSubmit();
    }
    
    console.log("Creando subcategoría:", adaptedFormData);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
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