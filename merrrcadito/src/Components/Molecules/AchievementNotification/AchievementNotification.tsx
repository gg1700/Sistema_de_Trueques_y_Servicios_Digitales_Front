"use client";

import React, { useEffect, useState } from 'react';
import { AchievementService } from '@/services/achievementService';
import styles from './AchievementNotification.module.css';

interface AchievementNotificationProps {
    achievementId: number;
    achievementTitle: string;
    onClose: () => void;
    autoClose?: boolean;
    autoCloseDuration?: number;
}

export default function AchievementNotification({
    achievementId,
    achievementTitle,
    onClose,
    autoClose = true,
    autoCloseDuration = 5000,
}: AchievementNotificationProps) {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoCloseDuration);

            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDuration]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 500); // Match fadeOut animation duration
    };

    const getIconUrl = () => {
        return AchievementService.getAchievementIconUrl(achievementId);
    };

    return (
        <div className={styles.notificationContainer}>
            <div className={`${styles.notificationCard} ${isClosing ? styles.fadeOut : ''}`}>
                <button className={styles.closeButton} onClick={handleClose}>
                    ×
                </button>
                <div className={styles.content}>
                    <div className={styles.iconWrapper}>
                        <img
                            src={getIconUrl()}
                            alt={achievementTitle}
                            className={styles.achievementIcon}
                            onError={(e) => {
                                // Fallback to trophy emoji if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.textContent = '🏆';
                            }}
                        />
                    </div>
                    <div className={styles.textContent}>
                        <div className={styles.title}>¡Logro Desbloqueado!</div>
                        <div className={styles.achievementName}>{achievementTitle}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
