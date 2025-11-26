import { useState, useEffect } from "react";
import styles from "./ExploreSection.module.css";

interface Publication {
    cod_pub: number;
    fecha_ini_pub: string;
    foto_pub: Buffer | null;
    calif_pond_pub: number;
    cod_us: number;
    autor_handle: string;
    autor_nombre: string;
    autor_foto: Buffer | null;
    titulo: string;
    descripcion: string;
    precio: number;
    tipo: "Producto" | "Servicio";
}

interface ExploreSectionProps {
    currentUserId: number;
}

const POSTS_API_BASE = process.env.NEXT_PUBLIC_POSTS_API_BASE_URL ?? "http://localhost:5000/api/posts";
const LIKES_API_BASE = process.env.NEXT_PUBLIC_LIKES_API_BASE_URL ?? "http://localhost:5000/api/likes";

export default function ExploreSection({ currentUserId }: ExploreSectionProps) {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
    const [likingPost, setLikingPost] = useState<number | null>(null);

    useEffect(() => {
        fetchPublications();
    }, [currentUserId]);

    const fetchPublications = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${POSTS_API_BASE}/explore/${currentUserId}`);
            const json = await res.json();

            if (!res.ok || json.success === false) {
                const errorDetail = json.error ? `: ${json.error}` : "";
                throw new Error((json.message || "Error al cargar publicaciones") + errorDetail);
            }

            // Filter out posts from current user
            const allPosts = json.data || [];
            const filteredPosts = allPosts.filter((p: Publication) => p.cod_us !== currentUserId);
            setPublications(filteredPosts);

            // Fetch liked status for all publications
            if (json.data && json.data.length > 0) {
                await fetchLikedStatus(json.data.map((p: Publication) => p.cod_pub));
            }
        } catch (err: any) {
            console.error("Error al obtener publicaciones:", err);
            setError(err.message || "Error al cargar publicaciones");
        } finally {
            setLoading(false);
        }
    };

    const fetchLikedStatus = async (publicationIds: number[]) => {
        try {
            const likedSet = new Set<number>();

            // Check each publication if user has liked it
            for (const pubId of publicationIds) {
                const res = await fetch(`${LIKES_API_BASE}/check/${currentUserId}/${pubId}`);
                const json = await res.json();

                if (res.ok && json.success && json.hasLiked) {
                    likedSet.add(pubId);
                }
            }

            setLikedPosts(likedSet);
        } catch (err) {
            console.error("Error checking liked status:", err);
        }
    };

    const handleToggleLike = async (cod_pub: number) => {
        if (likingPost) return; // Prevent multiple simultaneous requests

        try {
            setLikingPost(cod_pub);
            const isLiked = likedPosts.has(cod_pub);

            if (isLiked) {
                // Unlike
                const res = await fetch(`${LIKES_API_BASE}/remove`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cod_us: currentUserId, cod_pub })
                });

                const json = await res.json();

                if (res.ok && json.success) {
                    setLikedPosts(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(cod_pub);
                        return newSet;
                    });
                }
            } else {
                // Like
                const res = await fetch(`${LIKES_API_BASE}/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cod_us: currentUserId, cod_pub })
                });

                const json = await res.json();

                if (res.ok && json.success) {
                    setLikedPosts(prev => {
                        const newSet = new Set(prev);
                        newSet.add(cod_pub);
                        return newSet;
                    });
                }
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        } finally {
            setLikingPost(null);
        }
    };

    const convertBufferToBase64 = (buffer: Buffer | null): string => {
        if (!buffer) return "";

        try {
            // Handle different buffer formats
            if (typeof buffer === "string") {
                // Already a base64 string or data URL
                if (buffer.startsWith("data:")) return buffer;
                return `data:image/jpeg;base64,${buffer}`;
            }

            // Handle array-like buffer objects from PostgreSQL
            const bufferObj = buffer as any;
            if (bufferObj.data && Array.isArray(bufferObj.data)) {
                const bytes = new Uint8Array(bufferObj.data);
                let binary = "";
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return `data:image/jpeg;base64,${btoa(binary)}`;
            }

            // Handle direct Uint8Array or Buffer
            const bytes = new Uint8Array(buffer as any);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return `data:image/jpeg;base64,${btoa(binary)}`;
        } catch (error) {
            console.error("Error converting buffer to base64:", error);
            return "";
        }
    };

    if (loading) {
        return <div className={styles.loading}>Cargando publicaciones...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (publications.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No hay publicaciones disponibles para explorar.</p>
            </div>
        );
    }

    return (
        <div className={styles.exploreContainer}>
            <h2 className={styles.title}>Explorar Publicaciones</h2>
            <div className={styles.publicationsGrid}>
                {publications.map((pub) => (
                    <div key={pub.cod_pub} className={styles.publicationCard}>
                        <div className={styles.imageContainer}>
                            {pub.foto_pub ? (
                                <img
                                    src={convertBufferToBase64(pub.foto_pub)}
                                    alt={pub.titulo}
                                    className={styles.publicationImage}
                                />
                            ) : (
                                <div className={styles.noImage}>Sin imagen</div>
                            )}
                            <span className={styles.typeBadge}>{pub.tipo}</span>
                        </div>
                        <div className={styles.publicationContent}>
                            <h3 className={styles.publicationTitle}>{pub.titulo}</h3>
                            <p className={styles.publicationDescription}>
                                {pub.descripcion || "Sin descripción"}
                            </p>
                            <div className={styles.publicationFooter}>
                                <div className={styles.authorInfo}>
                                    {pub.autor_foto ? (
                                        <img
                                            src={convertBufferToBase64(pub.autor_foto)}
                                            alt={pub.autor_nombre}
                                            className={styles.authorAvatar}
                                        />
                                    ) : (
                                        <div className={styles.authorAvatarPlaceholder}>
                                            {pub.autor_nombre.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className={styles.authorDetails}>
                                        <p className={styles.authorName}>{pub.autor_nombre}</p>
                                        <p className={styles.authorHandle}>@{pub.autor_handle}</p>
                                    </div>
                                </div>
                                <div className={styles.priceContainer}>
                                    <span className={styles.price}>
                                        {pub.precio > 0 ? `Bs ${Number(pub.precio).toFixed(2)}` : "Trueque"}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.ratingContainer}>
                                <span className={styles.rating}>⭐ {Number(pub.calif_pond_pub).toFixed(1)}</span>
                            </div>
                            <button
                                className={`${styles.likeButton} ${likedPosts.has(pub.cod_pub) ? styles.liked : ''}`}
                                onClick={() => handleToggleLike(pub.cod_pub)}
                                disabled={likingPost === pub.cod_pub}
                                title={likedPosts.has(pub.cod_pub) ? "Quitar me gusta" : "Me gusta"}
                            >
                                <i className={`bi ${likedPosts.has(pub.cod_pub) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
