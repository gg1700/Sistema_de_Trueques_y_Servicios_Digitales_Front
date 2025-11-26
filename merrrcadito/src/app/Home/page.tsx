'use client'
import { ListPublication } from "@/Components/Organisms";
import { AppLayout } from "@/Components/Templates";
import { usePublicationsProds, usePublicationsServs } from "./PublicationViewHome";
export default function Home() {
    const dataPubProd = usePublicationsProds();
    const dataPubServ = usePublicationsServs();

    return (
        <AppLayout
            pageTitle="Hoy por mi"
            pageSubtitle="Mañana por mi"
        >
            <div>
                <ListPublication
                    title='Productos'
                    clase='Producto'
                    publications={dataPubProd}
                />

                <ListPublication
                    title='Servicios'
                    clase='Servicio'
                    publications={dataPubServ}
                />
            </div>
        </AppLayout>
    );
}