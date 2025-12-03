"use client";

import React, { useEffect, useState } from 'react';
import AchievementsPage from '@/Components/Templates/AchievementsPage/AchievementsPage';

export default function LogrosPage() {
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        // Get user ID from localStorage
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
            }
        }
    }, []);

    if (!userId) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                color: '#ffffff'
            }}>
                <p>Cargando...</p>
            </div>
        );
    }

    return <AchievementsPage userId={userId} />;
}
