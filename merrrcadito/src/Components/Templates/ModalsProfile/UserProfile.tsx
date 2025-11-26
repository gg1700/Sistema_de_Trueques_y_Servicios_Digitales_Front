"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./UserProfile.module.css";

import FileInput from "@/Components/Templates/ModalsProfile/FileInput";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import LikesSection from "./LikesSection";
import EventsSection from "./EventsSection";
import ExploreSection from "./ExploreSection";
import ExchangeRegistrationForm from "./ExchangeRegistrationForm";
import ServiceRegistrationForm from "./ServiceRegistrationForm";
import { getNavItems } from "../../../Utils/navigation";
import { ReportService, EventService } from "@/services";
import { ExchangeService } from "@/services/exchangeService";

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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const SUBCATEGORIES_API_BASE =
  process.env.NEXT_PUBLIC_SUBCATEGORIES_API_BASE_URL ??
  "http://localhost:5000/api/subcategories";

const PUBLICATIONS_API_BASE =
  process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
  "http://localhost:5000/api/publications";

const SERVICES_API_BASE =
  process.env.NEXT_PUBLIC_SERVICES_API_BASE_URL ??
  "http://localhost:5000/api/services";

type Tab = "offers" | "publish" | "likes" | "events" | "explore";
type PublishType = "product" | "service" | "exchange";
type NavRole = "admin" | "user";
type Role = NavRole | "entrepreneur";

interface Offer {
  id: number;
  title: string;
  description: string;
  image?: string;
  price?: number;
  isExchange?: boolean;
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
  condition?: string;
}

interface ServiceFormState {
  name: string;
  duration: string;
  category: string;
  description: string;
  priceTokens: string;
  image: File | null;
}

interface ExchangeFormState {
  name: string;
  weightKg: string;
  material: string;
  category: string;
  subcategory: string;
  quality: string;
  description: string;
  image: File | null;
}

interface EventFormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  eventType: string;
  cost: string;
  rewardId: string;
  image: File | null;
}

interface Product {
  cod_prod: number;
  nom_prod: string;
  desc_prod?: string;
  precio_prod?: number;
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
  userId: number;
  setModalTitle: (title: string) => void;
  setModalMessage: (msg: string) => void;
  setShowSuccessModal: (show: boolean) => void;
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
  userId,
  setModalTitle,
  setModalMessage,
  setShowSuccessModal,
}: PublishSectionProps) {
  return (
    <div className={styles.publishSection}>
      <div className={styles.publishTabs}>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "product" ? "publishTabActive" : ""}`}
          onClick={() => setPublishType("product")}
        >
          Producto
        </button>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "service" ? "publishTabActive" : ""}`}
          onClick={() => setPublishType("service")}
        >
          Servicio
        </button>
        <button
          type="button"
          className={`${styles.publishTab} ${publishType === "exchange" ? "publishTabActive" : ""}`}
          onClick={() => setPublishType("exchange")}
        >
          Intercambio
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
              <label className={styles.fieldLabel}>Nombre de Producto</label>
              <ProfileInput
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleProductChange}
                placeholder="Ej. Cámara Canon EOS"
                required
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
                  <option key={cat.cod_cat} value={cat.cod_cat}>
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
                  <option key={sub.cod_subcat_prod} value={sub.cod_subcat_prod}>
                    {sub.nom_subcat_prod}
                  </option>
                ))}
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
                onChange={handleProductChange}
                placeholder="Ej. 20"
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Estado</label>
              <select
                name="condition"
                value={productForm.condition}
                onChange={handleProductChange}
                className={styles.selectInput}
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Usado">Usado</option>
              </select>
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
                  Publicar
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
      ) : publishType === "service" ? (
        <ServiceRegistrationForm
          userId={userId}
          onSuccess={() => {
            setModalTitle("Â¡Servicio Registrado!");
            setModalMessage("Tu servicio ha sido registrado correctamente y ya está visible en el mercado.");
            setShowSuccessModal(true);
          }}
          onDuplicate={() => {
            setModalTitle("Â¡Servicio Ya Registrado!");
            setModalMessage("Este servicio ya se encuentra registrado en tu perfil.");
            setShowSuccessModal(true);
          }}
        />
      ) : (
        <ExchangeRegistrationForm
          userId={userId}
          onSuccess={() => {
            setModalTitle("Â¡Intercambio Registrado!");
            setModalMessage("Tu intercambio ha sido registrado correctamente.");
            setShowSuccessModal(true);
          }}
        />
      )}
    </div>
  );
}

export default function UserProfile({
  role: roleProp = "admin",
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>("offers");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Â¡Publicación Exitosa!");
  const [modalMessage, setModalMessage] = useState("Tu producto ha sido publicado correctamente y ya está visible en el mercado.");
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
  const [services, setServices] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerId, setViewerId] = useState<number | null>(null);
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

  // Estado para formulario de intercambio
  const [exchangeForm, setExchangeForm] = useState<ExchangeFormState>({
    name: "",
    weightKg: "",
    material: "",
    category: "",
    subcategory: "",
    quality: "",
    description: "",
    image: null,
  });

  // Estado para formulario de evento
  const [eventForm, setEventForm] = useState<EventFormState>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    eventType: "",
    cost: "",
    rewardId: "",
    image: null,
  });

  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [availableRewards, setAvailableRewards] = useState<Array<{ cod_rec: number, monto_rec: number }>>([]);

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
    const fetchViewerData = async () => {
      if (typeof window !== "undefined") {
        const handle = window.localStorage.getItem("currentUserHandle");
        if (handle) {
          try {
            const res = await fetch(
              `${USERS_API_BASE}/get_user_data?handle_name=${encodeURIComponent(handle)}`
            );
            const json = await res.json();
            if (res.ok && json.success && json.data) {
              const data = Array.isArray(json.data) ? json.data[0] : json.data;
              setViewerId(data.cod_us);
            }
          } catch (err) {
            console.error("Error fetching viewer data:", err);
          }
        }
      }
    };
    fetchViewerData();
  }, []);

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
        console.error("Error cargando subcategorías:", err);
      }
    };

    const fetchRewards = async () => {
      try {
        const response = await EventService.get_all_rewards();
        if (response.success && response.data) {
          setAvailableRewards(response.data);
        }
      } catch (error) {
        console.error("Error al cargar recompensas:", error);
      }
    };

    fetchCategoriesAndSubcats();
    fetchRewards();
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

    // Eliminar duplicados
    const uniqueFiltered = Array.from(
      new Map(filtered.map((item) => [item.cod_subcat_prod, item])).values()
    );

    setFilteredSubcategories(uniqueFiltered);
  }, [productForm.category, subcategories]);

  // Filtrar subcategorías para formulario de intercambio
  useEffect(() => {
    if (!exchangeForm.category) {
      setFilteredSubcategories([]);
      return;
    }
    const filtered = subcategories.filter(
      (sc) => sc.cod_cat === parseInt(exchangeForm.category)
    );
    setFilteredSubcategories(filtered);
  }, [exchangeForm.category, subcategories]);

  const fetchOffersForUser = async (codUs: number) => {
    try {
      const allOffers: Offer[] = [];

      const resPosts = await fetch(
        `${POSTS_API_BASE}/all_active_product_posts`
      );
      const jsonPosts = await resPosts.json().catch(() => ({} as any));

      if (resPosts.ok && jsonPosts.data && Array.isArray(jsonPosts.data)) {
        const mappedOffers: Offer[] = jsonPosts.data
          .filter((p: any) => p.cod_us === codUs)
          .map((p: any) => {
            let descriptionLines = [];

            // Descripción del producto
            const productDesc = p.desc_prod ?? "";
            if (productDesc) {
              descriptionLines.push(`📝 ${productDesc.length > 40 ? productDesc.slice(0, 40) + '...' : productDesc}`);
            }

            // Contenido de la publicación (si existe)
            const pubContent = p.contenido ?? "";
            if (pubContent) {
              descriptionLines.push(`📝 ${pubContent.length > 40 ? pubContent.slice(0, 40) + '...' : pubContent}`)
            }

            // Siempre mostrar impacto (usar valor del backend o 5 por defecto)
            const impacto = p.impacto_amb_pub ?? 5;
            descriptionLines.push(`🌱 Impacto: ${impacto} pts`);

            return {
              id: p.cod_pub ?? p.id ?? 0,
              title: p.nom_prod ?? p.title ?? "Sin título",
              description: descriptionLines.join('\n'),
              image: `${PUBLICATIONS_API_BASE}/${p.cod_pub ?? p.id ?? 0}/image`,
              price: p.precio_prod ?? 0,
            };
          });

        allOffers.push(...mappedOffers);
      }

      // Cargar productos del usuario para el formulario de intercambio
      const productsResponse = await ExchangeService.get_user_products(codUs);
      if (productsResponse.success && productsResponse.data) {
        const productPosts = Array.isArray(productsResponse.data)
          ? productsResponse.data.filter((post: any) => post.tipo_publicacion === 'producto')
          : [];

        const products = productPosts.map((post: any) => ({
          cod_prod: post.cod_prod,
          nom_prod: post.nombre_producto || post.nom_prod,
          desc_prod: post.descripcion,
          precio_prod: post.precio
        }));
        setUserProducts(products);
      }

      // Cargar intercambios del usuario
      const exchangesResponse = await ExchangeService.get_user_exchanges(codUs);
      if (exchangesResponse.success && exchangesResponse.data) {
        // Mapear intercambios a formato Offer para mostrarlos en la lista
        const exchangeOffers: Offer[] = exchangesResponse.data.map((ex: any, index: number) => {
          const isOpenOffer = ex.cod_us_1 === ex.cod_us_2;

          let descriptionLines = [];

          if (isOpenOffer) {
            descriptionLines.push('📝 Oferta abierta de intercambio');
          } else {
            descriptionLines.push(`📝 Con @${ex.cod_us_1 === codUs ? ex.usuario_destino_handle : ex.usuario_origen_handle}`);
          }

          descriptionLines.push(`🌱 Impacto: ${ex.impacto_amb_inter} pts`);

          const imageUrl = ex.tiene_foto ? `${API_BASE_URL}/exchanges/${ex.cod_inter}/image` : null;

          return {
            id: `exchange-${ex.cod_inter}`,
            title: isOpenOffer
              ? `Intercambio: ${ex.nombre_prod_origen} (Oferta)`
              : `Intercambio: ${ex.nombre_prod_origen} ⇄ ${ex.nombre_prod_destino}`,
            description: descriptionLines.join('\n'),
            image: imageUrl,
            price: 0,
            isExchange: true
          };
        });

        allOffers.push(...exchangeOffers);
      }

      // Cargar eventos del usuario
      const eventsResponse = await EventService.get_user_created_events(codUs);
      if (eventsResponse.success && eventsResponse.data) {
        // Mapear eventos a formato Offer para mostrarlos en la lista
        const eventOffers: Offer[] = eventsResponse.data.map((ev: any) => {
          const imageUrl = ev.tiene_banner ? `${API_BASE_URL}/events/${ev.cod_evento}/image` : null;

          // Construir descripción con líneas separadas
          let descriptionLines = [];

          if (ev.descripcion_evento) {
            descriptionLines.push(`📝 ${ev.descripcion_evento.length > 50 ? ev.descripcion_evento.slice(0, 50) + '...' : ev.descripcion_evento}`);
          }

          if (ev.fecha_inicio_evento && ev.fecha_finalizacion_evento) {
            descriptionLines.push(`📅 ${new Date(ev.fecha_inicio_evento).toLocaleDateString('es-ES', { timeZone: 'UTC' })} - ${new Date(ev.fecha_finalizacion_evento).toLocaleDateString('es-ES', { timeZone: 'UTC' })}`);
          }

          if (ev.monto_recompensa && ev.monto_recompensa > 0) {
            descriptionLines.push(`🎁 Recompensa: ${ev.monto_recompensa} CV`);
          }

          descriptionLines.push(`🌱 Impacto: 10 pts`);

          return {
            id: `event-${ev.cod_evento}`,
            title: `Evento: ${ev.titulo_evento}`,
            description: descriptionLines.join('\n'),
            image: imageUrl,
            price: ev.costo_inscripcion,
            isExchange: false
          };
        });

        allOffers.push(...eventOffers);
      }

      // Eliminar duplicados basados en ID (mantener el primero encontrado)
      const uniqueOffers = allOffers.filter((offer, index, self) =>
        index === self.findIndex((o) => o.id === offer.id)
      );

      // Establecer todas las ofertas de una sola vez
      setOffers(uniqueOffers);

    } catch (err) {
      console.error("Error al cargar publicaciones de productos:", err);
      setOffers([]);
    }
  };

  const fetchServicesForUser = async (codUs: number) => {
    try {
      console.log(`Fetching services for user: ${codUs}`);
      const resServices = await fetch(`${SERVICES_API_BASE}/user/${codUs}`);
      const jsonServices = await resServices.json().catch(() => ({} as any));
      console.log("Services response:", jsonServices);

      if (resServices.ok && jsonServices.data && Array.isArray(jsonServices.data)) {
        const mappedServices: Offer[] = jsonServices.data.map((s: any) => ({
          id: s.cod_serv ?? s.id ?? 0,
          title: s.nom_serv ?? "Sin título",
          description: s.descr_serv ?? "",
          image: s.foto_serv ? `data:image/jpeg;base64,${Buffer.from(s.foto_serv).toString('base64')}` : undefined,
          price: s.precio_serv ?? s.precio_serv_token ?? 0,
        }));
        console.log("Mapped services:", mappedServices);
        setServices(mappedServices);
      } else {
        console.warn("No services found or invalid response format");
        setServices([]);
      }
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      setServices([]);
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
          await fetchServicesForUser(userData.cod_us);
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

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${SERVICES_API_BASE}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cod_cat: parseInt(serviceForm.category),
          nom_serv: serviceForm.name,
          desc_serv: serviceForm.description,
          precio_serv: parseInt(serviceForm.priceTokens),
          duracion_serv: serviceForm.duration,
          cod_us: user?.cod_us,
          hrs_ini_dia_serv: "08:00",
          hrs_fin_dia_serv: "18:00",
          dif_dist_serv: 0
        })
      });

      const json = await response.json();

      if (response.status === 409) {
        // Servicio duplicado
        setModalTitle("Â¡Servicio Ya Registrado!");
        setModalMessage("Este servicio ya se encuentra registrado en tu perfil.");
        setShowSuccessModal(true);
      } else if (response.ok) {
        // Ã‰xito
        setModalTitle("Â¡Servicio Registrado!");
        setModalMessage("Tu servicio ha sido registrado correctamente y ya está visible en el mercado.");
        setShowSuccessModal(true);

        // Recargar servicios
        if (user?.cod_us) {
          await fetchServicesForUser(user.cod_us);
        }

        // Limpiar formulario
        setServiceForm({
          name: "",
          duration: "",
          category: "",
          description: "",
          priceTokens: "",
          image: null,
        });
      } else {
        alert(`Error: ${json.message || "No se pudo registrar el servicio"}`);
      }
    } catch (err: any) {
      console.error("Error al registrar servicio:", err);
      alert("Error al registrar servicio");
    }
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

  // Handlers para formulario de intercambio
  const handleExchangeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setExchangeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitExchange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.cod_us) {
      setError("No se encontró el código de usuario");
      return;
    }

    if (!exchangeForm.name || !exchangeForm.category) {
      setError("Nombre y categoría son obligatorios");
      return;
    }

    try {
      setError(null);

      const formData = new FormData();
      formData.append("cod_us_1", user.cod_us.toString());

      // Datos del producto a crear
      formData.append("nom_prod", exchangeForm.name);
      formData.append("peso_prod", exchangeForm.weightKg || "0");
      formData.append("marca_prod", exchangeForm.material || "");
      formData.append("cod_subcat_prod", exchangeForm.subcategory || exchangeForm.category); // Fallback a categoría si no hay sub
      formData.append("calidad_prod", exchangeForm.quality || "nuevo");
      formData.append("desc_prod", exchangeForm.description || "");

      // La cantidad y unidad se asumen por defecto o se añaden si el backend lo requiere
      // Para intercambio, asumimos 1 unidad del producto creado
      formData.append("cant_prod_origen", "1");
      formData.append("unidad_medida_origen", "unidades");

      if (exchangeForm.image) {
        formData.append("foto_inter", exchangeForm.image);
      }

      const response = await ExchangeService.create_exchange(formData);

      if (response.success) {
        alert("¡Oferta de intercambio publicada exitosamente!");
        handleCancelExchange();
        setShowSuccessModal(true);
        // Recargar ofertas para mostrar el nuevo intercambio
        if (user.cod_us) {
          await fetchOffersForUser(user.cod_us);
        }
      } else {
        throw new Error(response.message || "Error al crear el intercambio");
      }
    } catch (err: any) {
      console.error("Error al crear intercambio:", err);
      setError(err?.message || "Error al crear el intercambio");
    }
  };

  const handleCancelExchange = () => {
    setExchangeForm({
      name: "",
      weightKg: "",
      material: "",
      category: "",
      subcategory: "",
      quality: "",
      description: "",
      image: null,
    });
  };

  // Handlers para formulario de eventos
  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Si se cambia el tipo de evento a "benefico", resetear el costo a 0
    if (name === 'eventType' && value === 'benefico') {
      setEventForm(prev => ({
        ...prev,
        [name]: value,
        cost: "0" // Changed to string "0" to match the type of eventForm.cost
      }));
    } else {
      setEventForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.cod_us) {
      setError("No se encontró el código de usuario");
      return;
    }

    if (!eventForm.title || !eventForm.description || !eventForm.startDate || !eventForm.endDate || !eventForm.eventType) {
      setError("Título, descripción, fechas y tipo de evento son obligatorios");
      return;
    }

    // Validar que la fecha de inicio sea anterior a la fecha de finalización
    if (new Date(eventForm.startDate) >= new Date(eventForm.endDate)) {
      setError("La fecha de finalización debe ser posterior a la fecha de inicio");
      return;
    }

    try {
      setError(null);

      const formData = new FormData();
      formData.append("titulo_evento", eventForm.title);
      formData.append("descripcion_evento", eventForm.description);
      formData.append("fecha_inicio_evento", eventForm.startDate);
      formData.append("fecha_finalizacion_evento", eventForm.endDate);
      formData.append("tipo_evento", eventForm.eventType);
      formData.append("costo_inscripcion", eventForm.cost || "0");

      if (eventForm.rewardId) {
        formData.append("cod_rec", eventForm.rewardId);
      }

      if (eventForm.image) {
        formData.append("banner_evento", eventForm.image);
      }

      // Agregar cod_us a la URL como query parameter
      const response = await fetch(`${API_BASE_URL}/events/create?cod_us=${user.cod_us}`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert("¡Evento creado exitosamente!");
        handleCancelEvent();
        setShowSuccessModal(true);
        // Recargar ofertas para mostrar el nuevo evento
        if (user.cod_us) {
          await fetchOffersForUser(user.cod_us);
        }
      } else {
        throw new Error(result.message || "Error al crear el evento");
      }
    } catch (err: any) {
      console.error("Error al crear evento:", err);
      setError(err?.message || "Error al crear el evento");
    }
  };

  const handleCancelEvent = () => {
    setEventForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      eventType: "",
      cost: "",
      rewardId: "",
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
            className={`${styles.tab} ${activeTab === "offers" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            Ofertas Propias
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "publish" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("publish")}
          >
            Publicar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "likes" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("likes")}
          >
            Me gusta
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "events" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("events")}
          >
            Eventos
          </button>
          <button
            type="button"
            className={`${styles.tab} ${activeTab === "explore" ? "tabActive" : ""
              }`}
            onClick={() => setActiveTab("explore")}
          >
            Explorar
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
          <OffersSection offers={offers} services={services} />
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
            userId={user?.cod_us ?? 0}
            setModalTitle={setModalTitle}
            setModalMessage={setModalMessage}
            setShowSuccessModal={setShowSuccessModal}
          />
        )}

        {!loading && !error && activeTab === "likes" && (
          <LikesSection userId={user?.cod_us ?? 0} />


        )}

        {!loading && !error && activeTab === "events" && (
          <EventsSection userId={viewerId ?? 0} />
        )}

        {!loading && !error && activeTab === "explore" && (
          <ExploreSection currentUserId={viewerId ?? 0} />
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
  services: Offer[];
}

function OffersSection({ offers, services }: OffersSectionProps) {
  const hasProducts = offers.length > 0;
  const hasServices = services.length > 0;

  if (!hasProducts && !hasServices) {
    return (
      <div className={styles.placeholderTab}>
        <p>Este usuario aún no tiene ofertas publicadas.</p>
      </div>
    );
  }

  return (
    <div className={styles.offersSection}>
      {/* Sección de Productos */}
      {hasProducts && (
        <>
          <h3 className={styles.subsectionTitle}>Productos</h3>
          <div className={styles.offersGrid}>
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
                {offer.price !== undefined && (
                  <div className={styles.offerPrice}>
                    <span>{offer.price} tokens</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      {/* Sección de Servicios */}
      {hasServices && (
        <>
          <h3 className={styles.subsectionTitle}>Servicios</h3>
          <div className={styles.offersGrid}>
            {services.map((service) => (
              <article key={service.id} className={styles.offerCard}>
                <div className={styles.offerImage}>
                  {service.image && (
                    <img
                      src={service.image}
                      alt={service.title}
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
                  <h2 className={styles.offerTitle}>{service.title}</h2>
                  <p className={styles.offerDescription}>{service.description}</p>
                </div>
                {service.price !== undefined && (
                  <div className={styles.offerPrice}>
                    <span>{service.price} tokens</span>
                  </div>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
