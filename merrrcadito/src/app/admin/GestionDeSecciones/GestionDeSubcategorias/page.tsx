'use client'
import AdminLayout from '@/app/Components/Templates/ManagementLayout/AdminLayout';
import Menu from '../../../Components/MenuDesplegableSubcategoria';
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