import {FormSeccion} from '@/Components/Organisms';
import { useState } from "react";
import { CategoryService } from '@/services';


interface UpdateSubcategoryProps{
  categoryCod: number,
  initialData: any,
  onSubmit: () => void,
  onCancel: () => void
}

export default function UpdateSubcategory({categoryCod, onSubmit, onCancel}:UpdateSubcategoryProps){

  const dataType=[
    {value: "1",label:"Producto"},
    {value:"2",label:"Servicio"}
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