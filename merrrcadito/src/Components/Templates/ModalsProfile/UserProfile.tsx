"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./UserProfile.module.css";

import FileInput from "@/Components/Templates/ModalsProfile/FileInput";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import { getNavItems } from "../../../Utils/navigation";
import { ReportService } from "@/services";

const USERS_API_BASE =
  process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
  "http://localhost:5000/api/users";

const PRODUCTS_API_BASE =
  process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL ??
  "http://localhost:5000/api/products";

const POSTS_API_BASE =
  process.env.NEXT_PUBLIC_POSTS_API_BASE_URL ??
  "http://localhost:5000/api/posts";

const CATEGORIES_API_BASE =
  process.env.NEXT_PUBLIC_CATEGORIES_API_BASE_URL ??
  "http://localhost:5000/api/categories";

const SUBCATEGORIES_API_BASE =
  process.env.NEXT_PUBLIC_SUBCATEGORIES_API_BASE_URL ??
  "http://localhost:5000/api/subcategories";

const PUBLICATIONS_API_BASE =
  process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
  "http://localhost:5000/api/publications";

type Tab = "offers" | "publish" | "likes" | "events";
type PublishType = "product" | "service";
type NavRole = "admin" | "user";
type Role = NavRole | "entrepreneur";

interface Offer {
  id: number;
  title: string;
  description: string;
  image?: string;
  price?: number;
}

interface ProductFormState {
  name: string;
  weightKg: string;
  material: string;
  category: string;
  subcategory: string;
  quality: string;
  description: string;
  priceTokens: string;
  image: File | null;
}

interface ServiceFormState {
  name: string;
  duration: string;
  category: string;
  description: string;
  priceTokens: string;
  image: File | null;
}

interface UserApi {
  cod_us: number;
  cod_rol: number;
  handle_name: string;
  nom_us: string;
  ap_pat_us: string;
  ap_mat_us?: string | null;
  correo_us: string;
  telefono_us: string;
  ci_us?: string | null;
  fecha_nac_us?: string | null;
  genero_us?: string | null;
  fecha_registro?: string | null;
}

interface Category {
  cod_cat: number;
  nom_cat: string;
  descr_cat?: string;
  tipo_cat: string;
}

interface Subcategory {
  cod_subcat_prod: number;
  nom_subcat_prod: string;
  descr_subcat_prod: string;
  cod_cat: number;
}

interface UserProfileProps {
  role?: Role;
}

const mapCodRolToRole = (codRol?: number): Role => {
  if (codRol === 2) return "entrepreneur";
  if (codRol === 3) return "admin";
  return "user";
};

export default function UserProfile({
  role: roleProp = "admin",
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("offers");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishType, setPublishType] = useState<PublishType>("product");
  const [showMoreInfo, setShowMoreInfo] = useState(false); // Estado para expandir/colapsar

  const [productForm, setProductForm] = useState<ProductFormState>({
    name: "",
    weightKg: "",
    material: "",
    category: "",
    subcategory: "",
    quality: "",
    description: "",
    priceTokens: "",
    image: null,
  });

  const [serviceForm, setServiceForm] = useState<ServiceFormState>({
    name: "",
    duration: "",
    category: "",
    description: "",
    priceTokens: "",
    image: null,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserApi | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedHandle, setResolvedHandle] = useState<string | null>(null);
  const [resolvedRoleFromStorage, setResolvedRoleFromStorage] =
    useState<Role | null>(null);


  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([]);

  // Estado para datos de impacto ambiental
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [loadingEnvironmental, setLoadingEnvironmental] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleFromUrl = searchParams.get("handle");
  const roleFromUrl = searchParams.get("role") as Role | null;

  useEffect(() => {
    if (handleFromUrl) {
      setResolvedHandle(handleFromUrl);
    } else if (typeof window !== "undefined") {
      const storedHandle = window.localStorage.getItem("currentUserHandle");
      if (storedHandle) {
        setResolvedHandle(storedHandle);
      }
    }
    if (roleFromUrl) {
      setResolvedRoleFromStorage(roleFromUrl);
    } else if (typeof window !== "undefined") {
      const storedRole = window.localStorage.getItem(
        "currentUserRole"
      ) as Role | null;
      if (
        storedRole === "admin" ||
        storedRole === "user" ||
        storedRole === "entrepreneur"
      ) {
        setResolvedRoleFromStorage(storedRole);
      }
    }
  }, [handleFromUrl, roleFromUrl]);

  const roleFromBackend = user ? mapCodRolToRole(user.cod_rol) : null;
  const effectiveRole: Role =
    resolvedRoleFromStorage || roleFromBackend || roleProp || "user";

  const navRole: NavRole = effectiveRole === "admin" ? "admin" : "user";
  const navList = getNavItems(navRole);

  useEffect(() => {
    const fetchCategoriesAndSubcats = async () => {
      try {
        const resCat = await fetch(
          `${CATEGORIES_API_BASE}?tipo_cat=Producto`
        );
        const jsonCat = await resCat.json().catch(() => ({} as any));
        if (resCat.ok && jsonCat.data && Array.isArray(jsonCat.data)) {
          setCategories(jsonCat.data as Category[]);
        } else {
          setCategories([]);
        }

        const resSub = await fetch(`${SUBCATEGORIES_API_BASE}`);
        const jsonSub = await resSub.json().catch(() => ({} as any));
        if (resSub.ok && jsonSub.data && Array.isArray(jsonSub.data)) {
          setSubcategories(jsonSub.data as Subcategory[]);
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error("Error cargando categorías/subcategorías:", err);
      }
    };

    fetchCategoriesAndSubcats();
  }, []);

  useEffect(() => {
    if (!productForm.category) {
      setFilteredSubcategories([]);
      return;
    }
    const codCat = parseInt(productForm.category, 10);
    if (isNaN(codCat)) {
      setFilteredSubcategories([]);
      return;
    }
    const filtered = subcategories.filter((s) => s.cod_cat === codCat);
    setFilteredSubcategories(filtered);
  }, [productForm.category, subcategories]);

  const fetchOffersForUser = async (codUs: number) => {
    try {
      const resPosts = await fetch(
        `${POSTS_API_BASE}/all_active_product_posts`
      );
      const jsonPosts = await resPosts.json().catch(() => ({} as any));

      if (resPosts.ok && jsonPosts.data && Array.isArray(jsonPosts.data)) {
        const mappedOffers: Offer[] = jsonPosts.data
          .filter((p: any) => p.cod_us === codUs)
          .map((p: any) => ({
            id: p.cod_pub ?? p.id ?? 0,
            title: p.nom_prod ?? p.titulo_pub ?? p.title ?? "Sin título",
            description: p.descr_pub ?? p.desc_prod ?? p.contenido ?? "",
            image: `${PUBLICATIONS_API_BASE}/${p.cod_pub ?? p.id ?? 0}/image`,
            price: p.precio_pub ?? p.precio_prod ?? 0,
          }));

        setOffers(mappedOffers);
      } else {
        setOffers([]);
      }
    } catch (err) {
      console.error("Error al cargar publicaciones de productos:", err);
      setOffers([]);
    }
  };

  const fetchEnvironmentalData = async (codUs: number) => {
    try {
      setLoadingEnvironmental(true);
      const response = await ReportService.get_user_environmental_impact(codUs);
      if (response.success && response.data) {
        setEnvironmentalData(response.data);
      }
    } catch (err) {
      console.error("Error al cargar datos de impacto ambiental:", err);
      setEnvironmentalData(null);
    } finally {
      setLoadingEnvironmental(false);
    }
  };

  useEffect(() => {
    if (!resolvedHandle) {
      setError("No se encontró información de sesión del usuario.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const resUser = await fetch(
          `${USERS_API_BASE}/get_user_data?handle_name=${encodeURIComponent(
            resolvedHandle
          )}`
        );
        const jsonUser = await resUser.json();

        if (!resUser.ok || jsonUser.success === false || !jsonUser.data) {
          throw new Error(
            jsonUser.message || "No se pudieron cargar los datos del usuario."
          );
        }

        const rawData = jsonUser.data;
        const userData: UserApi = Array.isArray(rawData)
          ? rawData[0]
          : rawData;
        setUser(userData);

        if (userData.cod_us) {
          await fetchOffersForUser(userData.cod_us);
          // Cargar datos de impacto ambiental sin bloquear el perfil si falla
          try {
            await fetchEnvironmentalData(userData.cod_us);
          } catch (envErr) {
            console.error("Error al cargar impacto ambiental (no crítico):", envErr);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message ?? "Ocurrió un error al cargar los datos del perfil."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedHandle]);

  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "category") {
      setProductForm((prev) => ({
        ...prev,
        category: value,
        subcategory: "",
      }));
      return;
    }

    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user?.cod_us) {
      setError("No se encontró el código de usuario para publicar.");
      return;
    }

    if (!productForm.subcategory) {
      setError("Debes seleccionar una subcategoría de producto.");
      return;
    }

    try {
      setError(null);

      const pesoNumber =
        productForm.weightKg.trim() === ""
          ? 1
          : Number(productForm.weightKg);

      const precioNumber =
        productForm.priceTokens.trim() === ""
          ? 0
          : Number(productForm.priceTokens);

      const productPayload: any = {
        nom_prod:
          productForm.name && productForm.name.trim() !== ""
            ? productForm.name
            : "Producto sin nombre",
        peso_prod: isNaN(pesoNumber) ? 1 : pesoNumber,
        calidad_prod:
          (productForm.quality as "nuevo" | "usado") || "nuevo",
        estado_prod: "disponible",
        precio_prod: isNaN(precioNumber) ? 0 : precioNumber,
        marca_prod:
          productForm.material && productForm.material.trim() !== ""
            ? productForm.material
            : null,
        desc_prod:
          productForm.description &&
            productForm.description.trim() !== ""
            ? productForm.description
            : null,
      };

      const resProduct = await fetch(
        `${PRODUCTS_API_BASE}/register?cod_subcat_prod=${encodeURIComponent(
          productForm.subcategory
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productPayload),
        }
      );

      const jsonProduct = await resProduct
        .json()
        .catch(() => ({} as any));
      console.log("Respuesta /products/register:", jsonProduct);

      if (!resProduct.ok || jsonProduct.success === false) {
        const backendMsg =
          (jsonProduct.message ||
            "No se pudo registrar el producto.") +
          (jsonProduct.error ? ` ${jsonProduct.error}` : "");
        throw new Error(backendMsg);
      }

      let codProd: number | string | undefined;

      if (
        typeof jsonProduct.data === "number" ||
        typeof jsonProduct.data === "string"
      ) {
        codProd = jsonProduct.data;
      } else if (jsonProduct.data && typeof jsonProduct.data === "object") {
        const createdProduct: any = jsonProduct.data;
        codProd =
          createdProduct.cod_prod ??
          createdProduct.cod_producto ??
          createdProduct.sp_registrarproducto ??
          createdProduct.id;
      } else if (typeof jsonProduct.cod_prod !== "undefined") {
        codProd = jsonProduct.cod_prod;
      }

      if (!codProd) {
        throw new Error(
          "No se recibió el código del producto creado (cod_prod) desde el backend."
        );
      }

      const formData = new FormData();
      formData.append("estado_pub", "activo");
      formData.append(
        "contenido",
        productForm.description || productForm.name || ""
      );
      formData.append(
        "cant_prod",
        productForm.weightKg.trim() === ""
          ? "1"
          : productForm.weightKg
      );
      formData.append("unidad_medida", "kg");

      if (productForm.image) {
        formData.append("foto_pub", productForm.image);
      }

      const resPost = await fetch(
        `${POSTS_API_BASE}/create?cod_us=${user.cod_us}&cod_prod=${codProd}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const jsonPost = await resPost.json().catch(() => ({} as any));
      console.log("Respuesta /posts/create:", jsonPost);

      if (!resPost.ok || jsonPost.success === false) {
        const errorMsg = jsonPost.message || "No se pudo crear la publicación.";
        const errorDetail = jsonPost.error ? ` Detalle: ${jsonPost.error}` : "";
        console.error("Error del backend:", jsonPost);
        throw new Error(errorMsg + errorDetail);
      }

      console.log("Publicación creada con éxito!");
      setShowSuccessModal(true);
      handleCancelProduct();
      // Recargar ofertas para que aparezca la nueva
      // Podríamos llamar a fetchData() de nuevo si extraemos la lógica
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Servicio a publicar:", serviceForm);
  };

  const handleCancelProduct = () => {
    setProductForm({
      name: "",
      weightKg: "",
      material: "",
      category: "",
      subcategory: "",
      quality: "",
      description: "",
      priceTokens: "",
      image: null,
    });
  };

  const handleCancelService = () => {
    setServiceForm({
      name: "",
      duration: "",
      category: "",
      description: "",
      priceTokens: "",
      image: null,
    });
  };

  const fullName =
    user &&
    `${user.nom_us} ${user.ap_pat_us} ${user.ap_mat_us ?? ""}`.trim();

  const roleLabel =
    effectiveRole === "admin"
      ? "Administrador"
      : effectiveRole === "entrepreneur"
        ? "Emprendedor"
        : "Usuario Común";

  const avatarUrl =
    user && user.cod_us ? `${USERS_API_BASE}/${user.cod_us}/image` : null;

  return (
    <section className={styles.profilePage}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.avatarWrapper}>
            {avatarUrl ? (
              <div className={styles.avatarCircle}>
                <img
                  src={avatarUrl}
                  alt={user?.handle_name || "Foto de perfil"}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <div className={styles.avatarCircle}>
                <span className={styles.avatarEmoji}>😊</span>
              </div>
            )}
          </div>

          <button
            className={styles.menuButton}
            type="button"
            aria-label="Menú"
            onClick={() => setIsMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className={styles.userInfo}>
          <h1 className={styles.userName}>
            {fullName || (loading ? "Cargando..." : "Sin usuario")}
          </h1>

          {/* Información de Contacto */}
          <div className={styles.infoSection}>
            <h3 className={styles.infoSectionTitle}>Información de Contacto:</h3>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <i className="bi bi-person-circle" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Nombre de Usuario:</span>
                  <span className={styles.infoValue}>@{user?.handle_name ?? "—"}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-gear" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Rol de Perfil:</span>
                  <span className={styles.infoValue}>{roleLabel}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-telephone" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Teléfono/Celular:</span>
                  <span className={styles.infoValue}>{user?.telefono_us ?? "—"}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-envelope" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Correo Electrónico:</span>
                  <span className={styles.infoValue}>{user?.correo_us ?? "—"}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <i className="bi bi-calendar-event" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Fecha de Registro:</span>
                  <span className={styles.infoValue}>
                    {user?.fecha_registro
                      ? new Date(user.fecha_registro).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Información Adicional (Expandible) */}
            {showMoreInfo && (
              <div className={styles.additionalInfo}>
                <h3 className={styles.infoSectionTitle}>Información Personal:</h3>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <i className="bi bi-card-text" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Cédula de Identidad:</span>
                      <span className={styles.infoValue}>{user?.ci_us ?? "—"}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <i className="bi bi-calendar-check" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Fecha de Nacimiento:</span>
                      <span className={styles.infoValue}>
                        {user?.fecha_nac_us
                          ? new Date(user.fecha_nac_us).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <i className="bi bi-gender-ambiguous" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Género/Sexo:</span>
                      <span className={styles.infoValue}>
                        {user?.genero_us
                          ? (user.genero_us === 'M' ? 'Masculino' : user.genero_us === 'F' ? 'Femenino' : user.genero_us)
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <i className="bi bi-check-circle" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Estado de la Cuenta:</span>
                      <span className={styles.infoValue} style={{ color: '#1fb7a1', fontWeight: '600' }}>activo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botón Ver Más/Menos */}
            <button
              className={styles.toggleButton}
              onClick={() => setShowMoreInfo(!showMoreInfo)}
            >
              {showMoreInfo ? (
                <>
                  Ver Menos... <i className="bi bi-chevron-up"></i>
                </>
              ) : (
                <>
                  Ver Más... <i className="bi bi-chevron-down"></i>
                </>
              )}
            </button>

            {/* Mi Impacto Ambiental */}
            {!loadingEnvironmental && environmentalData && (
              <div className={styles.environmentalImpactSection}>
                <h3 className={styles.infoSectionTitle}>Mi Impacto Ambiental:</h3>

                <div className={styles.impactGrid}>
                  {/* Impacto Ambiental Total */}
                  <div className={styles.impactItem}>
                    <i className="bi bi-person" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.impactContent}>
                      <span className={styles.impactLabel}>Impacto Ambiental Total:</span>
                      <span className={styles.impactValue}>
                        {environmentalData.huella_co2_total?.toFixed(2) ?? '—'} puntos
                      </span>
                    </div>
                  </div>

                  {/* Tendencia de Aporte al Medio Ambiente */}
                  <div className={styles.impactItem}>
                    <i className="bi bi-recycle" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.impactContent}>
                      <span className={styles.impactLabel}>Tendencia de Aporte al Medio Ambiente:</span>
                      <span
                        className={styles.impactValue}
                        style={{
                          color: environmentalData.tendencia === 'bueno' ? '#28a745' :
                            environmentalData.tendencia === 'medio' ? '#ffc107' : '#dc3545',
                          fontWeight: 'bold'
                        }}
                      >
                        {environmentalData.tendencia ?? '—'}
                      </span>
                    </div>
                  </div>

                  {/* Impacto Promedio por Intercambio */}
                  <div className={styles.impactItem}>
                    <i className="bi bi-arrow-left-right" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.impactContent}>
                      <span className={styles.impactLabel}>Impacto Promedio por Intercambio:</span>
                      <span className={styles.impactValue}>
                        {environmentalData.impacto_promedio_intercambios?.toFixed(2) ?? '—'} puntos
                      </span>
                    </div>
                  </div>

                  {/* Impacto Promedio por Publicación de Productos Comprada */}
                  <div className={styles.impactItem}>
                    <i className="bi bi-bag-check" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.impactContent}>
                      <span className={styles.impactLabel}>Impacto Promedio por Publicación de Productos Comprada:</span>
                      <span className={styles.impactValue}>
                        {environmentalData.impacto_promedio_productos?.toFixed(2) ?? '—'} puntos
                      </span>
                    </div>
                  </div>

                  {/* Impacto Promedio por Publicación de Servicios Comprada */}
                  <div className={styles.impactItem}>
                    <i className="bi bi-tools" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.impactContent}>
                      <span className={styles.impactLabel}>Impacto Promedio por Publicación de Servicios Comprada:</span>
                      <span className={styles.impactValue}>
                        {environmentalData.impacto_promedio_servicios?.toFixed(2) ?? '—'} puntos
                      </span>
                    </div>
                  </div>

                  {/* Aporte de Impacto Ambiental por Participación en Eventos */}
                  <div className={styles.impactItem}>
                    <i className="bi bi-calendar-event" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.impactContent}>
                      <span className={styles.impactLabel}>Aporte de Impacto Ambiental por Participación en Eventos:</span>
                      <span className={styles.impactValue}>
                        {environmentalData.impacto_promedio_eventos?.toFixed(2) ?? '—'} puntos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "offers" ? "tabActive" : ""
              }`}
            onClick={() => setActiveTab("offers")}
          >
            Ofertas Propias
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "publish" ? "tabActive" : ""
              }`}
            onClick={() => setActiveTab("publish")}
          >
            Publicar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "likes" ? "tabActive" : ""
              }`}
            onClick={() => setActiveTab("likes")}
          >
            Me gusta
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "events" ? "tabActive" : ""
              }`}
            onClick={() => setActiveTab("events")}
          >
            Eventos
          </button>
        </nav>
      </header>

      <div className={styles.tabContent}>
        {loading && (
          <div className={styles.placeholderTab}>
            <p>Cargando información del perfil...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.placeholderTab}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && activeTab === "offers" && (
          <OffersSection offers={offers} />
        )}

        {!loading && !error && activeTab === "publish" && (
          <PublishSection
            publishType={publishType}
            setPublishType={setPublishType}
            productForm={productForm}
            serviceForm={serviceForm}
            handleProductChange={handleProductChange}
            handleServiceChange={handleServiceChange}
            handleSubmitProduct={handleSubmitProduct}
            handleSubmitService={handleSubmitService}
            handleCancelProduct={handleCancelProduct}
            handleCancelService={handleCancelService}
            onChangeProductImage={(file) =>
              setProductForm((prev) => ({ ...prev, image: file }))
            }
            onChangeServiceImage={(file) =>
              setServiceForm((prev) => ({ ...prev, image: file }))
            }
            categories={categories}
            filteredSubcategories={filteredSubcategories}
          />
        )}

        {!loading && !error && activeTab === "likes" && (
          <div className={styles.placeholderTab}>
            <p>No hay me gustas</p>
          </div>
        )}

        {!loading && !error && activeTab === "events" && (
          <div className={styles.placeholderTab}>
            <p>No hay eventos</p>
          </div>
        )}
      </div>

      {isMenuOpen && (
        <>
          <div
            className={styles.menuOverlay}
            onClick={() => setIsMenuOpen(false)}
          />
          <aside className={styles.sideMenu}>
            <div className={styles.sideMenuHeader}>
              <span className={styles.sideMenuTitle}>MERRRCADITO</span>
              <button
                type="button"
                className={styles.sideMenuClose}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>

            <nav className={styles.sideMenuNav}>
              {navList.map((item) => {
                const isActive = pathname === item.route;
                return (
                  <Link
                    key={item.route}
                    href={item.route}
                    className={`${styles.sideMenuLink} ${isActive ? "sideMenuLinkActive" : ""
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {showSuccessModal && (
        <div className={styles.successModalOverlay}>
          <div className={styles.successModalContent}>
            <span className={styles.successIcon}>🎉</span>
            <h2 className={styles.successTitle}>¡Publicación Exitosa!</h2>
            <p className={styles.successMessage}>
              Tu producto ha sido publicado correctamente y ya está visible en el mercado.
            </p>
            <button
              className={styles.submitButton}
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

interface OffersSectionProps {
  offers: Offer[];
}

function OffersSection({ offers }: OffersSectionProps) {
  if (!offers.length) {
    return (
      <div className={styles.placeholderTab}>
        <p>Este usuario aún no tiene ofertas publicadas.</p>
      </div>
    );
  }

  return (
    <div className={styles.offersSection}>
      {offers.map((offer) => (
        <article key={offer.id} className={styles.offerCard}>
          <div className={styles.offerImage}>
            {offer.image && (
              <img
                src={offer.image}
                alt={offer.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            )}
          </div>
          <div className={styles.offerInfo}>
            <h2 className={styles.offerTitle}>{offer.title}</h2>
            <p className={styles.offerDescription}>{offer.description}</p>
          </div>
          <div className={styles.offerActions}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1fb7a1'
                }}>
                  {offer.price ?? 0}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#6b7785',
                  fontWeight: '500'
                }}>
                  Tokens
                </span>
              </div>
              <button
                type="button"
                className={styles.iconButton}
                title="Compartir"
              >
                <i className="bi bi-share" />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                title="Favorito"
              >
                <i className="bi bi-heart" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

interface PublishSectionProps {
  publishType: PublishType;
  setPublishType: (type: PublishType) => void;
  productForm: ProductFormState;
  serviceForm: ServiceFormState;
  onChangeProductImage: (file: File | null) => void;
  onChangeServiceImage: (file: File | null) => void;
  handleProductChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleServiceChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleSubmitProduct: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  handleSubmitService: (e: React.FormEvent) => void;
  handleCancelProduct: () => void;
  handleCancelService: () => void;
  categories: Category[];
  filteredSubcategories: Subcategory[];
}

function PublishSection({
  publishType,
  setPublishType,
  productForm,
  serviceForm,
  onChangeProductImage,
  onChangeServiceImage,
  handleProductChange,
  handleServiceChange,
  handleSubmitProduct,
  handleSubmitService,
  handleCancelProduct,
  handleCancelService,
  categories,
  filteredSubcategories,
}: PublishSectionProps) {
  return (
    <section className={styles.publishSection}>
      <h2 className={styles.publishQuestion}>¿Que desea ofertar?</h2>

      <div className={styles.publishTabs}>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "product" ? "publishTabActive" : ""
            }`}
          onClick={() => setPublishType("product")}
        >
          Producto
        </button>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "service" ? "publishTabActive" : ""
            }`}
          onClick={() => setPublishType("service")}
        >
          Servicio
        </button>
      </div>

      {publishType === "product" ? (
        <form
          onSubmit={handleSubmitProduct}
          className={styles.publishForm}
          noValidate
        >
          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Nombre del Producto</label>
              <ProfileInput
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleProductChange as any}
                placeholder="Ej. Chocolate bar powder"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Peso (Kg)</label>
              <ProfileInput
                type="text"
                name="weightKg"
                value={productForm.weightKg}
                onChange={handleProductChange as any}
                placeholder="Ej. 0.5"
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Marca / Material</label>
              <ProfileInput
                type="text"
                name="material"
                value={productForm.material}
                onChange={handleProductChange as any}
                placeholder="Ej. COCA"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Categoría</label>
              <select
                name="category"
                value={productForm.category}
                onChange={handleProductChange}
                className={styles.selectInput}
              >
                <option value="">Seleccionar</option>
                {categories.map((cat) => (
                  <option
                    key={cat.cod_cat}
                    value={cat.cod_cat.toString()}
                  >
                    {cat.nom_cat}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Subcategoría</label>
              <select
                name="subcategory"
                value={productForm.subcategory}
                onChange={handleProductChange}
                className={styles.selectInput}
                disabled={!productForm.category}
              >
                <option value="">Seleccionar</option>
                {filteredSubcategories.map((sub) => (
                  <option
                    key={sub.cod_subcat_prod}
                    value={sub.cod_subcat_prod.toString()}
                  >
                    {sub.nom_subcat_prod}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Calidad</label>
              <select
                name="quality"
                value={productForm.quality}
                onChange={handleProductChange}
                className={styles.selectInput}
              >
                <option value="">Seleccionar</option>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Descripción</label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                className={styles.textarea}
                placeholder="Describe tu producto..."
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Precio Tokens</label>
              <ProfileInput
                type="text"
                name="priceTokens"
                value={productForm.priceTokens}
                onChange={handleProductChange as any}
                placeholder="Ej. 10"
              />
            </div>
          </div>

          <div className={styles.formRowBottom}>
            <div className={styles.formColImage}>
              <label className={styles.fieldLabel}>
                Imagen (cuadrada, máx. 100KB)
              </label>
              <FileInput name="productImage" onChange={onChangeProductImage} />
            </div>

            <div className={styles.formColButtons}>
              <div className={styles.actionsRowInline}>
                <button type="submit" className={styles.submitButton}>
                  Ofertar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelProduct}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitService}
          className={styles.publishForm}
          noValidate
        >
          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Nombre de Servicio</label>
              <ProfileInput
                type="text"
                name="name"
                value={serviceForm.name}
                onChange={handleServiceChange as any}
                placeholder="Ej. Asesoría de marketing"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Duración</label>
              <ProfileInput
                type="text"
                name="duration"
                value={serviceForm.duration}
                onChange={handleServiceChange as any}
                placeholder="Ej. 2 horas"
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Categoría</label>
              <select
                name="category"
                value={serviceForm.category}
                onChange={handleServiceChange}
                className={styles.selectInput}
              >
                <option value="">Seleccionar</option>
                <option value="marketing">Marketing</option>
                <option value="soporte">Soporte</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Descripción</label>
              <textarea
                name="description"
                value={serviceForm.description}
                onChange={handleServiceChange}
                className={styles.textarea}
                placeholder="Describe tu servicio..."
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Precio Tokens</label>
              <ProfileInput
                type="text"
                name="priceTokens"
                value={serviceForm.priceTokens}
                onChange={handleServiceChange as any}
                placeholder="Ej. 15"
              />
            </div>
          </div>

          <div className={styles.formRowBottom}>
            <div className={styles.formColImage}>
              <label className={styles.fieldLabel}>
                Imagen (cuadrada, máx. 100KB)
              </label>
              <FileInput name="serviceImage" onChange={onChangeServiceImage} />
            </div>

            <div className={styles.formColButtons}>
              <div className={styles.actionsRowInline}>
                <button type="submit" className={styles.submitButton}>
                  Ofertar
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCancelService}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
