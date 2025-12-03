'use client'
import { useEffect, useState } from "react";
import { FormProfile } from '@/Components/Organisms'
import UpdateProfile from './UpdateProfile';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout'
import { useRouter } from 'next/navigation'


export default function Profile() {
    const [userRole, setUserRole] = useState<'admin' | 'user' | 'entrepreneur'>('user');
    const router = useRouter()

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user' || storedRole === 'entrepreneur') {
            setUserRole(storedRole as 'admin' | 'user' | 'entrepreneur');
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