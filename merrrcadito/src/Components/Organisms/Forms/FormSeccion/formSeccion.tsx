'use client'
import styles from './formSeccion.module.css';
import { useState, useEffect } from 'react';
import {FormField} from '../../../Molecules';
import {SelectInput, GenericInput, AreaInput, FileInput, ButtonForm, ButtonCancel} from '../../../Atoms';
import { CommunValidators, SeccionValidators, ValidateField } from '@/Utils/FormValidation';


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

    function validateForm():boolean{
        const newErrors = {
            seccion: "",
            nombre: "",
            descripcion: "",
            imagen: ""
        };

        newErrors.seccion=ValidateField(
            form.seccion,
            [CommunValidators.required]
        ) || "";

        newErrors.nombre=ValidateField(
            form.nombre,
            [CommunValidators.required,
             SeccionValidators.nombre
            ]
        ) || "";

        newErrors.descripcion=ValidateField(
            form.descripcion,
            [CommunValidators.required,
             SeccionValidators.descripcion
            ]
        ) || "";
        
        newErrors.imagen=ValidateField(
            form.imagen,
            [CommunValidators.required]
        ) || "";

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