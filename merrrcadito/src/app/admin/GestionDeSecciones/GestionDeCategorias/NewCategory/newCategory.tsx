import FormSeccion from "@/app/Components/Forms/FormSeccion/formSeccion";





interface NewCategoryProps {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewCategory({onSubmit, onCancel}:NewCategoryProps){

    const handleSubmit = async (formData: any) => {
        const adaptedFormData = {
        tipo: formData.seccion,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        imagen: formData.imagen
    }};

    return(
        <FormSeccion 
            type={'categoria'}
            onSubmit={handleSubmit}
            isEditing={false}
        />
    );
}

