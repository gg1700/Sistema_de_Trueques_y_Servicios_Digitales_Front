'use client'
import Menu from '../../Components/MenuDesplegableSubcategoria';
import ViewSubcategories from './ViewSubcategories/ViewSubcategories';

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