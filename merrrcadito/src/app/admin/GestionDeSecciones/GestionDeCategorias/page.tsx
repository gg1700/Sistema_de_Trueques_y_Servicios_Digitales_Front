'use client'
import { AppLayout } from '@/Components/Templates';
import ViewCategories from './ViewCategories/viewCategories';

export default function Categorias() {

    return (
        <>
            <AppLayout pageTitle='Gestion de Secciones' pageSubtitle='Categorias'>
                <ViewCategories />
            </AppLayout>
        </>
    );
}