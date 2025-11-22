'use client'
import ViewSubcategories from './ViewSubcategories/ViewSubcategories';
import ProtectedLayout from '@/app/ProtectedLayout';

export default function Subcategorias(){

    return(
        <>
         <div>
            <ProtectedLayout pageTitle='Gestion de Secciones' pageSubtitle='Subcategorias'>
                <ViewSubcategories/>
            </ProtectedLayout>
         </div>
        </>
    );
}