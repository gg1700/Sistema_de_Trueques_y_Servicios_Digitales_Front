import Publication from "@/Components/Organisms/Publication/Publication";

export default function paginaPrincipal(){
  const publicacionProducto = {
        clase: 'Producto' as const,
        pub: {
            cod_pub: 1,
            nombre_publicacion: "iPhone 13 Pro Max 256GB",
            nombre_seccion: "Teléfonos",
            precio_pub: 2500,
            calidad: "Excelente",
            foto_pub: '/pruebaImagen.png',
            calif_pond_pub: 4.8,
            estado_pub: 'activo' as const,
            handlename: "tecnologia123"
        },
        pubP: {
            descripcion: "iPhone 13 Pro Max en excelente estado, 256GB de almacenamiento, batería al 95%",
            fecha_ini_pub: "2025-01-05",
            contacto_correo: "vendedor@email.com",
            contacto_numero: 51987654321,
            handlename: "tecnologia123",
            cantidad: 3,
            marca: "Apple"
        },
        pubS: {} as any // Placeholder para servicio
    };

    // Datos hardcodeados para SERVICIO
    const publicacionServicio = {
        clase: 'Servicio' as const,
        pub: {
            cod_pub: 2,
            nombre_publicacion: "Clases de Programación Web",
            nombre_seccion: "Educación",
            precio_pub: 80,
            foto_pub: '/pruebaImagen.png',
            calif_pond_pub: 4.9,
            estado_pub: 'activo' as const,
            handlename: "profe_js"
        },
        pubS: {
            descripcion: "Clases personalizadas de HTML, CSS, JavaScript y React",
            fecha_ini_pub: "2025-01-10",
            contacto_correo: "profesor@email.com",
            contacto_numero: 51912345678,
            handlename: "profe_js",
            hrs_ini_serv: "09:00",
            hrs_fin_serv: "18:00",
            duracion: 2
        },
        pubP: {} as any // Placeholder para producto
    };
  return(
    <div>
            {/* Publicación de Producto */}
            <Publication
                clase={publicacionProducto.clase}
                pub={publicacionProducto.pub}
                pubP={publicacionProducto.pubP}
                pubS={publicacionProducto.pubS}
            />

            {/* Publicación de Servicio */}
            <Publication
                clase={publicacionServicio.clase}
                pub={publicacionServicio.pub}
                pubP={publicacionServicio.pubP}
                pubS={publicacionServicio.pubS}
            />
        </div>
  );
}