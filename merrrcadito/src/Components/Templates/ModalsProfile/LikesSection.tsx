"use client";

import React, { useEffect, useState } from "react";
import styles from "./LikesSection.module.css";

const LIKES_API_BASE =
    process.env.NEXT_PUBLIC_LIKES_API_BASE_URL ??
    "http://localhost:5000/api/likes";

const PUBLICATIONS_API_BASE =
    process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
    "http://localhost:5000/api/publications";

interface LikedPublication {
    cod_like: number;
    cod_pub: number;
    fecha_like: string;
    titulo_publicacion: string;
    descripcion_publicacion: string;
    precio: number;
    autor_handle: string;
    autor_nombre: string;
    calif_pond_pub: number;
}

interface Props {
    userId: number;
}

export default function LikesSection({ userId }: Props) {
    const [likes, setLikes] = useState<LikedPublication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLikes();
    }, [userId]);

    const fetchLikes = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${LIKES_API_BASE}/user/${userId}`);
            const json = await res.json();

            if (!res.ok || json.success === false) {
                const errorDetail = json.error ? `: ${json.error}` : "";
                throw new Error((json.message || "Error al cargar me gustas") + errorDetail);
            }

            setLikes(json.data || []);
        } catch (err: any) {
            console.error("Error fetching likes:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlike = async (cod_pub: number) => {
        try {
            const res = await fetch(`${LIKES_API_BASE}/remove`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cod_us: userId, cod_pub }),
            });

            const json = await res.json();

            if (!res.ok || json.success === false) {
                throw new Error(json.message || "Error al quitar me gusta");
            }

            // Actualizar lista
            setLikes((prev) => prev.filter((like) => like.cod_pub !== cod_pub));
        } catch (err: any) {
            console.error("Error removing like:", err);
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <i className="bi bi-heart-fill" style={{ fontSize: "48px", color: "#ff5f5f" }}></i>
                    <p>Cargando publicaciones que te gustan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <i className="bi bi-exclamation-triangle" style={{ fontSize: "48px", color: "#ff5f5f" }}></i>
                    <p>{error}</p>
                    <button onClick={fetchLikes} className={styles.retryBtn}>
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (likes.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.empty}>
                    <i className="bi bi-heart" style={{ fontSize: "64px", color: "#d8cdd1" }}></i>
                    <h3>No has dado me gusta a ninguna publicación</h3>
                    <p>Explora el mercado y guarda tus publicaciones favoritas</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>
                    <i className="bi bi-heart-fill"></i> Publicaciones que te gustan
                </h2>
                <span className={styles.count}>{likes.length} publicaciones</span>
            </div>

            <div className={styles.grid}>
                {likes.map((like) => (
                    <div key={like.cod_like} className={styles.card}>
                        <div className={styles.cardImage}>
                            <img
                                src={`${PUBLICATIONS_API_BASE}/${like.cod_pub}/image`}
                                alt={like.titulo_publicacion}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    // Prevent infinite loop if default image also fails
                                    if (target.src.includes('default_image.jpg')) return;
                                    target.src = `${process.env.NEXT_PUBLIC_API_URL}/images/default_image.jpg`;
                                }}
                            />
                            <button
                                className={styles.unlikeBtn}
                                onClick={() => handleUnlike(like.cod_pub)}
                                title="Quitar me gusta"
                            >
                                <i className="bi bi-heart-fill"></i>
                            </button>
                        </div>

                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>{like.titulo_publicacion}</h3>
                            <p className={styles.cardDescription}>
                                {like.descripcion_publicacion}
                            </p>

                            <div className={styles.cardMeta}>
                                <div className={styles.author}>
                                    <i className="bi bi-person-circle"></i>
                                    <span>@{like.autor_handle}</span>
                                </div>
                                {like.calif_pond_pub && Number(like.calif_pond_pub) > 0 && (
                                    <div className={styles.rating}>
                                        <i className="bi bi-star-fill"></i>
                                        <span>{Number(like.calif_pond_pub).toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardFooter}>
                                <div className={styles.price}>
                                    <i className="bi bi-coin"></i>
                                    <span>{like.precio} tokens</span>
                                </div>
                                <div className={styles.date}>
                                    <i className="bi bi-clock"></i>
                                    <span>
                                        {new Date(like.fecha_like).toLocaleDateString("es-ES")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
