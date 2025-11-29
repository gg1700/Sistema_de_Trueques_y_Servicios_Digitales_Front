'use client'
import { useEffect, useState } from "react";
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import ViewCategories from './ViewCategories/viewCategories';

export default function Categorias() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <>
            <AppLayout pageTitle='Gestion de Secciones' pageSubtitle='Categorias' userRole={userRole}>
                <ViewCategories />
            </AppLayout>
        </>
    );
}