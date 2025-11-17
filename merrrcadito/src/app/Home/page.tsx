import { ListPublicationProd } from "@/Components/Organisms";
import { AdminLayout } from "@/Components/Templates";

export default function Home(){
    const mockPub = [
  {
    cod_pub: 1,
    nombre_publicacion: "iPhone 13 Pro Max 256GB",
    nombre_categoria: "Electrónicos",
    nombre_subcat: "Smartphones",
    precio_pub: 4500,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 4.8,
    calidad: "Excelente",
    estado_pub: "activo" as const,
    descripcion: "iPhone 13 Pro Max en excelente estado, incluye cargador y caja original.",
    fecha_ini_pub: "2024-01-15",
    contacto_correo: "vendedor1@example.com",
    contacto_numero: 70123456,
    handlename: "@techseller",
    cantidad: 5,
    marca: "Apple"
  },
  {
    cod_pub: 2,
    nombre_publicacion: "MacBook Pro M2 2023",
    nombre_categoria: "Electrónicos",
    nombre_subcat: "Laptops",
    precio_pub: 8500,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 5.0,
    calidad: "Nuevo",
    estado_pub: "activo" as const,
    descripcion: "MacBook Pro nueva, sellada, garantía de 1 año.",
    fecha_ini_pub: "2024-01-20",
    contacto_correo: "vendedor2@example.com",
    contacto_numero: 70234567,
    handlename: "@macdealer",
    cantidad: 2,
    marca: "Apple"
  },
  {
    cod_pub: 3,
    nombre_publicacion: "PlayStation 5 Digital Edition",
    nombre_categoria: "Gaming",
    nombre_subcat: "Consolas",
    precio_pub: 3200,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 4.9,
    calidad: "Nuevo",
    estado_pub: "activo" as const,
    descripcion: "PS5 nueva en caja, incluye 2 juegos digitales.",
    fecha_ini_pub: "2024-01-25",
    contacto_correo: "gamer@example.com",
    contacto_numero: 70345678,
    handlename: "@gamingstore",
    cantidad: 3,
    marca: "Sony"
  },
  {
    cod_pub: 4,
    nombre_publicacion: "AirPods Pro 2da Gen",
    nombre_categoria: "Electrónicos",
    nombre_subcat: "Audio",
    precio_pub: 850,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 4.7,
    calidad: "Excelente",
    estado_pub: "activo" as const,
    descripcion: "AirPods Pro segunda generación, con cancelación de ruido.",
    fecha_ini_pub: "2024-02-01",
    contacto_correo: "audio@example.com",
    contacto_numero: 70456789,
    handlename: "@audiotech",
    cantidad: 10,
    marca: "Apple"
  },
  {
    cod_pub: 5,
    nombre_publicacion: "Samsung Galaxy S23 Ultra",
    nombre_categoria: "Electrónicos",
    nombre_subcat: "Smartphones",
    precio_pub: 3800,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 4.6,
    calidad: "Muy bueno",
    estado_pub: "activo" as const,
    descripcion: "Galaxy S23 Ultra en muy buen estado, incluye S Pen.",
    fecha_ini_pub: "2024-02-05",
    contacto_correo: "samsung@example.com",
    contacto_numero: 70567890,
    handlename: "@galaxystore",
    cantidad: 4,
    marca: "Samsung"
  },
  {
    cod_pub: 6,
    nombre_publicacion: "Nintendo Switch OLED",
    nombre_categoria: "Gaming",
    nombre_subcat: "Consolas",
    precio_pub: 2100,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 4.8,
    calidad: "Nuevo",
    estado_pub: "activo" as const,
    descripcion: "Nintendo Switch OLED nueva, incluye Mario Kart 8.",
    fecha_ini_pub: "2024-02-10",
    contacto_correo: "nintendo@example.com",
    contacto_numero: 70678901,
    handlename: "@switchstore",
    cantidad: 6,
    marca: "Nintendo"
  },
  {
    cod_pub: 7,
    nombre_publicacion: "Bicicleta Montañera Trek",
    nombre_categoria: "Deportes",
    nombre_subcat: "Ciclismo",
    precio_pub: 2800,
    foto_pub: "/pruebaImagen.png",
    calif_pond_pub: 4.5,
    calidad: "Muy bueno",
    estado_pub: "activo" as const,
    descripcion: "Bicicleta de montaña Trek, 21 velocidades, como nueva.",
    fecha_ini_pub: "2024-02-12",
    contacto_correo: "bikes@example.com",
    contacto_numero: 70789012,
    handlename: "@bikestore",
    cantidad: 3,
    marca: "Trek"
  }
];
    return (
    <AdminLayout 
        pageTitle="Hoy por mi"
        pageSubtitle="Mañana por mi"
    >
        <div style={{ padding: '0 20px' }}>  
            <ListPublicationProd title='Productos' pubProd={mockPub}/>
        </div>
    </AdminLayout>
    );
}