"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AchievementService, Achievement } from '@/services/achievementService';
import styles from './AchievementsPage.module.css';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';

interface AchievementsPageProps {
    userId: number;
}

export default function AchievementsPage({ userId }: AchievementsPageProps) {
    const router = useRouter();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setLoading(true);
                const data = await AchievementService.getUserAchievements(userId);
                setAchievements(data);
            } catch (err) {
                console.error('Error fetching achievements:', err);
                setError('No se pudieron cargar los logros');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchAchievements();
        }
    }, [userId]);

    const completedAchievements = achievements.filter(
        (a) => a.estado_logro === 'completado'
    );

    const inProgressAchievements = achievements.filter(
        (a) => a.estado_logro === 'en_progreso' || a.estado_logro === 'no_iniciado'
    );

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getIconUrl = (achievementId: number) => {
        return AchievementService.getAchievementIconUrl(achievementId);
    };

    if (loading) {
        return (
            <div className={styles.achievementsPage}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Cargando logros...</h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.achievementsPage}>
                <button className={styles.backButton} onClick={() => router.back()}>
                    ← Volver
                </button>
                <div className={styles.header}>
                    <h1 className={styles.title}>Error</h1>
                    <p className={styles.subtitle}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.achievementsPage}>
            <button className={styles.backButton} onClick={() => router.back()}>
                <FaArrowLeft /> Volver al Perfil
            </button>

            <div className={styles.header}>
                <h1 className={styles.title}>🏆 Mis Logros</h1>
                <p className={styles.subtitle}>
                    {completedAchievements.length} de {achievements.length} logros completados
                </p>
            </div>

            {/* Completed Achievements Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Completados</h2>
                {completedAchievements.length > 0 ? (
                    <div className={styles.achievementsGrid}>
                        {completedAchievements.map((achievement) => (
                            <div
                                key={achievement.cod_logro}
                                className={`${styles.achievementCard} ${styles.completed}`}
                            >
                                <div className={styles.cardHeader}>
                                    <div
                                        className={`${styles.iconWrapper} ${styles[achievement.calidad_logro.toUpperCase()]}`}
                                    >
                                        <img
                                            src={getIconUrl(achievement.cod_logro)}
                                            alt={achievement.titulo_logro}
                                            className={styles.achievementIcon}
                                            onError={(e) => {
                                                // Fallback to trophy emoji if image fails to load
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.textContent = '🏆';
                                            }}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.achievementTitle}>
                                            {achievement.titulo_logro}
                                        </h3>
                                        <span
                                            className={`${styles.qualityBadge} ${styles[achievement.calidad_logro.toUpperCase()]}`}
                                        >
                                            {achievement.calidad_logro}
                                        </span>
                                    </div>
                                </div>
                                <p className={styles.achievementDescription}>
                                    {achievement.descr_logro}
                                </p>
                                {achievement.fecha_obtencion_logro && (
                                    <div className={styles.completedDate}>
                                        ✓ Completado el {formatDate(achievement.fecha_obtencion_logro)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>Aún no has completado ningún logro. ¡Sigue participando!</p>
                    </div>
                )}
            </div>

            {/* In Progress Achievements Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>En Progreso</h2>
                {inProgressAchievements.length > 0 ? (
                    <div className={styles.achievementsGrid}>
                        {inProgressAchievements.map((achievement) => (
                            <div key={achievement.cod_logro} className={styles.achievementCard}>
                                <div className={styles.cardHeader}>
                                    <div
                                        className={`${styles.iconWrapper} ${styles[achievement.calidad_logro.toUpperCase()]}`}
                                    >
                                        <img
                                            src={getIconUrl(achievement.cod_logro)}
                                            alt={achievement.titulo_logro}
                                            className={styles.achievementIcon}
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.textContent = '🏆';
                                            }}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.achievementTitle}>
                                            {achievement.titulo_logro}
                                        </h3>
                                        <span
                                            className={`${styles.qualityBadge} ${styles[achievement.calidad_logro.toUpperCase()]}`}
                                        >
                                            {achievement.calidad_logro}
                                        </span>
                                    </div>
                                </div>
                                <p className={styles.achievementDescription}>
                                    {achievement.descr_logro}
                                </p>
                                <div className={styles.progressSection}>
                                    <div className={styles.progressLabel}>
                                        <span>Progreso</span>
                                        <span className={styles.progressPercentage}>
                                            {achievement.progreso}%
                                        </span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${achievement.progreso}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>¡Has completado todos los logros disponibles!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
