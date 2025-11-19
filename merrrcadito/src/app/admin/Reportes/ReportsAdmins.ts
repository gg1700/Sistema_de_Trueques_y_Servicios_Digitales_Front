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


export const Reports = {
    useCategoryProdsReport,
    useActivityWeek
}