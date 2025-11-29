'use client'
import { useEffect, useState } from "react";
import { ListPublicationProd, ListPublicationServ } from "@/Components/Organisms";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import { usePublicationsProds, usePublicationsServs } from "./PublicationViewHome";

export default function Home() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const dataPubProd = usePublicationsProds();
    const dataPubServ = usePublicationsServs();

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Hoy por mi"
            pageSubtitle="Mañana por mi"
            userRole={userRole}
        >
            <div>
                <ListPublicationProd title='Productos' pubProd={dataPubProd} />
                <ListPublicationServ title='Servicios' pubServ={dataPubServ} />
            </div>
        </AppLayout>
    );
}