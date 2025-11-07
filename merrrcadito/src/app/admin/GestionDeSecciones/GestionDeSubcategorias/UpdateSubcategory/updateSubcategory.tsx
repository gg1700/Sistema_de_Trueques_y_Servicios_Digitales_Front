import FormSeccion from '../../../../Components/Organisms/Forms/FormSeccion/formSeccion';
import { useState } from "react";


interface UpdateSubcategoryProps{
  subcategoryCod: number,
  onSubmit: () => void,
  onCancel: () => void
}

export default function UpdateSubcategory({subcategoryCod, onSubmit, onCancel}:UpdateSubcategoryProps){

  const [initialData, setInitialData] = useState(null);

  const dataCategories = [
    { codCat: 1, nombreCat: "Textil" },
    { codCat: 2, nombreCat: "Casa" },
    { codCat: 3, nombreCat: "Limpieza" }
  ];

  const selectCategories = dataCategories.map(cat =>({
    value: cat.codCat.toString(),
    label: cat.nombreCat
   }));

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
              type={'subcategory'}
              initialData={{seccion:"1",nombre:"Ropa varon",descripcion:"Dime que estas orgulloso de mi shifu dimelo",imagen:null}}
              onSubmit={handleActualizar}
              onCancel={onCancel}
              isEditing={true}
              selectOptions={selectCategories}
          />
      </>
    );
}