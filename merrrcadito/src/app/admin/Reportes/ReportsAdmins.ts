import { useEffect, useState } from "react";
import { ReportService } from "@/services";


export function useCategoryProdsReport(month : string){
    const [data, setData] = useState();

    useEffect(() => {
        async function loadFirstRepo(){
            const response= await ReportService.get_category_report_by_month(month);
            const reporte=response.data
            const mapReporte=reporte.map((report : any) => ({
                categoria: report.nom_cat,
                compras: report.cant_ventas,
                intercambios: report.cant_intercambios
            }))
            setData(mapReporte);
        }
        loadFirstRepo();
    },[]);
    return data;
}

export function useActivityWeek(){
    const [data, setData] = useState();
    
    useEffect(() => {
        async function loadSecondRepo(){
            const response= await ReportService.get_activity_report_by_week();
            const reporte= response.data;
            const mapReporte= reporte.map((report : any) => ({
                fecha: report.fecha_semana,
                cant_us: report.active_users
            }));
            setData(mapReporte);
        }
        loadSecondRepo();
    },[]);
    return data;
}

export function useActionsUsers(month:string){
    const [data, setData] = useState();

    useEffect(() => {
        async function loadThirdRepo() {
            const response= await ReportService.get_actions_users_by_month("11");
            const actions= response.data;
            const mapActions= actions.map((action:any) => ({
                mes: action.mes,
                anio: action.anio,
                cant_compras_publicaciones_prod: action.cant_compras_publicaciones_prod,
                cant_compras_publicaciones_serv: action.cant_compras_publicaciones_serv,
                cant_intercambios: action.cant_intercambios,
                cant_compras_potenciadores: action.cant_compras_potenciadores,
                cant_paquetes_tokens: action.cant_paquetes_tokens
            }))
            setData(mapActions);
        }
        loadThirdRepo();
    },[])
}


export const Reports = {
    useCategoryProdsReport,
    useActivityWeek,
    useActionsUsers
}