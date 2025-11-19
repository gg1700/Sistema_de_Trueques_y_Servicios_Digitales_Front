'use client'
import { ListPublicationProd } from "@/Components/Organisms";
import { AdminLayout } from "@/Components/Templates";
import { PublicationService } from "@/services";
import { useEffect, useState } from "react";
import { usePublicationsProds } from "./PublicationViewHome";

export default function Home(){
  const dataPubProd = usePublicationsProds();
    return (
    <AdminLayout 
        pageTitle="Hoy por mi"
        pageSubtitle="Mañana por mi"
    >
        <div>  
            <ListPublicationProd title='Productos' pubProd={dataPubProd}/>
        </div>
    </AdminLayout>
    );
}