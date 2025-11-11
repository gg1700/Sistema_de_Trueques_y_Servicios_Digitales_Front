import { AdminLayout } from "@/Components/Templates";
import ReportsAdmin from "./ReportsAdmin";

export default function Reportes(){
    return(
        <AdminLayout
           pageTitle="Reportes de la Plataforma"
           pageSubtitle="Mejorar por lo que veas en los diagramas"
        >
           <ReportsAdmin />
        </AdminLayout>
    );
}