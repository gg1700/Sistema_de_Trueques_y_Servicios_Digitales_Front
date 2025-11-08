'use client'
import {AdminLayout} from '@/Components/Templates';
import ViewSubcategories from './ViewSubcategories/ViewSubcategories';

export default function Subcategorias(){

    return(
        <>
         <div>
            <AdminLayout pageTitle='Gestion de Secciones' pageSubtitle='Subcategorias'>
                <ViewSubcategories/>
            </AdminLayout>
         </div>
        </>
    );
}