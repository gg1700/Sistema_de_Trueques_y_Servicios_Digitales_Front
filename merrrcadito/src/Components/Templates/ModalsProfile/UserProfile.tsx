"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import styles from "./UserProfile.module.css";

import FileInput from "@/Components/Templates/ModalsProfile/FileInput";
import ProfileInput from "@/Components/Atoms/Input/ProfileInput/ProfileInput";
import LikesSection from "./LikesSection";
import EventsSection from "./EventsSection";
import ExploreSection from "./ExploreSection";
import ServiceRegistrationForm from "./ServiceRegistrationForm";

import { getNavItems } from "../../../Utils/navigation";
import SideBar from "@/Components/Organisms/SideBar/SideBar";
import { ReportService, EventService } from "@/services";
import { ExchangeService } from "@/services/exchangeService";

const USERS_API_BASE =
  process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
  "http://127.0.0.1:5000/api/users";

const PRODUCTS_API_BASE =
  process.env.NEXT_PUBLIC_PRODUCTS_API_BASE_URL ??
  "http://127.0.0.1:5000/api/products";

const POSTS_API_BASE =
  process.env.NEXT_PUBLIC_POSTS_API_BASE_URL ??
  "http://127.0.0.1:5000/api/posts";

const CATEGORIES_API_BASE =
  process.env.NEXT_PUBLIC_CATEGORIES_API_BASE_URL ??
  "http://127.0.0.1:5000/api/categories";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000/api";

const SUBCATEGORIES_API_BASE =
  process.env.NEXT_PUBLIC_SUBCATEGORIES_API_BASE_URL ??
  "http://127.0.0.1:5000/api/subcategories";

const PUBLICATIONS_API_BASE =
  process.env.NEXT_PUBLIC_PUBLICATIONS_API_BASE_URL ??
  "http://127.0.0.1:5000/api/publications";

const SERVICES_API_BASE =
  process.env.NEXT_PUBLIC_SERVICES_API_BASE_URL ??
  "http://127.0.0.1:5000/api/services";

const EVENTS_API_BASE =
  process.env.NEXT_PUBLIC_EVENTS_API_BASE_URL ??
  "http://127.0.0.1:5000/api/events";

const EXCHANGES_API_BASE =
  process.env.NEXT_PUBLIC_EXCHANGES_API_BASE_URL ??
  "http://127.0.0.1:5000/api/exchanges";

type Tab = "offers" | "publish" | "likes" | "events" | "explore";
type PublishType = "product" | "service" | "exchange" | "event";
type NavRole = "admin" | "user";
type Role = NavRole | "entrepreneur";

interface Offer {
  id: number;
  title: string;
  description: string;
  image?: string;
  price?: number;
  isExchange?: boolean;
  type: 'product' | 'service' | 'event' | 'exchange';
  impact?: number;
  date?: string;
  reward?: number;
  status?: string;
}

interface ProductFormState {
  name: string;
  peso_prod: string;           // Peso del producto en kg (para cálculo físico)
  cantidad: string;            // Cantidad de unidades en la publicación
  unidad_medida: string;       // "kg", "unidades", "litros", etc.
  material: string;            // cod_mat del material (para CO2)
  marca: string;               // Marca del producto (opcional)
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

interface Material {
  cod_mat: number;
  nom_mat: string;
  descr_mat?: string;
  factor_co2: number;
  unidad_medida_co2: string;
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
  // Campos de organización (opcionales para reutilizar la interfaz)
  cod_org?: number;
  nom_com_org?: string;
  nom_leg_org?: string;
  tipo_org?: string;
  rubro_org?: string;
  cif?: string;
  correo_org?: string;
  telf_org?: string;
  dir_org?: string;
  sitio_web?: string;
  logo_org?: string;
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
  // cod_rol: 1 = usuario_comun, 2 = emprendedor, 3 = administrador
  if (codRol === 3) return "admin";
  if (codRol === 2) return "entrepreneur";
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
  materials: Material[];  // NEW: Materials for CO2 calculation
  userId: number;
  setModalTitle: (title: string) => void;
  setModalMessage: (msg: string) => void;
  setShowSuccessModal: (show: boolean) => void;
  exchangeForm: ExchangeFormState;
  handleExchangeChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmitExchange: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCancelExchange: () => void;
  onChangeExchangeImage: (file: File | null) => void;
  eventForm: EventFormState;
  handleEventChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitEvent: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCancelEvent: () => void;
  onChangeEventImage: (file: File | null) => void;
  userProducts: Product[];
  availableRewards: Array<{ cod_rec: number, monto_rec: number }>;
  userRole: Role; // NEW: User role to determine event visibility
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
  materials,  // ADDED: Materials for dropdown
  userId,
  setModalTitle,
  setModalMessage,
  setShowSuccessModal,
  exchangeForm,
  handleExchangeChange,
  handleSubmitExchange,
  handleCancelExchange,
  onChangeExchangeImage,
  eventForm,
  handleEventChange,
  handleSubmitEvent,
  handleCancelEvent,
  onChangeEventImage,
  userProducts,
  availableRewards,
  userRole,
}: PublishSectionProps) {
  // 🔹 Lógica para diferenciar opciones según tipo de cuenta
  const [accountType, setAccountType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const type = localStorage.getItem("accountType");
      setAccountType(type);

      // Si es organización, forzar la pestaña de eventos
      if (type === "organization" && publishType !== "event") {
        setPublishType("event");
      }
    }
  }, [publishType, setPublishType]);

  const isOrg = accountType === "organization";
  const isRegularUser = userRole === "user"; // Usuario común (cod_rol = 1)
  const canCreateEvents = isOrg || userRole === "entrepreneur"; // ⚠️ Admin NO puede crear eventos (por ahora)

  return (
    <div className={styles.publishSection}>
      <div className={styles.publishTabs}>
        {!isOrg && (
          <>
            <button
              type="button"
              className={`${styles.publishTab} ${publishType === "product" ? styles.publishTabActive : ""}`}
              onClick={() => setPublishType("product")}
            >
              Producto
            </button>
            <button
              type="button"
              className={`${styles.publishTab} ${publishType === "service" ? styles.publishTabActive : ""}`}
              onClick={() => setPublishType("service")}
            >
              Servicio
            </button>
            <button
              type="button"
              className={`${styles.publishTab} ${publishType === "exchange" ? styles.publishTabActive : ""}`}
              onClick={() => setPublishType("exchange")}
            >
              Intercambio
            </button>
          </>
        )}
        {canCreateEvents && (
          <button
            type="button"
            className={`${styles.publishTab} ${publishType === "event" ? styles.publishTabActive : ""}`}
            onClick={() => setPublishType("event")}
          >
            Evento
          </button>
        )}
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
              <label className={styles.fieldLabel}>Material (Opcional)</label>
              <select
                name="material"
                value={productForm.material}
                onChange={handleProductChange}
                className={styles.selectInput}
                required // Made required again
              >
                <option value="">Seleccione un material</option>
                {materials.map((mat) => (
                  <option key={mat.cod_mat} value={mat.cod_mat}>
                    {mat.nom_mat}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Marca (Opcional)</label>
              <ProfileInput
                type="text"
                name="marca"
                value={productForm.marca}
                onChange={handleProductChange}
                placeholder="Ej. Canon, Sony, etc."
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Peso (kg) *</label>
              <ProfileInput
                type="number"
                step="0.01"
                name="peso_prod"
                value={productForm.peso_prod}
                onChange={handleProductChange}
                placeholder="Ej. 2.5"
                required
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Cantidad *</label>
              <ProfileInput
                type="number"
                name="cantidad"
                value={productForm.cantidad}
                onChange={handleProductChange}
                placeholder="Ej. 10"
                required
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Unidad *</label>
              <select
                name="unidad_medida"
                value={productForm.unidad_medida}
                onChange={handleProductChange}
                className={styles.selectInput}
                required
              >
                <option value="unidades">Unidades</option>
                <option value="kg">Kilogramos</option>
                <option value="litros">Litros</option>
                <option value="metros">Metros</option>
                <option value="cajas">Cajas</option>
              </select>
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
                  Publicar Producto
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : publishType === "service" ? (
        <ServiceRegistrationForm
          userId={userId}
          onSuccess={() => {
            setModalTitle("¡Servicio Registrado!");
            setModalMessage("Tu servicio ha sido registrado correctamente y ya está visible en el mercado.");
            setShowSuccessModal(true);
          }}
          onDuplicate={() => {
            setModalTitle("¡Servicio Ya Registrado!");
            setModalMessage("Este servicio ya se encuentra registrado en tu perfil.");
            setShowSuccessModal(true);
          }}
        />
      ) : publishType === "exchange" ? (
        <form
          onSubmit={handleSubmitExchange}
          className={styles.publishForm}
          noValidate
        >
          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Nombre del Producto</label>
              <ProfileInput
                type="text"
                name="name"
                value={exchangeForm.name}
                onChange={handleExchangeChange as any}
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
                value={exchangeForm.weightKg}
                onChange={handleExchangeChange as any}
                placeholder="Ej. 0.5"
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Marca / Material</label>
              <ProfileInput
                type="text"
                name="material"
                value={exchangeForm.material}
                onChange={handleExchangeChange as any}
                placeholder="Ej. COCA"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Categoría</label>
              <select
                name="category"
                value={exchangeForm.category}
                onChange={handleExchangeChange}
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
                value={exchangeForm.subcategory}
                onChange={handleExchangeChange}
                className={styles.selectInput}
                disabled={!exchangeForm.category}
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
                value={exchangeForm.quality}
                onChange={handleExchangeChange}
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
                value={exchangeForm.description}
                onChange={handleExchangeChange}
                className={styles.textarea}
                placeholder="Describe tu producto..."
              />
            </div>
          </div>

          <div className={styles.formRowBottom}>
            <div className={styles.formColImage}>
              <label className={styles.fieldLabel}>
                Imagen (cuadrada, máx. 100KB)
              </label>
              <FileInput name="exchangeImage" onChange={onChangeExchangeImage} />
            </div>

            <div className={styles.formColButtons}>
              <div className={styles.actionsRowInline}>
                <button type="submit" className={styles.submitButton}>
                  Publicar Intercambio
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitEvent}
          className={styles.publishForm}
          noValidate
        >
          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Título del Evento</label>
              <ProfileInput
                type="text"
                name="title"
                value={eventForm.title}
                onChange={handleEventChange as any}
                placeholder="Ej. Festival de Reciclaje 2025"
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Fecha de Inicio</label>
              <ProfileInput
                type="date"
                name="startDate"
                value={eventForm.startDate}
                onChange={handleEventChange as any}
                required
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Fecha de Finalización</label>
              <ProfileInput
                type="date"
                name="endDate"
                value={eventForm.endDate}
                onChange={handleEventChange as any}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Tipo de Evento</label>
              <select
                name="eventType"
                value={eventForm.eventType}
                onChange={handleEventChange}
                className={styles.selectInput}
                required
              >
                <option value="">Seleccionar</option>
                <option value="benefico">Benéfico</option>
                <option value="monetizable">Monetizable</option>
              </select>
            </div>
            <div className={styles.formCol}>
              <label className={styles.fieldLabel}>Costo de Inscripción (Tokens)</label>
              <input
                type="number"
                name="cost"
                value={eventForm.cost}
                onChange={handleEventChange}
                className={styles.profileInput}
                placeholder="Ej. 10"
                min="0"
                disabled={eventForm.eventType === 'benefico'}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formColFull}>
              <label className={styles.fieldLabel}>Recompensa (Créditos Verdes CV)</label>
              <select
                name="rewardId"
                value={eventForm.rewardId}
                onChange={handleEventChange}
                className={styles.selectInput}
              >
                <option value="">Sin recompensa</option>
                {availableRewards.map((reward: { cod_rec: number, monto_rec: number }) => (
                  <option key={reward.cod_rec} value={reward.cod_rec}>
                    {reward.monto_rec} CV
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
                value={eventForm.description}
                onChange={handleEventChange}
                className={styles.textarea}
                placeholder="Describe tu evento..."
              />
            </div>
          </div>

          <div className={styles.formRowBottom}>
            <div className={styles.formColImage}>
              <label className={styles.fieldLabel}>
                Banner del Evento (cuadrada, máx. 100KB)
              </label>
              <FileInput name="eventImage" onChange={onChangeEventImage} />
            </div>

            <div className={styles.formColButtons}>
              <div className={styles.actionsRowInline}>
                <button type="submit" className={styles.submitButton}>
                  Crear Evento
                </button>
              </div>
            </div>
          </div>
        </form>
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
    peso_prod: "",
    cantidad: "1",
    unidad_medida: "unidades",
    material: "",
    marca: "",
    category: "",
    subcategory: "",
    quality: "nuevo",
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


  const [user, setUser] = useState<UserApi | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [services, setServices] = useState<Offer[]>([]);
  const [events, setEvents] = useState<Offer[]>([]);
  const [exchanges, setExchanges] = useState<Offer[]>([]);
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
  const [materials, setMaterials] = useState<Material[]>([]);

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
  const router = useRouter();
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

        // Fetch materials for CO2 calculation
        try {
          const resMat = await fetch(`${API_BASE_URL}/materials`);
          const jsonMat = await resMat.json().catch(() => ({} as any));
          if (resMat.ok && jsonMat.success && jsonMat.materials && Array.isArray(jsonMat.materials)) {
            setMaterials(jsonMat.materials);
          } else if (resMat.ok && jsonMat.data && Array.isArray(jsonMat.data)) {
            setMaterials(jsonMat.data);
          }
        } catch (matError) {
          console.warn("Materials endpoint not available yet:", matError);
          setMaterials([]);
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
      const allEvents: Offer[] = [];
      const allExchanges: Offer[] = [];

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
              type: 'product' as const,
              impact: impacto,
              status: p.estado_prod ?? 'active',
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
          // Si cod_us_1 es null, es una oferta abierta (sin propuesta aún)
          const isOpenOffer = ex.cod_us_1 === null;

          let descriptionLines = [];

          if (isOpenOffer) {
            descriptionLines.push('📝 Oferta abierta de intercambio');
          } else {
            // Mostrar el usuario que propuso (cod_us_1)
            descriptionLines.push(`📝 Con @${ex.handle_name_1 || 'usuario'}`);
          }

          descriptionLines.push(`🌱 Impacto: ${ex.impacto_amb_inter} pts`);

          const imageUrl = ex.tiene_foto ? `${API_BASE_URL}/exchanges/${ex.cod_inter}/image` : null;

          return {
            id: ex.cod_inter,
            title: isOpenOffer
              ? `Intercambio: ${ex.nombre_prod_destino || 'Producto'} (Oferta)`
              : `Intercambio: ${ex.nombre_prod_destino || 'Producto'} ⇄ ${ex.nombre_prod_origen || 'Propuesta'}`,
            description: descriptionLines.join('\n'),
            image: imageUrl,
            price: 0,
            isExchange: true,
            type: 'exchange' as const,
            impact: ex.impacto_amb_inter ?? 5,
            status: ex.estado_inter ?? 'active',
          };
        });

        allExchanges.push(...exchangeOffers);
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

          const impact = ev.impacto_amb_inter || 0;
          if (impact > 0) {
            descriptionLines.push(`🌱 Impacto: ${impact} pts`);
          }

          return {
            id: ev.cod_evento,
            title: `Evento: ${ev.titulo_evento}`,
            description: descriptionLines.join('\n'),
            image: imageUrl,
            price: ev.costo_inscripcion,
            isExchange: false,
            type: 'event' as const,
            impact: impact,
            date: ev.fecha_inicio_evento,
            reward: ev.monto_recompensa,
            status: ev.estado_evento ?? 'active',
          };
        });

        allEvents.push(...eventOffers);
      }

      // Establecer todas las ofertas por separado
      setOffers(allOffers);
      setEvents(allEvents);
      setExchanges(allExchanges);

    } catch (err) {
      console.error("Error al cargar publicaciones de productos:", err);
      setOffers([]);
      setEvents([]);
      setExchanges([]);
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
          type: 'service' as const,
          impact: 5,
          status: 'active',
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

  const ORG_API_BASE =
    process.env.NEXT_PUBLIC_ORG_API_BASE_URL ??
    "http://127.0.0.1:5000/api/organization";

  // ... (existing code)

  useEffect(() => {
    // Verificar si es organización
    const accountType = typeof window !== "undefined" ? localStorage.getItem("accountType") : null;
    const orgId = typeof window !== "undefined" ? localStorage.getItem("orgId") : null;

    if (accountType === "organization" && orgId) {
      const fetchOrgData = async () => {
        try {
          setLoading(true);
          setError(null);

          const resOrg = await fetch(`${ORG_API_BASE}/${orgId}`);
          const jsonOrg = await resOrg.json();

          if (!resOrg.ok || !jsonOrg.success || !jsonOrg.data) {
            throw new Error(jsonOrg.message || "No se pudieron cargar los datos de la organización.");
          }

          const rawData = jsonOrg.data;
          const orgData = Array.isArray(rawData) ? rawData[0] : rawData;

          // Mapear datos de organización a estructura de usuario para compatibilidad
          const mappedUser: UserApi = {
            cod_us: orgData.cod_org,
            cod_rol: 2, // Asumimos rol de emprendedor/organización
            handle_name: orgData.nom_com_org.replace(/\s+/g, '').toLowerCase(),
            nom_us: orgData.nom_com_org,
            ap_pat_us: orgData.nom_leg_org,
            correo_us: orgData.correo_org,
            telefono_us: orgData.telf_org,
            ci_us: orgData.cif, // Opcional: enmascarar si es sensible
            fecha_registro: orgData.fecha_registro_org,
            // Campos extra de organización
            cod_org: orgData.cod_org,
            nom_com_org: orgData.nom_com_org,
            nom_leg_org: orgData.nom_leg_org,
            tipo_org: orgData.tipo_org,
            rubro_org: orgData.rubro_org,
            cif: orgData.cif,
            correo_org: orgData.correo_org,
            telf_org: orgData.telf_org,
            dir_org: orgData.dir_org,
            sitio_web: orgData.sitio_web,
          };

          setUser(mappedUser);

          // Cargar eventos de la organización (si aplica)
          // await fetchOffersForUser(orgData.cod_org); 

        } catch (err: any) {
          console.error(err);
          setError(err?.message ?? "Ocurrió un error al cargar los datos de la organización.");
        } finally {
          setLoading(false);
        }
      };

      fetchOrgData();
      return;
    }

    if (!resolvedHandle) {
      // Solo mostrar error si NO es organización (ya manejado arriba) y no hay handle
      if (accountType !== "organization") {
        setError("No se encontró información de sesión del usuario.");
        setLoading(false);
      }
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
        productForm.peso_prod.trim() === ""
          ? 0
          : Number(productForm.peso_prod);

      const precioNumber =
        productForm.priceTokens.trim() === ""
          ? 0
          : Number(productForm.priceTokens);

      const cantidadNumber =
        productForm.cantidad.trim() === ""
          ? 1
          : Number(productForm.cantidad);

      const productPayload: any = {
        nom_prod:
          productForm.name && productForm.name.trim() !== ""
            ? productForm.name
            : "Producto sin nombre",
        peso_prod: isNaN(pesoNumber) ? 0 : pesoNumber,  // Peso real del producto
        calidad_prod:
          (productForm.quality as "nuevo" | "usado") || "nuevo",
        estado_prod: "disponible",
        precio_prod: isNaN(precioNumber) ? 0 : precioNumber,
        marca_prod:
          productForm.marca && productForm.marca.trim() !== ""
            ? productForm.marca
            : null,  // Marca real, no material
        desc_prod:
          productForm.description &&
            productForm.description.trim() !== ""
            ? productForm.description
            : null,
        cod_mat: productForm.material ? Number(productForm.material) : null, // CRITICAL for CO2 calculation
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
      // Usar cantidad y unidad_medida correctos
      formData.append(
        "cant_prod",
        cantidadNumber.toString()
      );
      formData.append("unidad_medida", productForm.unidad_medida);

      // Agregar cod_mat para vincular material (CO2 calculation)
      formData.append("cod_mat", productForm.material);

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
      peso_prod: "",
      cantidad: "1",
      unidad_medida: "unidades",
      material: "",
      marca: "",
      category: "",
      subcategory: "",
      quality: "nuevo",
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

      let url = `${API_BASE_URL}/events/create`;

      // Si es organización, enviar cod_org en el body
      if (user.cod_org) {
        formData.append("cod_org", user.cod_org.toString());
      } else {
        // Si es usuario, enviar cod_us en la URL
        url += `?cod_us=${user.cod_us}`;
      }

      const response = await fetch(url, {
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
    (user.nom_com_org
      ? user.nom_com_org
      : `${user.nom_us} ${user.ap_pat_us} ${user.ap_mat_us ?? ""}`.trim());

  const roleLabel =
    user?.nom_com_org
      ? "Organización"
      : effectiveRole === "admin"
        ? "Administrador"
        : effectiveRole === "entrepreneur"
          ? "Emprendedor"
          : "Usuario Común";

  const avatarUrl =
    user && user.cod_us
      ? user.nom_com_org
        ? `${ORG_API_BASE}/${user.cod_us}/image`
        : `${USERS_API_BASE}/${user.cod_us}/image`
      : null;

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
                <h3 className={styles.infoSectionTitle}>
                  {user?.nom_com_org ? "Información de la Organización:" : "Información Personal:"}
                </h3>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <i className="bi bi-card-text" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>
                        {user?.nom_com_org ? "CIF:" : "Cédula de Identidad:"}
                      </span>
                      <span className={styles.infoValue}>
                        {user?.nom_com_org ? user.cif : (user?.ci_us ?? "—")}
                      </span>
                    </div>
                  </div>

                  {!user?.nom_com_org && (
                    <>
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
                    </>
                  )}

                  {user?.nom_com_org && (
                    <>
                      <div className={styles.infoItem}>
                        <i className="bi bi-building" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Razón Social:</span>
                          <span className={styles.infoValue}>{user.nom_leg_org ?? "—"}</span>
                        </div>
                      </div>
                      <div className={styles.infoItem}>
                        <i className="bi bi-briefcase" style={{ fontSize: '20px', color: '#1fb7a1' }}></i>
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Rubro:</span>
                          <span className={styles.infoValue}>{user.rubro_org ?? "—"}</span>
                        </div>
                      </div>
                    </>
                  )}

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
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Cargando información del perfil...</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.placeholderTab}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && activeTab === "offers" && (
          <OffersSection offers={offers} services={services} events={events} exchanges={exchanges} />
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
            exchangeForm={exchangeForm}
            handleExchangeChange={handleExchangeChange}
            handleSubmitExchange={handleSubmitExchange}
            handleCancelExchange={handleCancelExchange}
            onChangeExchangeImage={(file) =>
              setExchangeForm((prev) => ({ ...prev, image: file }))
            }
            eventForm={eventForm}
            handleEventChange={handleEventChange}
            handleSubmitEvent={handleSubmitEvent}
            handleCancelEvent={handleCancelEvent}
            onChangeEventImage={(file) =>
              setEventForm((prev) => ({ ...prev, image: file }))
            }
            userProducts={userProducts}
            categories={categories}
            filteredSubcategories={filteredSubcategories}
            materials={materials}
            availableRewards={availableRewards}
            userId={user?.cod_us ?? 0}
            setModalTitle={setModalTitle}
            setModalMessage={setModalMessage}
            setShowSuccessModal={setShowSuccessModal}
            userRole={effectiveRole}
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
  events: Offer[];
  exchanges: Offer[];
}

function OffersSection({ offers, services, events, exchanges }: OffersSectionProps) {
  const hasProducts = offers.length > 0;
  const hasServices = services.length > 0;
  const hasEvents = events.length > 0;
  const hasExchanges = exchanges.length > 0;

  if (!hasProducts && !hasServices && !hasEvents && !hasExchanges) {
    return (
      <div className={styles.placeholderTab}>
        <p>Este usuario aún no tiene ofertas publicadas.</p>
      </div>
    );
  }

  const renderSection = (title: string, items: Offer[]) => {
    if (items.length === 0) return null;
    return (
      <div className={styles.sectionContainer} style={{ marginBottom: '32px' }}>
        <h3 className={styles.sectionTitle} style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '16px',
          paddingLeft: '8px',
          borderLeft: '4px solid #1fb7a1'
        }}>
          {title}
        </h3>
        <div className={styles.offersSection}>
          {items.map((offer, index) => (
            <article key={`${offer.type}-${offer.id}-${index}`} className={styles.offerCard}>
              <div className={styles.offerImage}>
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "12px",
                    color: "#ccc",
                    fontSize: "40px"
                  }}>
                    {offer.type === 'event' ? <i className="bi bi-calendar-event"></i> :
                      offer.type === 'exchange' ? <i className="bi bi-arrow-left-right"></i> :
                        offer.type === 'service' ? <i className="bi bi-tools"></i> :
                          <i className="bi bi-box-seam"></i>}
                  </div>
                )}
                {offer.status && offer.status !== 'active' && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {offer.status}
                  </div>
                )}
              </div>
              <div className={styles.offerInfo}>
                <h2 className={styles.offerTitle}>{offer.title}</h2>
                <div className={styles.offerDescription} style={{ whiteSpace: 'pre-line' }}>
                  {offer.description}
                </div>
              </div>
              <div className={styles.offerActions}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  {!offer.isExchange && offer.price !== undefined && (
                    <>
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
                          {offer.price}
                        </span>
                        <span style={{
                          fontSize: '13px',
                          color: '#6b7785',
                          fontWeight: '500'
                        }}>
                          Tokens
                        </span>
                      </div>
                    </>
                  )}
                  <div style={{ flex: 1 }}></div>
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
      </div>
    );
  };

  return (
    <div className={styles.offersContainer}>
      {renderSection("Productos", offers)}
      {renderSection("Servicios", services)}
      {renderSection("Intercambios", exchanges)}
      {renderSection("Eventos", events)}
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
  exchangeForm: ExchangeFormState;
  handleExchangeChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitExchange: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCancelExchange: () => void;
  onChangeExchangeImage: (file: File | null) => void;
  eventForm: EventFormState;
  handleEventChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmitEvent: (e: React.FormEvent<HTMLFormElement>) => void;
  handleCancelEvent: () => void;
  onChangeEventImage: (file: File | null) => void;
  userProducts: Product[];
  categories: Category[];
  filteredSubcategories: Subcategory[];
  availableRewards: Array<{ cod_rec: number, monto_rec: number }>;
}

