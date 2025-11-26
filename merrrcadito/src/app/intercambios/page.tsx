"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExchangesView from '@/Components/Templates/ExchangesView/ExchangesView';

export default function IntercambiosPage() {
    const [userId, setUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Obtener userId de tu sistema de autenticación
        // Ajusta esto según tu implementación de autenticación

        // Opción 1: Desde localStorage
        const storedUserId = localStorage.getItem('userId');

        // Opción 2: Desde sessionStorage
        // const storedUserId = sessionStorage.getItem('userId');

        // Opción 3: Desde un contexto de autenticación
        // const { user } = useAuth();
        // setUserId(user?.cod_us);

        if (storedUserId) {
            setUserId(parseInt(storedUserId));
            setLoading(false);
        } else {
            // Si no hay usuario, redirigir al login
            router.push('/login');
        }
    }, [router]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <p>Cargando...</p>
            </div>
        );
    }

    if (!userId) {
        return null;
    }

    return <ExchangesView userId={userId} />;
}
