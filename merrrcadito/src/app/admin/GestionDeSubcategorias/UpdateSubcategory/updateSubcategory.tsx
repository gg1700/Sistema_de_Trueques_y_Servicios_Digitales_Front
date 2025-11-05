import FormSeccion from "../../../Components/Forms/FormSeccion/formSeccion";
import { useState } from "react";


interface UpdateSubcategoryProps{
  subcategoryCod: number,
  onSubmit: () => void,
  onCancel: () => void
}

export default function UpdateSubcategory({subcategoryCod, onSubmit, onCancel}:UpdateSubcategoryProps){

  const [initialData, setInitialData] = useState(null);

  //CREAR FUNCION QUE DEVUELVA LOS DATOS DE LA SUBCATEGORIA CARGADA

  const handleActualizar = async (formData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Actualizando:", formData);
    const response= new Response(JSON.stringify({ 
      success: true, 
      message: "Subcategoría actualizada" 
    }), { status: 200 });
    onSubmit();
    return response;
  }
    return (

      <>
        
          <FormSeccion 
              type={'subcategoria'}
              initialData={{seccion:"No es pan",nombre:"Ropa varon",descripcion:"Dime que estas orgulloso de mi shifu dimelo",imagen:null}}
              onSubmit={handleActualizar}
              onCancel={onCancel}
              isEditing={true}
          />
      </>
    );
}