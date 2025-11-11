'use client'
import { AreaInput, ButtonCancel, ButtonForm, FileInput, GenericInput, SelectInput } from "@/Components/Atoms";
import { FormField } from "@/Components/Molecules";
import { useState } from 'react'
import styles from './FormPublication.module.css'
import { CommunValidators, ValidateField } from "@/Utils/FormValidation";
import { PublicationValidators } from "@/Utils/FormValidation/publicationValidation";


export default function FormPublicationProduct(){

    const materialOptions=[{value:"1", label:"Plomo"},
                           {value: "2", label: "Madera"}];

   const categoryOptions=[{value:"1", label:"Textil"},
                           {value: "2", label: "Cocina"}];

   const subcategoryOptions=[{value:"1", label:"Ropa"},
                           {value: "2", label: "Telas"}];
   const calidadOptions=[{value:"1", label:"Medio Uso"},
                           {value: "2", label: "Nuevo"}];

   const [form,setForm]=useState({
        nombreProduct: "",
        peso:"",
        material:"",
        categoria:"",
        subcategoria:"",
        calidad:"",
        descripcion:"",
        precio:"",
        imagen: null as File | null
     }
    );

   const [error,setErrors]=useState({
      nombreProduct: "",
      peso:"",
      material:"",
      categoria:"",
      subcategoria:"",
      calidad:"",
      descripcion:"",
      precio:"",
      imagen: ""
   })

   function handleChange(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>){
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

   function handleFileChange(file : File | null){
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

   function handleSubmit(e: React.FormEvent){
      e.preventDefault();
        
      if(validateForm()){
         console.log("Cambios guardados: ", form);
            
      } else {
         console.log("Form INCORRECTO");
      }
   }

   function validateForm(){
      const newErrors={
         nombreProduct: "",
         peso:"",
         material:"",
         categoria:"",
         subcategoria:"",
         calidad:"",
         descripcion:"",
         precio:"",
         imagen: ""
      }

      newErrors.nombreProduct=ValidateField(
         form.nombreProduct,
         [CommunValidators.required,
          PublicationValidators.nombreProd
         ]
      ) || "";

      newErrors.peso=ValidateField(
         form.peso,
         [CommunValidators.required,
          PublicationValidators.peso
         ]
      ) || "";

      newErrors.material=ValidateField(
         form.material,
         [CommunValidators.required]
      ) || "";

      newErrors.categoria=ValidateField(
         form.categoria,
         [CommunValidators.required]
      ) || "";

      newErrors.subcategoria=ValidateField(
         form.subcategoria,
         [CommunValidators.required]
      ) || "";

      newErrors.calidad=ValidateField(
         form.calidad,
         [CommunValidators.required]
      ) || "";

      newErrors.descripcion=ValidateField(
         form.descripcion,
         [CommunValidators.required,
          PublicationValidators.descripcion
         ]
      ) || "";

      newErrors.precio=ValidateField(
         form.precio,
         [CommunValidators.required,
          PublicationValidators.precio
         ]
      ) || "";

      newErrors.imagen=ValidateField(
         form.imagen,
         [CommunValidators.required]
      ) || "";

      setErrors(newErrors);
      return !Object.values(newErrors).some(error => error !== "");
   }

    return(
        <div>
            <form className={styles.formGrid} onSubmit={handleSubmit}>
               <div className={styles.fullWitdh}>
                   <FormField
                    htmlFor="nombre producto"
                    label="Nombre del Producto"
                    error={error.nombreProduct}
                 >
                    <GenericInput 
                        name="nombre producto"
                        value={form.nombreProduct}
                        onChange={handleChange}
                        error={!!error.nombreProduct}
                    />
                 </FormField>
               </div>

               <div className={styles.hallWidth}>
                  <FormField
                    htmlFor="peso"
                    label='Peso Kg'
                    error={error.peso}
                 >
                    <GenericInput
                        name="peso"
                        value={form.peso}
                        onChange={handleChange}
                        error={!!error.peso}
                    />
                 </FormField>
               </div>
               
               <div className={styles.hallWitdh}>
                 <FormField
                    htmlFor="material"
                    label="Material"
                    error={error.material}
                 >
                    <SelectInput
                        name="material"
                        value={form.material}
                        onChange={handleChange}
                        placeholder={"Seleccione un material"}
                        options={materialOptions}
                       error={!!error.material}
                    />
                 </FormField>
               </div>
               <div className={styles.hallWidth}>
                 <FormField
                    htmlFor="categoria"
                    label="Categoria"
                   error={error.categoria}
                 >
                    <SelectInput
                        name="categoria"
                        value={form.categoria}
                        onChange={handleChange}
                        placeholder={"Seleccione una categoria"}
                        options={categoryOptions}
                       error={!!error.categoria}
                    />
                 </FormField>
               </div>

               <div className={styles.hallWidth}>
                 <FormField
                     htmlFor="subcategoria"
                     label="Subcaegoria"
                     error={error.subcategoria}
                 >
                     <SelectInput 
                        name="subcategoria"
                        value={form.subcategoria}
                        onChange={handleChange}
                        placeholder={"Seleccione una subcategoria"}
                        options={subcategoryOptions}
                        error={!!error.subcategoria}
                     />
                 </FormField>
               </div>

               <div className={styles.fullWitdh}>
                 <FormField
                     htmlFor="calidad"
                     label="Calidad"
                     error={error.calidad}
                 >
                     <SelectInput 
                        name="calidad"
                        value={form.calidad}
                        onChange={handleChange}
                        placeholder={"Seleccione la calidad del producto"}
                        options={calidadOptions}
                       error={!!error.calidad}
                     />
                 </FormField>
               </div>

               <div className={styles.fullWitdh}>
                 <FormField
                     htmlFor="descripcion"
                     label="Descripcion"
                    error={error.descripcion}
                 >
                     <AreaInput
                        name="desripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                       error={!!error.descripcion}
                     />
                 </FormField>
               </div>

               <div className={styles.fullWitdh}>
                 <FormField
                     htmlFor="precio"
                     label='Precio tk'
                    error={error.precio}
                 >
                     <GenericInput
                        name="precio"
                        value={form.precio}
                        onChange={handleChange}
                       error={!!error.precio}
                     />
                 </FormField>
               </div>

               <div className={styles.fullWitdh}>
                 <FormField
                     htmlFor="imagen"
                     label="Suba una imagen del producto"
                     error={error.imagen}
                 >
                     <FileInput
                         name="imagen"
                         onChange={handleFileChange}
                         error={!!error.imagen}
                     />
                 </FormField>
               </div>

               <ButtonForm 
                   type="submit"
                   action='publish'
                   entity='publication'
               />

               <ButtonCancel />
            </form>
        </div>
    );
}