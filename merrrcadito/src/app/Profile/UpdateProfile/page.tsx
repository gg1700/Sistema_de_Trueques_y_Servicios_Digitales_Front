'use client'
import { useEffect, useState } from "react";
import { FormProfile } from '@/Components/Organisms'
import UpdateProfile from './UpdateProfile';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout'


export default function Profile() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Informacion de la cuenta"
            pageSubtitle="jijijajajaj"
            userRole={userRole}
        >
            <UpdateProfile />
        </AppLayout>
    );
}