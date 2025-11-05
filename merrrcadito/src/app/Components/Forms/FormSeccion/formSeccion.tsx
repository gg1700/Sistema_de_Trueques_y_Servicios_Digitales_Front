'use client'
import styles from './formSeccion.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

interface FormProps {
    type?: 'categoria' | 'subcategoria';
    initialData?: {
    seccion: string;
    nombre: string;
    descripcion: string;
    imagen?: File | null;
  };
  onSubmit: (formData: any) => void;
  onCancel?:() => void;
  isEditing?: boolean;
  id?: number;
}

export default function FormSeccion({ 
  type='subcategoria',
  initialData, 
  onSubmit,
  onCancel, 
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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setForm(prev => ({
                ...prev,
                imagen: e.target.files![0] 
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
            newErrors.seccion = "Debe seleccionar "+(type==='subcategoria'? 'una categoria': 'un tipo');
        }

        if(!form.nombre.trim()){
            newErrors.nombre = "El nombre de la" +(type==='subcategoria'? 'Subcategoria': 'Categoria')+ " es obligatorio";
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
        <div className={styles.formConteiner}>
         <form className={styles.formBody} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="seccion" className={styles.formLabel}>Categoria</label>
                <select 
                    name="seccion" 
                    value={form.seccion} 
                    onChange={handleChange} 
                    className={`${styles.input} ${error.seccion ? styles.inputError : ''}`}
                >
                    <option value="">Seleccione {type==='subcategoria'? 'una categoria' : 'un tipo'}</option>
                    <option value="Si es pan">Si es pan</option>
                    <option value="No es pan">No es pan</option>
                </select>
                {error.seccion && (<span className={styles.messageErrorInput}>{error.seccion}</span>)}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="nombre" className={styles.formLabel}>Nombre</label>
                <input 
                    type="text" 
                    name="nombre" 
                    value={form.nombre} 
                    className={`${styles.input} ${error.nombre ? styles.inputError : ''}`} 
                    onChange={handleChange}
                />
                {error.nombre && (<span className={styles.messageErrorInput}>{error.nombre}</span>)}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="descripcion" className={styles.formLabel}>Descripcion</label>
                <textarea 
                    name="descripcion" 
                    value={form.descripcion} 
                    className={`${styles.input} ${error.descripcion ? styles.inputError : ''}`} 
                    onChange={handleChange}
                />
                {error.descripcion && (<span className={styles.messageErrorInput}>{error.descripcion}</span>)}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="imagen" className={styles.formLabel}>Suba una imagen referente</label>
                <input 
                    type="file" 
                    name="imagen"  
                    className={`${styles.input} ${error.imagen ? styles.inputError : ''}`} 
                    onChange={handleFileChange}
                />
                {error.imagen && (<span className={styles.messageErrorInput}>{error.imagen}</span>)}
            </div>

            <button type="submit" className={styles.buttonAction}>
                {isEditing ? 'Actualizar' : 'Registrar'} {type==='subcategoria'? 'Subcategoria': 'Categoria'}
            </button>
            
            <button type="button" onClick={handleCancel} className={styles.buttonBack}>
                Cancelar
            </button>
         </form>
        </div>
    );
}