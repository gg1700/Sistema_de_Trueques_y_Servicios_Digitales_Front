'use client'
import { useState } from 'react'
import {ViewSeccion} from '@/Components/Organisms'; // El componente genérico
import UpdateSubcategory from '../UpdateSubcategory/updateSubcategory';
import DeleteSubcategory from '../DeleteSubcategory/deleteSubcategory';
import NewSubcategory from '../NewSubcategory/newSubcategory';

interface Subcategoria {
  cod: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export default function ViewSubcategories(){
    const dataSubcategoria = [
        {cod:234,nombre:"Ropa Varon",descripcion:"jijijijajajaja",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:201,nombre:"Ropa mujer",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:202,nombre:"Ropa mujer",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:203,nombre:"Ropa mujer",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:220,nombre:"Ropa mujer",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:210,nombre:"Ropa mujer",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
    ];

    const [data, setData] = useState(dataSubcategoria);

    const handleEliminacionExitosa = (cod: number) => {
        setData(prev => prev.filter(item => item.cod !== cod));
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