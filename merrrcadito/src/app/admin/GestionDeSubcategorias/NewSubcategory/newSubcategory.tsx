'use client'
import { useRouter } from 'next/navigation';
import FormSeccion from '@/app/Components/Forms/FormSeccion/formSeccion';

interface NewSubcategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewSubcategory(
 { onSubmit, onCancel }: NewSubcategoryProps
) {
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    const adaptedFormData = {
      categoria: formData.seccion,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      imagen: formData.imagen
    };
    
    console.log("Creando subcategoría:", adaptedFormData);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return(
    <FormSeccion 
      type={'subcategoria'}
      initialData={undefined}
      onSubmit={handleSubmit}
      isEditing={false}
    />
  );
}