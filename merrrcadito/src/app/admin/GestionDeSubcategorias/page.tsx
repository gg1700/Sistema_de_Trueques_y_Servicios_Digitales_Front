'use client'
import Menu from '../../Components/MenuDesplegableSubcategoria';
import ViewSubcategories from './ViewSubcategories/tableSubcategory';

export default function Subcategorias(){

    return(
        <>
         <div>
            <Menu nombreMenu='Subcategorias en Productos'
                   form='Nueva Subcategoria'
                   back='Atras'
                   casa='Home'/>
            <ViewSubcategories />
         </div>
        </>
    );
}