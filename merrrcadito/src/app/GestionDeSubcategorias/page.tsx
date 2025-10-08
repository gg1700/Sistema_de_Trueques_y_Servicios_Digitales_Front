'use client'
import styles from './VisualizacionSubcategorias/tablaSubcategoria.module.css'
import VisualizarSubcategorias from './VisualizacionSubcategorias/tablaSubcategorias';
import DesplegarMenu from '../Components/MenuDesplegableSubcategoria';

export default function Subcategorias(){

    return(
        <>
         <div>
            <DesplegarMenu />
            <VisualizarSubcategorias />
         </div>
        </>
    );
}