'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import WalletView from "@/Components/Templates/WalletView/WalletView";

export default function WalletPage() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Mi Billetera"
            pageSubtitle="Gestiona tus fondos y transacciones"
            userRole={userRole}
        >
            <WalletView />
        </AppLayout>
    );
}
