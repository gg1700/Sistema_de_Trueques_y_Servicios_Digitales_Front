import {FormSeccion} from '@/Components/Organisms';
import { useState } from "react";
import { CategoryService } from '@/services';


interface UpdateCategoryProps{
  categoryCod: number,
  initialData:{
    seccion: string;
    nombre: string;
    descripcion: string;
    imagen: string | null;
  },
  onSubmit: () => void,
  onCancel: () => void
}

export default function UpdateCategory({
  categoryCod, 
  initialData,
  onSubmit, 
  onCancel
}:UpdateCategoryProps){

  const dataType=[
    {value: "Producto",label:"Producto"},
    {value:"Servicio",label:"Servicio"}
  ];

  const handleActualizar = async (formData: any) => {
    try{
      console.log("Actualizando ", categoryCod);
      console.log("los datos", formData);
      const updateData = {
        nom_cat: formData.nombre,
        descr_cat: formData.descripcion,
        imagen_repr: formData.imagen,
        tipo_cat: formData.seccion
      };

      console.log("Datos para update:", updateData);
      const result = await CategoryService.updateCategory(categoryCod, updateData);
      console.log(result);

    }catch (error){
       console.error("Error actualizando categoría:", error);
    }
  }
    return (

      <>
        
          <FormSeccion 
              type={'category'}
              initialData={initialData}
              onSubmit={handleActualizar}
              onCancel={onCancel}
              isEditing={true}
              selectOptions={dataType}
          />
      </>
    );
}