'use client'
import { ListPublicationProd } from "@/Components/Organisms";
import ProtectedLayout  from "../ProtectedLayout";
import { usePublicationsProds } from "./PublicationViewHome";

export default function Home(){
  const dataPubProd = usePublicationsProds();
    return (
    <ProtectedLayout 
        pageTitle="Hoy por mi"
        pageSubtitle="Mañana por mi"
    >
        <div>  
            <ListPublicationProd title='Productos' pubProd={dataPubProd}/>
        </div>
    </ProtectedLayout>
    );
}