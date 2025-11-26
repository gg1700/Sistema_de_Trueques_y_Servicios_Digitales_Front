import { AppLayout } from "@/Components/Templates";
import ReportsAdmin from "./ReportsAdmin";

export default function Reportes() {
    return (
        <AppLayout
            pageTitle="Reportes de la Plataforma"
            pageSubtitle="Mejorar por lo que veas en los diagramas"
        >
            <ReportsAdmin />
        </AppLayout>
    );
}