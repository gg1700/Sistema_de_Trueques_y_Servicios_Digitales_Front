'use client'
import VisualizarSubcategorias from './VisualizacionSubcategorias/tablaSubcategorias';
import Menu from '../../Components/MenuDesplegableSubcategoria';

export default function Subcategorias(){

    return(
        <>
         <div>
            <Menu nombreMenu='Subcategorias en Productos'
                   form='Nueva Subcategoria'
                   back='Atras'
                   casa='Home'/>
            <VisualizarSubcategorias />
         </div>
        </>
    );
}