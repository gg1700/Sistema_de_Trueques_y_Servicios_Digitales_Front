'use client'
import { useState } from 'react'
import ViewSecciones from '../../GestionDeSecciones/ViewSeccionComponent/ViewSeccion'; // El componente genérico
import UpdateSubcategory from '../UpdateSubcategory/updateSubcategory';
import DeleteSubcategory from '../DeleteSubcategory/deleteSubcategory';
import NewSubcategory from '../NewSubcategory/newSubcategory';

interface Subcategoria {
  cod: number;
  nombre: string;
  descripcion: string;
  fechaRegistro: string;
}

export default function ViewSubcategories(){
    const dataSubcategoria = [
        {cod:234,nombre:"Ropa Varon",descripcion:"jijijijajajaja",fechaRegistro:"20/20/20"},
        {cod:201,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:202,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:203,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:220,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:210,nombre:"Ropa mujer",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
    ];

    const [data, setData] = useState(dataSubcategoria);

    const handleEliminacionExitosa = (cod: number) => {
        setData(prev => prev.filter(item => item.cod !== cod));
    };

    return(
        <ViewSecciones 
            tipo="subcategoria"
            datos={data}
            componenteUpdate={UpdateSubcategory}
            componenteDelete={DeleteSubcategory}
            componenteNuevo={NewSubcategory}
            triggerText="Agregar Nueva Subcategoría"
            onEliminacionExitosa={handleEliminacionExitosa}
        />
    );
}