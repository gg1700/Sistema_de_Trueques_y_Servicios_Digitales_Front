'use client'
import styles from './FormProfile.module.css'
import { useState } from 'react';
import { ButtonCancel, ButtonForm, ProfileInput } from '@/Components/Atoms';
import { FormField } from '@/Components/Molecules';

interface  UserDataProps{
    handleName: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    rol: string,
    correoElectronico: string,
    fechaNacimineto: string,
    numeroTelf: number,
    ci: number,
}

export default  function FormProfile(){

    const [userData,setUserData] = useState<UserDataProps>({
        handleName:"ElPapu",
        nombre:"Alfonso",
        apellidoPaterno:"Chuño",
        apellidoMaterno:"Torrales",
        rol:"Usuario Comun",
        correoElectronico:"nepe@gmail.com",
        fechaNacimineto:'02-02-02',
        numeroTelf:625472,
        ci:999999
    });

    //HACER QUE UNA VALIDACION DEL FORM(INCLUIYE SI NO SE HIZO NINGUN CAMBIO PARA NO LLAMA AL SP)

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
            required: true 
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
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const renderFieldComponent = (field: typeof userFields[0]) => {
        const commonProps = {
        name: field.name,
        value: userData[field.name as keyof UserDataProps],
        onChange: handleChange,
        required: field.required
        };

        switch(field.component) {
            case 'text':
            case 'date':
            return <ProfileInput type={field.component} {...commonProps} />;
            default:
            return <ProfileInput type='text' {...commonProps} />;
        }
    }

    return(
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={() => console.log("Pollita")}>

                {userFields.map(field => (
                    <FormField
                        key={field.name}
                        htmlFor={field.name}
                        label={field.label}
                        required={field.required}
                    >
                        {renderFieldComponent(field)}
                    </FormField>
                ))}
            </form>

            <ButtonForm 
                type='submit'
                action='update'
                entity='user'
                onClick={() => console.log("Cambios guardados")}
            />

            <ButtonCancel />

            
        </div>
    );
}