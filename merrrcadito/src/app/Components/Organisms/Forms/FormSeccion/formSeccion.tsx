'use client'
import styles from './formSeccion.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import {FormField} from '../../../Molecules';
import {SelectInput, GenericInput, AreaInput, FileInput, ButtonForm, ButtonCancel} from '../../../Atoms';


interface FormProps {
    type?: 'category' | 'subcategory';
    initialData?: {
        seccion: string;
        nombre: string;
        descripcion: string;
        imagen?: File | null;
    };
    onSubmit: (formData: any) => void;
    onCancel?:() => void;
    selectOptions?: Array<{
            value: string;
            label: string;
        }>;
    isEditing?: boolean;
    id?: number;
}

export default function FormSeccion({ 
  type='subcategory',
  initialData, 
  onSubmit,
  onCancel,
  selectOptions, 
  isEditing = false,
}: FormProps) {



    const router = useRouter();
    const [form, setForm] = useState({
        seccion: "",
        nombre: "",
        descripcion: "",
        imagen: null as File | null 
    });

    const [error, setErrors] = useState({
        seccion: "",
        nombre: "",
        descripcion: "",
        imagen: ""
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                seccion: initialData.seccion || "",
                nombre: initialData.nombre || "",
                descripcion: initialData.descripcion || "",
                imagen: initialData.imagen || null
            });
        }
    }, [initialData]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
      const { name, value } = e.target;
       setForm(prev => ({
        ...prev,
        [name]: value
       }));

       if(error[name as keyof typeof error]){
        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));
       }
    } 

    function handleFileChange(file: File | null) {
         setForm(prev => ({
        ...prev,
        imagen: file
        }));
        if (error.imagen) {
            setErrors(prev => ({
                ...prev,
                imagen: ""
            }));
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        if(validateForm()){
            onSubmit(form);
              
        } else {
            console.log("Form INCORRECTO");
        }
    }

    function validateForm(){
        const newErrors = {
            seccion: "",
            nombre: "",
            descripcion: "",
            imagen: ""
        };

        if(!form.seccion){
            newErrors.seccion = "Debe seleccionar "+(type==='subcategory'? 'una categoria': 'un tipo');
        }

        if(!form.nombre.trim()){
            newErrors.nombre = "El nombre de la" +(type==='subcategory'? 'Subcategoria': 'Categoria')+ " es obligatorio";
        } else if(form.nombre.length <= 2){
            newErrors.nombre = "NO puede ser menos de 3 caracteres";
        }

        if(!form.descripcion.trim()){
            newErrors.descripcion = "La descripcion es obligatoria";
        } else if(form.descripcion.length < 10){
            newErrors.descripcion = "Debe ser una descripcion más detallada";
        }
        
        if(!form.imagen){
            newErrors.imagen = "Debe subir una imagen";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    }

    function handleCancel(){
        setForm({
            seccion: "",
            nombre: "",
            descripcion: "",
            imagen: null 
        });

        setErrors({
            seccion: "",
            nombre: "",
            descripcion: "",
            imagen: ""
        });

        if (onCancel) {
            onCancel();  
        }
    }

    return(
        <div className={styles.formContainer}>
          <form className={styles.formBody} onSubmit={handleSubmit}>
            <FormField

                htmlFor="seccion"
                label={type==="subcategory"? "Categoria" : "Tipo"}
                error={error.seccion}
                required
            >
                <SelectInput
                    name="seccion"
                    value={form.seccion}
                    onChange={handleChange}
                    options={selectOptions || []} 
                    placeholder={type === "subcategory" ? "Seleccione una categoría" : "Seleccione un tipo"}
                    disabled={false}
                    error={!!error.seccion}
                >
                </SelectInput>
            </FormField>

            <FormField 
                htmlFor="nombre"
                label="Nombre"
                error={error.nombre}
                required
            >
                <GenericInput
                    type='text'
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    disabled={false}
                    error={!!error.nombre}

                >
                </GenericInput>
            </FormField>

            <FormField 
                htmlFor="descripcion"
                label="Descripcion"
                error={error.descripcion}
                required
            >
                <AreaInput
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    disabled={false}
                    error={!!error.descripcion}
                >
                </AreaInput>
            </FormField>

            <FormField
                htmlFor="imagen"
                label="Subir Imagen"
                error={error.imagen}
                required
            >
                <FileInput
                    name="imagen"
                    onChange={handleFileChange}
                    error={!!error.imagen}
                >
                </FileInput>
            </FormField>

            <ButtonForm
                 type='submit'
                 action={isEditing? 'update' : 'register'}
                 entity={type}
            />

            <ButtonCancel 
                onClick={handleCancel}
            />
          </form>
        </div>
    );
}