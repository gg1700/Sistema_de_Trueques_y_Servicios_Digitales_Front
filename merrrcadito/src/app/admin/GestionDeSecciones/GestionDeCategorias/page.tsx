'use client'
import ViewCategories from './ViewCategories/viewCategories';
import ProtectedLayout from '@/app/ProtectedLayout';

export default function Categorias(){

    return(
        <>
         <ProtectedLayout pageTitle='Gestion de Secciones' pageSubtitle='Categorias'>
            <ViewCategories />
         </ProtectedLayout>
        </>
    );
}