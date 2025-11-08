import {FormSeccion} from '@/Components/Organisms';
import { useState } from "react";


interface UpdateSubcategoryProps{
  subcategoryCod: number,
  onSubmit: () => void,
  onCancel: () => void
}

export default function UpdateSubcategory({subcategoryCod, onSubmit, onCancel}:UpdateSubcategoryProps){

  const [initialData, setInitialData] = useState(null);


  const dataType=[
    {value: "1",label:"Producto"},
    {value:"2",label:"Servicio"}
  ]

  //CREAR FUNCION QUE DEVUELVA LOS DATOS DE LA CATEGORIA CARGADA

  const handleActualizar = async (formData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Actualizando:", formData);
    const response= new Response(JSON.stringify({ 
      success: true, 
      message: "categoría actualizada" 
    }), { status: 200 });
    onSubmit();
    return response;
  }
    return (

      <>
        
          <FormSeccion 
              type={'category'}
              initialData={{seccion:"1",nombre:"Textil",descripcion:"Dime que estas orgulloso de mi shifu dimelo",imagen:null}}
              onSubmit={handleActualizar}
              onCancel={onCancel}
              isEditing={true}
              selectOptions={dataType}
          />
      </>
    );
}