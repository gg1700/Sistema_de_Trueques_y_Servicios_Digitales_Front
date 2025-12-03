'use client'
import RankingCO2Card from "@/Components/Molecules/RankingCO2Card/RankingCO2Card";
import { ReportService } from "@/services";
import { useEffect, useState } from "react";


interface RankingData {
    codUs: number;
    imagenUsuario: string | File;
    handlename: string;
    nombreUsuario: string;
    points: number;
    puesto: number;
}
export default function RankingCO2() {
    const [data, setData] = useState<RankingData[]>([]);
    useEffect(() => {
        async function getRankingCO2() {
            const response = await ReportService.get_ranking_users_co2();
            const ranking = response.data;
            const mapRanking = ranking.map((ranking: any) => ({
                codUs: ranking.cod_us,
                imagenUsuario: ranking.foto_us,
                handlename: ranking.handle_name,
                nombreUsuario: ranking.nom_usuario,
                points: ranking.puntaje_co2,
                puesto: ranking.puesto_ranking_co2
            }));
            setData(mapRanking);
        }
        getRankingCO2();
    }, []);

    return (
        <div>
            {data.map((rank: any) => (
                <RankingCO2Card
                    key={rank.codUs.toString()}
                    cod_us={rank.codUs}
                    imagenUsuario={rank.imagenUsuario}
                    handlename={rank.handlename}
                    nombreUsuario={rank.nombreUsuario}
                    points={rank.points}
                    puesto={rank.puesto}
                />
            ))}
        </div>
    );
}