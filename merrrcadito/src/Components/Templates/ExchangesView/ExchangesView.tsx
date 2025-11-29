"use client";

import React, { useState, useEffect } from 'react';
import styles from './ExchangesView.module.css';
import ExchangeCard from '@/Components/Molecules/ExchangeCard/ExchangeCard';
import { exchangeService } from '@/services/exchangeService';

interface ExchangesViewProps {
    userId: number;
}

type TabType = 'propuesto' | 'aceptado' | 'completado' | 'rechazado';

export default function ExchangesView({ userId }: ExchangesViewProps) {
    const [activeTab, setActiveTab] = useState<TabType>('propuesto');
    const [exchanges, setExchanges] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchExchanges();
    }, [activeTab, userId]);

    const fetchExchanges = async () => {
        setLoading(true);
        try {
            const response = await exchangeService.getExchangesByStatus(userId, activeTab);
            setExchanges(response.data || []);
        } catch (error) {
            console.error('Error fetching exchanges:', error);
            setExchanges([]);
        } finally {
            setLoading(false);
        }
    };

    const tabs: { key: TabType; label: string; count?: number }[] = [
        { key: 'propuesto', label: 'Propuestos' },
        { key: 'aceptado', label: 'Aceptados' },
        { key: 'completado', label: 'Completados' },
        { key: 'rechazado', label: 'Rechazados' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Mis Intercambios</h1>
                <p className={styles.subtitle}>Gestiona tus propuestas e intercambios activos</p>
            </div>

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Cargando intercambios...</p>
                    </div>
                ) : exchanges.length === 0 ? (
                    <div className={styles.empty}>
                        <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3>No hay intercambios {activeTab}s</h3>
                        <p>
                            {activeTab === 'propuesto' && 'Crea una nueva propuesta de intercambio para comenzar'}
                            {activeTab === 'aceptado' && 'Los intercambios aceptados aparecerán aquí'}
                            {activeTab === 'completado' && 'Los intercambios completados aparecerán aquí'}
                            {activeTab === 'rechazado' && 'Los intercambios rechazados aparecerán aquí'}
                        </p>
                    </div>
                ) : (
                    <div className={styles.exchangesList}>
                        {exchanges.map((exchange) => (
                            <ExchangeCard
                                key={exchange.cod_inter}
                                exchange={exchange}
                                currentUserId={userId}
                                onUpdate={fetchExchanges}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
