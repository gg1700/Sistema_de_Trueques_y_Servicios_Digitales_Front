'use client'
import Menu from '../../../Components/MenuDesplegableSubcategoria';
import ViewCategories from './ViewCategories/viewCategories';

export default function Subcategorias(){

    return(
        <>
         <div>
            <Menu nombreMenu='Categorias en productos y servicios'
                   form='Nueva Categoria'
                   back='Atras'
                   casa='Home'/>
            <ViewCategories />
         </div>
        </>
    );
}