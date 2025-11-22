"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./UserProfile.module.css";

import FileInput from "@/Components/Templates/ModalsProfile/FileInput";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import { getNavItems } from "../../../Utils/navigation";

const USERS_API_BASE =
  process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
  "http://localhost:5000/api/users";

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
  const [publishType, setPublishType] = useState<PublishType>("product");

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
          const resPosts = await fetch(
            `${USERS_API_BASE}/get_user_posts?cod_us=${userData.cod_us}`
          );
          const jsonPosts = await resPosts.json();

          if (resPosts.ok && jsonPosts.data && Array.isArray(jsonPosts.data)) {
            const mappedOffers: Offer[] = jsonPosts.data.map((p: any) => ({
              id: p.cod_pub ?? p.id ?? 0,
              title: p.titulo_pub ?? p.title ?? "Sin título",
              description: p.descr_pub ?? p.description ?? "",
              image: `${PUBLICATIONS_API_BASE}/${p.cod_pub ?? p.id ?? 0}/image`,
            }));

            setOffers(mappedOffers);
          } else {
            setOffers([]);
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

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Producto a publicar:", productForm);
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
            {user?.handle_name ??
              (loading ? "Cargando..." : "Sin usuario")}
          </h1>

          <div className={styles.userInfoGrid}>
            <p className={styles.userInfoText}>{roleLabel}</p>
            <p className={styles.userInfoText}>{fullName || "—"}</p>
            <p className={styles.userInfoText}>{user?.telefono_us ?? "—"}</p>
            <p className={styles.userInfoText}>{user?.correo_us ?? "—"}</p>
          </div>
        </div>

        <nav className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "offers" ? styles.tabActive : ""
              }`}
            onClick={() => setActiveTab("offers")}
          >
            Ofertas Propias
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "publish" ? styles.tabActive : ""
              }`}
            onClick={() => setActiveTab("publish")}
          >
            Publicar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "likes" ? styles.tabActive : ""
              }`}
            onClick={() => setActiveTab("likes")}
          >
            Me gusta
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "events" ? styles.tabActive : ""
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
                    className={`${styles.sideMenuLink} ${isActive ? styles.sideMenuLinkActive : ""
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
  handleSubmitProduct: (e: React.FormEvent) => void;
  handleSubmitService: (e: React.FormEvent) => void;
  handleCancelProduct: () => void;
  handleCancelService: () => void;
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
}: PublishSectionProps) {
  return (
    <section className={styles.publishSection}>
      <h2 className={styles.publishQuestion}>¿Que desea ofertar?</h2>

      <div className={styles.publishTabs}>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "product" ? styles.publishTabActive : ""
            }`}
          onClick={() => setPublishType("product")}
        >
          Producto
        </button>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "service" ? styles.publishTabActive : ""
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
              <label className={styles.fieldLabel}>Peso Kg</label>
              <ProfileInput
                type="text"
                name="weightKg"
                value={productForm.weightKg}
                onChange={handleProductChange as any}
                placeholder="Ej. 0.5"
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Material</label>
              <select
                name="material"
                value={productForm.material}
                onChange={handleProductChange}
                className={styles.selectInput}
              >
                <option value="">Seleccionar</option>
                <option value="cacao">Cacao</option>
                <option value="mezcla">Mezcla</option>
              </select>
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
                <option value="dulces">Dulces</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Subcategoría</label>
              <select
                name="subcategory"
                value={productForm.subcategory}
                onChange={handleProductChange}
                className={styles.selectInput}
              >
                <option value="">Seleccionar</option>
                <option value="chocolate">Chocolate</option>
                <option value="polvo">En polvo</option>
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
                <option value="alta">Alta</option>
                <option value="media">Media</option>
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
