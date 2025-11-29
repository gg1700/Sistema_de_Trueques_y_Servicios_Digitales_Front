'use client'
import { useEffect, useState } from "react";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import RankingCO2 from "./RankingCO2";

export default function RankingsCO2() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Ranking"
            pageSubtitle="De los mejores usuarios"
            userRole={userRole}>
            <RankingCO2 />
        </AppLayout>
    );
}