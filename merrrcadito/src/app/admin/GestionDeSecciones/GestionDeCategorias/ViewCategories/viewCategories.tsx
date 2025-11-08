import ViewSecciones from "../../../../../Components/Organisms/ViewSeccionComponent/ViewSeccion";
import { useState } from 'react';
import DeleteCategory from '../DeleteCategory/deleteCategory';
import UpdateCategory from '../UpdateCategory/updateCateory';
import NewCategory from "../NewCategory/newCategory";

interface Categoria {
  tipo: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

export default function ViewCategory(){
    const dataSubcategoria = [
        {cod:211,nombre:"Textil",descripcion:"jijijijajajaja",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:241,nombre:"Tenocologia",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:262,nombre:"Tecnologia",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:273,nombre:"Tecnologia",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:230,nombre:"Tecnologia",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
        {cod:290,nombre:"Tecnologia",descripcion:"vivaOrurococa",imagen:encodeURI("/Captura desde 2025-11-03 23-42-08.png")},
    ];

    const [data, setData] = useState(dataSubcategoria);

    return(
        <ViewSecciones 
            type='category'
            datos={data}
            componenteUpdate={UpdateCategory}
            componenteDelete={DeleteCategory}
            triggerText="Nueva Categoría"
            componenteNuevo={NewCategory}
        />
    );
}