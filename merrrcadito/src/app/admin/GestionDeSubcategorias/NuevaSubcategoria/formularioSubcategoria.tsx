'use client'
import styles from './formSubcategory.module.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 


export default function FormSubcategoria(){

    const [form, setForm] = useState({
        categoria:"",
        nombre:"",
        descripcion:"",
        imagen: null as File | null 
    });

    const [error,setErrors] =useState({
        categoria:"",
        nombre:"",
        descripcion:"",
        imagen:""
    })

    const router=useRouter();

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
      const { name, value } = e.target;
       setForm(prev => ({
        ...prev,
        [name]: value
       }));

       if(error[name as keyof typeof error]){
        setErrors(prev=>({
            ...prev,
            [name]:""
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
        console.log(form); 



        if(validateForm()){
            console.log("Form correcto");
        }else{
            console.log("Form INCORRECTO");
        }
    }

    function validateForm(){
        const newErrors={
            categoria:"",
            nombre:"",
            descripcion:"",
            imagen:""
        };

        if(!form.categoria){
            newErrors.categoria="Seleccione una categoria";
        }

        if(!form.nombre.trim()){
            newErrors.nombre="El nombre de la subcategoria es obligatorio";
        }else if(form.nombre.length<=2){
            newErrors.nombre="NO puede ser menos de 3 caracteres";
        }

        if(!form.descripcion.trim()){
            newErrors.descripcion="La descripcion es obligatoria";
        }else if(form.descripcion.length<10){
            newErrors.descripcion="Debe ser una descripcion más detallada";
        }
        
        if(!form.imagen){
            newErrors.imagen="Debe subir una imagen";
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== "");
    }

    function returnBack(){
        setForm({
            categoria:"",
            nombre:"",
            descripcion:"",
            imagen:null 
        });

        setErrors({
            categoria:"",
            nombre:"",
            descripcion:"",
            imagen:""
        });

        router.push('admin/GestionDeSubcategorias');
    }

    return(
        <div className={styles.formConteiner} onSubmit={handleSubmit}>
         <form className={styles.formBody}>
            {/*Solo las categorias de Producto tienen subcategorias */}
            {/*SEleccion de la categoria*/}
            <div className={styles.formGroup}>
                <label htmlFor="categoria" className={styles.formLabel}>Categoria</label>
                <select name="categoria" value={form.categoria} onChange={handleChange} className={`${styles.inputSubcategory} ${error.categoria ? styles.inputError : ''
                }`}>
                    <option>Si es pan</option>
                    <option>No es pan</option>
                </select>
                {error.categoria && (<span className={styles.messageErrorInput}>{error.categoria}</span>)}
            </div>
            {/*NOmbre de la subcategoria */}
            <div className={styles.formGroup}>
                <label htmlFor="nombre"  className={styles.formLabel}>Nombre de la Subcategoria</label>
                <input type="text" name="nombre" value={form.nombre} className={`${styles.inputSubcategory} ${
                            error.nombre ? styles.inputError : ''}`} onChange={handleChange}/>
                {error.nombre && (<span className={styles.messageErrorInput}>{error.nombre}</span>)}
            </div>

            {/*DEsscripcion de la subcategoria */}
            <div className={styles.formGroup}>
                <label htmlFor="descripcionSubcategoria" className={styles.formLabel}>Descripcion</label>
                <textarea name="descripcion" value={form.descripcion} className={`${styles.inputSubcategory} ${
                            error.descripcion ? styles.inputError : '' }`} onChange={handleChange}></textarea>
                {error.descripcion && (<span className={styles.messageErrorInput}>{error.descripcion}</span>)}
            </div>

            {/* imagen de la subcategoria*/}
            <div className={styles.formGroup}>
                <label htmlFor="imagenSubcategoria" className={styles.formLabel}>Suba una imagen referente</label>
                <input type="file" name="imagen"  className={`${styles.inputSubcategory} ${
                    error.imagen ? styles.inputError : ''}`} onChange={handleFileChange}/>
                {error.imagen && (<span className={styles.messageErrorInput}>{error.imagen}</span>)}
            </div>

            {/*Boton guardar*/}
            <button type="submit" className={styles.buttonRegSub}>Registrar Subcategoria</button>
            {/*Boton cancelar*/}
            
            <button onClick={returnBack} className={styles.buttonBack}>Cancelar</button>
         </form>
        </div>
    );
}