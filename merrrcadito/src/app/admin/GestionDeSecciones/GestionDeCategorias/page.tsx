'use client'
import {AdminLayout} from '@/Components/Templates';
import ViewCategories from './ViewCategories/viewCategories';

export default function Categorias(){

    return(
        <>
         <AdminLayout pageTitle='Gestion de Secciones' pageSubtitle='Categorias'>
            <ViewCategories />
         </AdminLayout>
        </>
    );
}