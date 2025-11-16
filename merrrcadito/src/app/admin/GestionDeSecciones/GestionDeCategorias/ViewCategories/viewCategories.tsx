import ViewSecciones from "../../../../../Components/Organisms/ViewSeccionComponent/ViewSeccion";
import { useEffect, useState } from 'react';
import DeleteCategory from '../DeleteCategory/deleteCategory';
import UpdateCategory from '../UpdateCategory/updateCateory';
import NewCategory from "../NewCategory/newCategory";
import { CategoryService } from "@/services";

interface Categoria {
  cod: number
  tipo: string;
  nombre: string;
  descripcion: string;
  imagen: string | null;
}
export default function ViewCategory(){


    const [data, setData] = useState<Categoria[]>([]);
    useEffect( () => {
        async function cargarCategorias(){
            try{
                const response = await CategoryService.getAllCategory();
                const categorias=response.data;
                const mapCategorias = categorias.map((cat: any)=> ({
                    cod: cat.cod_cat,
                    tipo: cat.tipo_cat,
                    nombre: cat.nom_cat,
                    descripcion: cat.descr_cat           
                }));
                setData(mapCategorias); 
                console.log(data);
            }catch(error){
                console.error('Error cargando categorías:', error);
            }
        }
        cargarCategorias();
    },[]);

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