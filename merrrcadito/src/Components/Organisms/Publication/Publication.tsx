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
    marca?: string;
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
        nombre_seccion: string,
        precio_pub?: number,
        foto_pub: string,
        calif_pond_pub: number,
        calidad?: string,
        handlename: string,
        estado_pub: 'activo' | 'inactivo',
    },
    pubP: PubProdProps,
    pubS: PubServProps
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
                    {clase === 'Producto' ? (
                        <PublicationProducto pub={pubP} onCancel={cerrarModal} />
                    ) : (
                        <PublicationService pub={pubS} onCancel={cerrarModal}/>
                    )}
                </ModalManagement>
            )}
        </div>
    );
}