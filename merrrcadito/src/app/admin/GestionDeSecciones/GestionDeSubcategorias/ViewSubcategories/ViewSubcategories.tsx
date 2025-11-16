'use client'
import { useState, useEffect } from 'react'
import {ViewSeccion} from '@/Components/Organisms'; // El componente genérico
import UpdateSubcategory from '../UpdateSubcategory/updateSubcategory';
import DeleteSubcategory from '../DeleteSubcategory/deleteSubcategory';
import NewSubcategory from '../NewSubcategory/newSubcategory';
import { SubcategoryService } from '@/services';

import * as dotenv from 'dotenv';
interface Subcategoria {
  cod: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
}

export default function ViewSubcategories(){

  console.log("BACK_URL: ", process.env.NEXT_PUBLIC_BACK_URL);
    
  const [data, setData] = useState<Subcategoria[]>([]);

  useEffect(() => {
      const optionsSubcategories = async () => {
      try{
        console.log('Obtenindo subcategorias');
        const subcategoria= await SubcategoryService.getAllSubcategories();
        console.log('subcategorias: ', subcategoria)
        setData(subcategoria);
      }catch(error: any){
        console.error('Error al obtener subcategorias: ', error);
      };
    } 
      optionsSubcategories();
  },[])

  const handleEliminacionExitosa = (cod: number) => {
  };

    return(
        <ViewSeccion
            type='subcategory'
            datos={data}
            componenteUpdate={UpdateSubcategory}
            componenteDelete={DeleteSubcategory}
            componenteNuevo={NewSubcategory}
            triggerText="Nueva Subcategoría"
            onEliminacionExitosa={handleEliminacionExitosa}
        />
    );
}