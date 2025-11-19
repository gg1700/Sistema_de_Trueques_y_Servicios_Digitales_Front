export interface Billetera {
  cod_bill: number;
  cod_us: number;
  saldo_actual: number; // La moneda virtual (Tokens)
}

export interface TokenPackage {
  id: string;
  nombre: string;
  tokens: number;
  precioReal: number;
}

export interface Promocion {
  cod_prom: number;
  titulo_prom: string;
  descr_prom: string;
  descuento_prom: number;
  fecha_fin_prom: string;
  banner_url: string; // Usamos URL para el mock
}

export interface Potenciador {
  cod_potenciador: number;
  nombre_potenciador: string;
  descripcion_potenciador: string;
  precio_tokens: number; // El precio en tu moneda virtual
}


// --- DATOS MOCKEADOS "EN MEMORIA" ---

// 1. La billetera del usuario (EL ESTADO QUE CAMBIARÁ)
// La exportamos con 'let' para poder modificarla desde otros archivos
export let mockBilletera: Billetera = {
  cod_bill: 1,
  cod_us: 1,
  saldo_actual: 50, // El usuario empieza con 50 Tokens
};

// 2. Paquetes de Tokens (para comprar con dinero real)
export const mockTokenPackages: TokenPackage[] = [
  { id: 'pkg_1', nombre: 'Paquete 1', tokens: 100, precioReal: 10 },
  { id: 'pkg_2', nombre: 'Paquete 2', tokens: 220, precioReal: 20 },
  { id: 'pkg_3', nombre: 'Paquete 3', tokens: 500, precioReal: 45 },
  { id: 'pkg_4', nombre: 'Paquete 4', tokens: 1100, precioReal: 90 },
];

// 3. Potenciadores (para comprar con Tokens)
export const mockPotenciadores: Potenciador[] = [
  {
    cod_potenciador: 101,
    nombre_potenciador: 'Publicación Destacada (1 día)',
    descripcion_potenciador: 'Tu publicación aparecerá en la página principal.',
    precio_tokens: 75,
  },
  {
    cod_potenciador: 102,
    nombre_potenciador: 'Impulso de Visibilidad (3 días)',
    descripcion_potenciador: 'Multiplica x2 las vistas de tu perfil.',
    precio_tokens: 150,
  },
  {
    cod_potenciador: 103,
    nombre_potenciador: 'Marco de Perfil Épico',
    descripcion_potenciador: 'Un marco dorado para tu foto de perfil.',
    precio_tokens: 300,
  },
];

// 4. Promociones (descuentos, etc.)
export const mockPromociones: Promocion[] = [
  {
    cod_prom: 201,
    titulo_prom: '¡50% en Servicios!',
    descr_prom: 'Todos los servicios de la categoría "Hogar" a mitad de precio.',
    descuento_prom: 50,
    fecha_fin_prom: '2025-12-31',
    banner_url: 'https://via.placeholder.com/400x200/00a99d/ffffff?text=Promo+Hogar',
  },
  {
    cod_prom: 202,
    titulo_prom: 'Fin de Semana de Trueques',
    descr_prom: 'Intercambia productos sin comisión de plataforma.',
    descuento_prom: 100, // 100% de descuento en comisión
    fecha_fin_prom: '2025-11-20',
    banner_url: 'https://via.placeholder.com/400x200/ff6347/ffffff?text=Promo+Trueques',
  },
];