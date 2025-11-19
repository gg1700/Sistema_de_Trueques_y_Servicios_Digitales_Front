'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './UserProfile.module.css';

import FileInput from '@/Components/Templates/ModalsProfile/FileInput';
import ProfileInput from '@/Components/Atoms/Input/ProfileInput/ProfileInput';
import { getNavItems } from '../../../Utils/navigation';

type Tab = 'offers' | 'publish' | 'likes' | 'events';
type PublishType = 'product' | 'service';
type Role = 'admin' | 'user';

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

const fakeOffers: Offer[] = [
  {
    id: 1,
    title: 'Cámara Vintage Canon AE-1',
    description:
      'Cámara analógica clásica en perfecto estado de conservación. Incluye lente de 50mm f/1.8 y funda de cuero original. Ideal para estudiantes de fotografía o coleccionistas.',
  },
  {
    id: 2,
    title: 'Mantenimiento y Reparación de PC',
    description:
      'Servicio técnico profesional para laptops y computadoras de escritorio. Incluye limpieza de hardware, optimización de sistema operativo, eliminación de virus e instalación de programas.',
  },
  {
    id: 3,
    title: 'Bicicleta de Montaña Trek Marlin',
    description:
      'Bicicleta talla M con poco uso. Cuenta con frenos de disco hidráulicos, suspensión delantera y transmisión Shimano de 21 velocidades. Lista para rodar.',
  },
];

interface UserProfileProps {
  role?: Role;
}

export default function UserProfile({ role = 'admin' }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('offers');
  const [publishType, setPublishType] = useState<PublishType>('product');

  const [productForm, setProductForm] = useState<ProductFormState>({
    name: '',
    weightKg: '',
    material: '',
    category: '',
    subcategory: '',
    quality: '',
    description: '',
    priceTokens: '',
    image: null,
  });

  const [serviceForm, setServiceForm] = useState<ServiceFormState>({
    name: '',
    duration: '',
    category: '',
    description: '',
    priceTokens: '',
    image: null,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const navList = getNavItems(role); // con role='admin' por defecto

  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Producto a publicar:', productForm);
  };

  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Servicio a publicar:', serviceForm);
  };

  const handleCancelProduct = () => {
    setProductForm({
      name: '',
      weightKg: '',
      material: '',
      category: '',
      subcategory: '',
      quality: '',
      description: '',
      priceTokens: '',
      image: null,
    });
  };

  const handleCancelService = () => {
    setServiceForm({
      name: '',
      duration: '',
      category: '',
      description: '',
      priceTokens: '',
      image: null,
    });
  };

  return (
    <section className={styles.profilePage}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarCircle}>
              <span className={styles.avatarEmoji}>😊</span>
            </div>
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
          <h1 className={styles.userName}>ZEBNELL</h1>

          <div className={styles.userInfoGrid}>
            <p className={styles.userInfoText}>Usuario Común</p>
            <p className={styles.userInfoText}>Leonel Zeballos Aldunate</p>
            <p className={styles.userInfoText}>68599945</p>
            <p className={styles.userInfoText}>uwu@gmail.com</p>
          </div>
        </div>

        <nav className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab === 'offers' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('offers')}
          >
            Ofertas Propias
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab === 'publish' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('publish')}
          >
            Publicar
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab === 'likes' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('likes')}
          >
            Me gusta
          </button>
          <button
            type="button"
            className={`${styles.tab} ${
              activeTab === 'events' ? styles.tabActive : ''
            }`}
            onClick={() => setActiveTab('events')}
          >
            Eventos
          </button>
        </nav>
      </header>

      <div className={styles.tabContent}>
        {activeTab === 'offers' && <OffersSection offers={fakeOffers} />}

        {activeTab === 'publish' && (
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

        {activeTab === 'likes' && (
          <div className={styles.placeholderTab}>
            <p>No hay me gustas</p>
          </div>
        )}

        {activeTab === 'events' && (
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
                    className={`${styles.sideMenuLink} ${
                      isActive ? styles.sideMenuLinkActive : ''
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
  return (
    <div className={styles.offersSection}>
      {offers.map((offer) => (
        <article key={offer.id} className={styles.offerCard}>
          <div className={styles.offerImage} />
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
    >,
  ) => void;
  handleServiceChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
          className={`${styles.publishTab} ${
            publishType === 'product' ? styles.publishTabActive : ''
          }`}
          onClick={() => setPublishType('product')}
        >
          Producto
        </button>
        <button
          type="button"
          className={`${styles.publishTab} ${
            publishType === 'service' ? styles.publishTabActive : ''
          }`}
          onClick={() => setPublishType('service')}
        >
          Servicio
        </button>
      </div>

      {publishType === 'product' ? (
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
              <FileInput
                name="productImage"
                onChange={onChangeProductImage}
              />
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
              <FileInput
                name="serviceImage"
                onChange={onChangeServiceImage}
              />
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
