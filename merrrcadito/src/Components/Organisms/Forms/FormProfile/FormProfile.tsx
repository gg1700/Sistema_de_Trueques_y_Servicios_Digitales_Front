'use client'
import styles from './FormProfile.module.css'
import { useState, useEffect } from 'react';
import { ButtonCancel, ButtonForm, ProfileInput } from '@/Components/Atoms';
import { FormField } from '@/Components/Molecules';
import { CommunValidators, ValidateField, UserValidators  } from '@/Utils/FormValidation';

interface  UserDataProps{
  initialData:{
    handleName: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    rol: string,
    correoElectronico: string,
    fechaNacimiento: string,
    numeroTelf: string,
    ci: string,}
}

interface FormState {
    handleName: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    rol: string;
    correoElectronico: string;
    fechaNacimiento: string;
    numeroTelf: string;
    ci: string;
}

export default  function FormProfile({initialData}:UserDataProps){
    const userFields = [
        { 
            name: 'handleName', 
            label: 'Nombre de Usuario', 
            component: 'text',
            required: true 
        },
        { 
            name: 'nombre', 
            label: 'Nombre', 
            component: 'text',
            required: true 
        },
        {
            name: 'apellidoPaterno', 
            label: 'Apellido Paterno', 
            component: 'text',
            required: true 
        },
        {
            name: 'apellidoMaterno', 
            label: 'Apellido Materno', 
            component: 'text',
            required: true 
        },
        {
            name: 'rol', 
            label: 'Rol', 
            component: 'text',
            required: true,
            readOnly: true
        },
        {
            name: 'correoElectronico', 
            label: 'Correo electronico', 
            component: 'text',
            required: true 
        },
        {
            name: 'fechaNacimiento', 
            label: 'Fecha de Nacimiento ', 
            component: 'date',
            required: true 
        },
        {
            name: 'numeroTelf', 
            label: 'Telefono', 
            component: 'text',
            required: true
        },
        {
            name: 'ci', 
            label: 'CI', 
            component: 'text',
            required: true 
        }
    ];

    const [form,setForm]=useState<FormState>({
        handleName: initialData?.handleName || "",
        nombre: initialData?.nombre || "",
        apellidoPaterno: initialData?.apellidoPaterno || "",
        apellidoMaterno: initialData?.apellidoMaterno || "",
        rol: initialData?.rol || "",
        correoElectronico: initialData?.correoElectronico || "",
        fechaNacimiento: initialData?.fechaNacimiento || "",
        numeroTelf: initialData?.numeroTelf || "",
        ci: initialData?.ci || ""
    });

    const [error,setError]=useState({
        handleName:"",
        nombre:"",
        apellidoPaterno:"",
        apellidoMaterno:"",
        correoElectronico:"",
        fechaNacimiento:'',
        numeroTelf:"",
        ci:""
    });

    const renderFieldComponent = (field: typeof userFields[0]) => {
        const fieldName = field.name as keyof FormState;
        const commonProps = {
        name: field.name,
        value: form[fieldName],
        onChange: handleChange,
        required: field.required,
        disabled: field.readOnly
        };

        switch(field.component) {
            case 'text':
            case 'date':
            return <ProfileInput type={field.component} {...commonProps} />;
            default:
            return <ProfileInput type='text' {...commonProps} />;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
            setForm(prev => ({
                ...prev,
                [name]: value
            }));

        if(error[name as keyof typeof error]){
            setError(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = (e:React.FormEvent) => {
         e.preventDefault();
        
        if(validateForm()){
            console.log("Cambios guardados: ", form);
              
        } else {
            console.log("Form INCORRECTO");
        }
    }

    function validateForm():boolean{
        const newErrors={
            handleName:"",
            nombre:"",
            apellidoPaterno:"",
            apellidoMaterno:"",
            rol:"",
            correoElectronico:"",
            fechaNacimiento:'',
            numeroTelf:"",
            ci:""
        }

        newErrors.handleName=ValidateField(
            form.handleName,
            [CommunValidators.required,
             UserValidators.handleName
            ]
        ) || "";

        newErrors.nombre=ValidateField(
            form.nombre,
            [CommunValidators.required,
             UserValidators.nombre
            ]
        ) || "";

        newErrors.apellidoPaterno=ValidateField(
            form.apellidoPaterno,
            [CommunValidators.required,
             UserValidators.apellidoPaterno
            ]
        ) || "";

        newErrors.apellidoMaterno=ValidateField(
            form.apellidoMaterno,
            [CommunValidators.required,
             UserValidators.apellidoMaterno
            ]
        ) || "";

        newErrors.correoElectronico=ValidateField(
            form.correoElectronico,
            [CommunValidators.required,
             UserValidators.correoElectronico
            ]
        ) || "";

        newErrors.fechaNacimiento=ValidateField(
            form.fechaNacimiento,
            [CommunValidators.required,
             UserValidators.fechaNacimiento
            ]
        ) || "";

        newErrors.numeroTelf=ValidateField(
            form.numeroTelf,
            [CommunValidators.required,
             UserValidators.numeroTelf
            ]
        ) || "";

        newErrors.ci=ValidateField(
            form.ci,
            [CommunValidators.required,
             UserValidators.ci
            ]
        ) || "";

        setError(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    }

     console.log("initialData recibido:", initialData);
    console.log("Estado del form:", form);

    return(
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

                {userFields.map(field => (
                    <FormField
                        key={field.name}
                        htmlFor={field.name}
                        label={field.label}
                        required={field.required}
                        error={error[field.name as keyof typeof error]}
                    >
                        {renderFieldComponent(field)}
                    </FormField>
                ))}

            <ButtonForm 
                type='submit'
                action='update'
                entity='user'
            />

            <ButtonCancel />
            </form>
        </div>
    );
}