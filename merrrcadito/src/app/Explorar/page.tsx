'use client'
import React, { useState, useEffect } from 'react';
import { ListPublicationProd, ListPublicationServ } from "@/Components/Organisms";
import AppLayout from "@/Components/Templates/AppLayout/AppLayout";
import { usePublicationsProds, usePublicationsServs } from "../Home/PublicationViewHome";

const ExplorarPage = () => {
    const [activeSection, setActiveSection] = useState<'products' | 'services'>('products');
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const dataPubProd = usePublicationsProds();
    const dataPubServ = usePublicationsServs();

    useEffect(() => {
        const storedRole = localStorage.getItem('currentUserRole');
        if (storedRole === 'admin' || storedRole === 'user') {
            setUserRole(storedRole);
        }
    }, []);

    return (
        <AppLayout
            pageTitle="Explorar"
            pageSubtitle="Descubre productos y servicios"
            userRole={userRole}
        >
            <div className="p-4">
                <div className="flex gap-4 mb-6 justify-center">
                    <button
                        className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${activeSection === 'products'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        onClick={() => setActiveSection('products')}
                    >
                        Productos
                    </button>
                    <button
                        className={`px-6 py-2 rounded-full font-semibold transition-colors duration-200 ${activeSection === 'services'
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        onClick={() => setActiveSection('services')}
                    >
                        Servicios
                    </button>
                </div>

                <div className="animate-fade-in">
                    {activeSection === 'products' ? (
                        <ListPublicationProd title='Productos' pubProd={dataPubProd} layout="grid" />
                    ) : (
                        <ListPublicationServ title='Servicios' pubServ={dataPubServ} layout="grid" />
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ExplorarPage;
