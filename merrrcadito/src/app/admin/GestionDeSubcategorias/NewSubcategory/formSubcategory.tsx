'use client'
import styles from './formSubcategory.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

interface FormSubcategoryProps {
  initialData?: {
    categoria: string;
    nombre: string;
    descripcion: string;
    imagen?: File | null;
  };
  onSubmit: (formData: any) => Promise<Response>;
  onCancel:() => void;
  isEditing?: boolean;
  subcategoryId?: string;
}

export default function FormSubcategory({ 
  initialData, 
  onSubmit,
  onCancel, 
  isEditing = false,
  subcategoryId 
}: FormSubcategoryProps) {

    const [form, setForm] = useState({
        categoria: "",
        nombre: "",
        descripcion: "",
        imagen: null as File | null 
    });

    const [error, setErrors] = useState({
        categoria: "",
        nombre: "",
        descripcion: "",
        imagen: ""
    });

    const router = useRouter();

  
    useEffect(() => {
        if (initialData) {
            setForm({
                categoria: initialData.categoria || "",
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
            onSubmit(form)
                .then(response => {
                    if (response.ok) {
                        console.log(isEditing ? "Actualizado correctamente" : "Creado correctamente");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        } else {
            console.log("Form INCORRECTO");
        }
    }

    function validateForm(){
        const newErrors = {
            categoria: "",
            nombre: "",
            descripcion: "",
            imagen: ""
        };

        if(!form.categoria){
            newErrors.categoria = "Seleccione una categoria";
        }

        if(!form.nombre.trim()){
            newErrors.nombre = "El nombre de la subcategoria es obligatorio";
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
            categoria: "",
            nombre: "",
            descripcion: "",
            imagen: null 
        });

        setErrors({
            categoria: "",
            nombre: "",
            descripcion: "",
            imagen: ""
        });

        if (onCancel) {
            onCancel();  
        }else{
            router.back();
        }
    }

    return(
        <div className={styles.formConteiner}>
         <form className={styles.formBody} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="categoria" className={styles.formLabel}>Categoria</label>
                <select 
                    name="categoria" 
                    value={form.categoria} 
                    onChange={handleChange} 
                    className={`${styles.inputSubcategory} ${error.categoria ? styles.inputError : ''}`}
                >
                    <option value="">Seleccione una categoría</option>
                    <option value="Si es pan">Si es pan</option>
                    <option value="No es pan">No es pan</option>
                </select>
                {error.categoria && (<span className={styles.messageErrorInput}>{error.categoria}</span>)}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="nombre" className={styles.formLabel}>Nombre de la Subcategoria</label>
                <input 
                    type="text" 
                    name="nombre" 
                    value={form.nombre} 
                    className={`${styles.inputSubcategory} ${error.nombre ? styles.inputError : ''}`} 
                    onChange={handleChange}
                />
                {error.nombre && (<span className={styles.messageErrorInput}>{error.nombre}</span>)}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="descripcion" className={styles.formLabel}>Descripcion</label>
                <textarea 
                    name="descripcion" 
                    value={form.descripcion} 
                    className={`${styles.inputSubcategory} ${error.descripcion ? styles.inputError : ''}`} 
                    onChange={handleChange}
                />
                {error.descripcion && (<span className={styles.messageErrorInput}>{error.descripcion}</span>)}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="imagen" className={styles.formLabel}>Suba una imagen referente</label>
                <input 
                    type="file" 
                    name="imagen"  
                    className={`${styles.inputSubcategory} ${error.imagen ? styles.inputError : ''}`} 
                    onChange={handleFileChange}
                />
                {error.imagen && (<span className={styles.messageErrorInput}>{error.imagen}</span>)}
            </div>

            <button type="submit" className={styles.buttonRegSub}>
                {isEditing ? 'Actualizar' : 'Registrar'} Subcategoria
            </button>
            
            <button type="button" onClick={handleCancel} className={styles.buttonBack}>
                Cancelar
            </button>
         </form>
        </div>
    );
}