'use client'
import { useEffect, useState } from "react";
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import ViewSubcategories from './ViewSubcategories/ViewSubcategories';

export default function Subcategorias() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <>
            <div>
                <AppLayout pageTitle='Gestion de Secciones' pageSubtitle='Subcategorias' userRole={userRole}>
                    <ViewSubcategories />
                </AppLayout>
            </div>
        </>
    );
}