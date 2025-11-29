'use client'
import { RankingCard } from '@/Components/Molecules';
import AppLayout from '@/Components/Templates/AppLayout/AppLayout';
import { ReportService } from '@/services';
import { useEffect, useState } from 'react';


interface RankingData {
    codUs: number;
    imagenUsuario: string | File;
    handlename: string;
    nombreUsuario: string;
    points: number;
    puesto: number;
}
export default function RankingSells() {
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const [dataSell, setDataSell] = useState<RankingData[]>([]);

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    useEffect(() => {
        async function getRankingSells() {
            const response = await ReportService.get_ranking_users_by_sells();
            const sells = response.data;
            const mapSells = sells.map((sell: any) => ({
                puesto: sell.puesto_ranking_ventas,
                codUs: sell.cod_us,
                handlename: sell.handle_name,
                nombreUsuario: sell.nombre_usuario,
                imagenUsuario: sell.foto_us,
                points: sell.total_ventas
            }));
            setDataSell(mapSells);
        }
        getRankingSells();
    }, []);
    return (
        <AppLayout pageTitle='Ranking' pageSubtitle='de los mejores emprendedores' userRole={userRole}>
            {dataSell.map((sell: any) => (
                <RankingCard
                    key={sell.codUs.toString()}
                    cod_us={sell.codUs}
                    imagenUsuario={sell.imagenUsuario}
                    handlename={sell.handlename}
                    nombreUsuario={sell.nombreUsuario}
                    points={sell.points}
                    puesto={sell.puesto}
                />
            ))}
        </AppLayout>
    );
}