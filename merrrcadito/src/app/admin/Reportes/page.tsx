'use client'
import { useEffect, useState } from "react";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import ReportsAdmin from "./ReportsAdmin";

export default function Reportes() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Reportes de la Plataforma"
            pageSubtitle="Mejorar por lo que veas en los diagramas"
            userRole={userRole}
        >
            <ReportsAdmin />
        </AppLayout>
    );
}