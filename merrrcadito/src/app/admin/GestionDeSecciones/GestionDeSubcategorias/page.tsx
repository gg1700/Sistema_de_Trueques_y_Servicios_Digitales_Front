'use client'
import { AppLayout } from '@/Components/Templates';
import ViewSubcategories from './ViewSubcategories/ViewSubcategories';

export default function Subcategorias() {

    return (
        <>
            <div>
                <AppLayout pageTitle='Gestion de Secciones' pageSubtitle='Subcategorias'>
                    <ViewSubcategories />
                </AppLayout>
            </div>
        </>
    );
}