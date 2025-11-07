import ViewSecciones from "../../../../Components/Organisms/ViewSeccionComponent/ViewSeccion";
import { useState } from 'react';
import DeleteCategory from '../DeleteCategory/deleteCategory';
import UpdateCategory from '../UpdateCategory/updateCateory';
import NewCategory from "../NewCategory/newCategory";

interface Categoria {
  tipo: number;
  nombre: string;
  descripcion: string;
  fechaRegistro: string;
}

export default function ViewCategory(){
    const dataSubcategoria = [
        {cod:211,nombre:"Textil",descripcion:"jijijijajajaja",fechaRegistro:"20/20/20"},
        {cod:241,nombre:"Tenocologia",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:262,nombre:"Tecnologia",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:273,nombre:"Tecnologia",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:230,nombre:"Tecnologia",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
        {cod:290,nombre:"Tecnologia",descripcion:"vivaOrurococa",fechaRegistro:"21/21/21"},
    ];

    const [data, setData] = useState(dataSubcategoria);

    return(
        <ViewSecciones 
            type='category'
            datos={data}
            componenteUpdate={UpdateCategory}
            componenteDelete={DeleteCategory}
            triggerText="Agregar Nueva Categoría"
            componenteNuevo={NewCategory}
        />
    );
}