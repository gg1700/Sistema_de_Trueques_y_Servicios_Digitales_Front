import {FormSeccion} from "@/Components/Organisms";

interface NewCategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewCategory({onSubmit, onCancel}:NewCategoryProps){

    const dataTypes=[
        {value:"1", label:"Producto"},
        {value: "2", label: "Servicio"}
    ]

    const handleSubmit = async (formData: any) => {
        const adaptedFormData = {
        tipo: formData.seccion,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        imagen: formData.imagen
    }};

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

