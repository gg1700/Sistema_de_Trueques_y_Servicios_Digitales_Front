'use client'
import { useState } from 'react';
import PublicationCard from "@/Components/Molecules/PublicationCard/PublicationCard";
import PublicationProducto from "@/Components/Molecules/PublicationMore/PublicationProducto";
import ModalManagement from "../ModalManagement/modalManagement";
import PublicationService from '@/Components/Molecules/PublicationMore/PublicationService';

interface BasePubProps {
    descripcion: string;
    fecha_ini_pub: string;
    contacto_correo: string;
    contacto_numero: number;
    handlename: string;
}

interface PubProdProps extends BasePubProps {
    cantidad: number;
    marca?: string | null;
}


interface PubServProps extends BasePubProps {
    hrs_ini_serv: string;
    hrs_fin_serv: string;
    duracion: number;
}

interface PublicationProps{
    clase: 'Producto' | 'Servicio',
    pub:{
        cod_pub: number,
        nombre_publicacion: string,
        nombre_categoria: string,
        nombre_subcat?: string,
        precio_pub?: number,
        foto_pub: string | null,
        calif_pond_pub: number,
        calidad?: string,
        handlename: string,
        estado_pub: 'activo' | 'inactivo',
    },
    pubP?: PubProdProps | null,
    pubS?: PubServProps | null
}

export default function Publication({
    clase,
    pub,
    pubP,
    pubS
}:PublicationProps){

    const [isModalOpen, setIsModalOpen] = useState(false);

    
    function abrirModal(){
        setIsModalOpen(true);
    }

    function cerrarModal(){
        setIsModalOpen(false);
    }

    return(
        <div>
            <PublicationCard 
                 pub={pub}
                 onOpenModal={abrirModal}
            />
            {isModalOpen && (
                <ModalManagement onClose={cerrarModal}>
                    {clase === 'Producto' && pubP ? (  
                        <PublicationProducto pub={pubP} onCancel={cerrarModal} />
                    ) : clase === 'Servicio' && pubS ? (  
                        <PublicationService pub={pubS} onCancel={cerrarModal}/>
                    ) : (
                        <div>No hay datos disponibles</div> 
                    )}
                </ModalManagement>
            )}
        </div>
    );
}