import ReportsAdmin from "./ReportsAdmin";
import ProtectedLayout from "@/app/ProtectedLayout";

export default function Reportes(){
    return(
        <ProtectedLayout
           pageTitle="Reportes de la Plataforma"
           pageSubtitle="Mejorar por lo que veas en los diagramas"
        >
           <ReportsAdmin />
        </ProtectedLayout>
    );
}