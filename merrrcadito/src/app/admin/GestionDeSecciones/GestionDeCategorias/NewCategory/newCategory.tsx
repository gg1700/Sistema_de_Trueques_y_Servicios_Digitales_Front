import {FormSeccion} from "@/Components/Organisms";
import { CategoryService } from "@/services";

interface NewCategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewCategory({onSubmit, onCancel}:NewCategoryProps){

    const dataTypes=[
        {value:"1", label:"Producto"},
        {value: "2", label: "Servicio"}
    ]

    const handleSubmit = async (formData:any) => {
        try{
         const categoryData = {
            nom_cat: formData.nombre,           
            descr_cat: formData.descripcion,    
            imagen_repr: formData.imagen,       
            tipo_cat: formData.seccion   
         };

            const result=await CategoryService.registerCategory(categoryData);
            console.log("Categoria registrada", result);
        }catch (error) {
                console.error("Error creando categoría:", error);
        }
    }

    return(
        <FormSeccion 
            type={'category'}
            onSubmit={handleSubmit}
            onCancel={onCancel}
            isEditing={false}
            selectOptions={dataTypes}
        />
    ); 
}
