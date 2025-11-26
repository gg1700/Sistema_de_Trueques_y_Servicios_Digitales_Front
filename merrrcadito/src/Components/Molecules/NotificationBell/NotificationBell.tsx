"use client";

import React, { useState, useEffect } from 'react';
import styles from './NotificationBell.module.css';

interface NotificationBellProps {
    userId: number;
    onClick: () => void;
}

export default function NotificationBell({ userId, onClick }: NotificationBellProps) {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_NOTIFICATIONS_API_BASE_URL || 'http://localhost:5000/api/notifications'}/${userId}/unread-count`
                );

                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.data?.count || 0);
                } else {
                    console.warn('Failed to fetch unread count:', response.status);
                    setUnreadCount(0);
                }
            } catch (error) {
                console.warn('Error fetching unread count:', error);
                setUnreadCount(0); // Set to 0 on error instead of crashing
            }
        };

        if (userId > 0) {
            fetchUnreadCount();

            // Poll every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);

            return () => clearInterval(interval);
        }
    }, [userId]);

    return (
        <button className={styles.bellButton} onClick={onClick} aria-label="Notificaciones">
            <svg
                className={styles.bellIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
            </svg>
            {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
        </button>
    );
}
