"use client";

import React, { useState } from 'react';
import styles from './ExchangeCard.module.css';
import { exchangeService } from '@/services/exchangeService';

interface Exchange {
    cod_inter: number;
    cod_us_1: number;
    cod_us_2: number;
    cant_prod_origen: number;
    unidad_medida_origen: string;
    cant_prod_destino: number;
    unidad_medida_destino: string;
    estado_inter: string;
    confirmado_us_1: boolean;
    confirmado_us_2: boolean;
    nombre_us_1: string;
    handle_us_1: string;
    nombre_us_2: string;
    handle_us_2: string;
    foto_inter?: Buffer;
}

interface ExchangeCardProps {
    exchange: Exchange;
    currentUserId: number;
    onUpdate: () => void;
}

export default function ExchangeCard({ exchange, currentUserId, onUpdate }: ExchangeCardProps) {
    const [loading, setLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const isUser1 = exchange.cod_us_1 === currentUserId;
    const otherUser = isUser1
        ? { name: exchange.nombre_us_2, handle: exchange.handle_us_2 }
        : { name: exchange.nombre_us_1, handle: exchange.handle_us_1 };

    const canAccept = exchange.estado_inter === 'propuesto' && !isUser1;
    const canReject = exchange.estado_inter === 'propuesto' && !isUser1;
    const canConfirm = exchange.estado_inter === 'aceptado';
    const userConfirmed = isUser1 ? exchange.confirmado_us_1 : exchange.confirmado_us_2;

    const handleAccept = async () => {
        setLoading(true);
        try {
            await exchangeService.acceptExchange(exchange.cod_inter, currentUserId);
            alert('Propuesta aceptada exitosamente');
            onUpdate();
        } catch (error) {
            console.error('Error accepting exchange:', error);
            alert('Error al aceptar la propuesta');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            await exchangeService.rejectExchange(exchange.cod_inter, currentUserId, rejectReason);
            alert('Propuesta rechazada');
            setShowRejectModal(false);
            onUpdate();
        } catch (error) {
            console.error('Error rejecting exchange:', error);
            alert('Error al rechazar la propuesta');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const result = await exchangeService.confirmExchange(exchange.cod_inter, currentUserId);
            if (result.data.completed) {
                alert('¡Intercambio completado exitosamente!');
            } else {
                alert('Confirmación registrada. Esperando confirmación del otro usuario.');
            }
            onUpdate();
        } catch (error) {
            console.error('Error confirming exchange:', error);
            alert('Error al confirmar el intercambio');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = () => {
        const statusMap: Record<string, { label: string; className: string }> = {
            propuesto: { label: 'Propuesto', className: styles.statusPropuesto },
            aceptado: { label: 'Aceptado', className: styles.statusAceptado },
            rechazado: { label: 'Rechazado', className: styles.statusRechazado },
            completado: { label: 'Completado', className: styles.statusCompletado },
        };
        const status = statusMap[exchange.estado_inter] || { label: exchange.estado_inter, className: '' };
        return <span className={`${styles.statusBadge} ${status.className}`}>{status.label}</span>;
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Intercambio con {otherUser.name}</h3>
                    <p className={styles.handle}>@{otherUser.handle}</p>
                </div>
                {getStatusBadge()}
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h4>{isUser1 ? 'Ofreces' : 'Recibes'}</h4>
                    <p className={styles.amount}>
                        {exchange.cant_prod_origen} {exchange.unidad_medida_origen}
                    </p>
                </div>

                <div className={styles.divider}>⇄</div>

                <div className={styles.section}>
                    <h4>{isUser1 ? 'Recibes' : 'Ofreces'}</h4>
                    <p className={styles.amount}>
                        {exchange.cant_prod_destino} {exchange.unidad_medida_destino}
                    </p>
                </div>
            </div>

            {canConfirm && (
                <div className={styles.confirmationStatus}>
                    {userConfirmed ? (
                        <p className={styles.confirmed}>✓ Ya confirmaste este intercambio</p>
                    ) : (
                        <p className={styles.pending}>Esperando tu confirmación</p>
                    )}
                </div>
            )}

            <div className={styles.actions}>
                {canAccept && (
                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        className={styles.acceptButton}
                    >
                        {loading ? 'Procesando...' : 'Aceptar'}
                    </button>
                )}

                {canReject && (
                    <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={loading}
                        className={styles.rejectButton}
                    >
                        Rechazar
                    </button>
                )}

                {canConfirm && !userConfirmed && (
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={styles.confirmButton}
                    >
                        {loading ? 'Confirmando...' : 'Confirmar Intercambio'}
                    </button>
                )}
            </div>

            {showRejectModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Rechazar Propuesta</h3>
                        <p>¿Deseas agregar un motivo? (opcional)</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Escribe el motivo aquí..."
                            className={styles.textarea}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowRejectModal(false)} className={styles.cancelButton}>
                                Cancelar
                            </button>
                            <button onClick={handleReject} className={styles.confirmRejectButton}>
                                Rechazar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
