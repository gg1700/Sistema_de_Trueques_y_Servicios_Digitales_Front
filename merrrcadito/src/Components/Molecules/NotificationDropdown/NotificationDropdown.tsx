"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import styles from './NotificationDropdown.module.css';
import { notificationService } from '@/services/notificationService';

interface Notification {
    cod_notif: number;
    tipo_notif: string;
    cod_ref: number;
    mensaje: string;
    leida: boolean;
    fecha_creacion: string;
}

interface NotificationDropdownProps {
    userId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationDropdown({ userId, isOpen, onClose }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, userId]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(userId);
            setNotifications(response.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        try {
            await notificationService.markAsRead(notification.cod_notif);
            if (notification.cod_ref) {
                router.push(`/intercambios?id=${notification.cod_ref}`);
            }
            onClose();
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(userId);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Notificaciones</h3>
                    <button onClick={handleMarkAllAsRead} className={styles.markAllButton}>
                        Marcar todas como leídas
                    </button>
                </div>

                <div className={styles.notificationsList}>
                    {loading ? (
                        <p className={styles.loading}>Cargando...</p>
                    ) : notifications.length === 0 ? (
                        <p className={styles.empty}>No tienes notificaciones</p>
                    ) : (
                        notifications.slice(0, 10).map((notif) => (
                            <div
                                key={notif.cod_notif}
                                className={`${styles.notificationItem} ${!notif.leida ? styles.unread : ''}`}
                                onClick={() => handleNotificationClick(notif)}
                            >
                                <div className={styles.notificationContent}>
                                    <p className={styles.message}>{notif.mensaje}</p>
                                    <span className={styles.time}>
                                        {new Date(notif.fecha_creacion).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                {!notif.leida && <div className={styles.unreadDot} />}
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <button onClick={() => router.push('/notificaciones')} className={styles.viewAllButton}>
                        Ver todas las notificaciones
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
