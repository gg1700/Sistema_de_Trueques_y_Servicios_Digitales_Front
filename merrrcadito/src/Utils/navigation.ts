export const navItems = {
  common: [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Productos', route: '/productos' },
    { name: 'Mi Perfil', route: '/perfil' },
  ],
  admin: [
    { name: 'Gestión de Categorias', route: '/admin/GestionDeSecciones/GestionDeCategorias' },
    { name: 'Gestión de Subcategorias', route: '/admin/GestionDeSecciones/GestionDeSubcategorias' },
    { name: 'Gestión de la Tienda', route: '/admin/usuarios' },
    { name: 'Reportes', route: '/admin/reportes' },
  ],
  user: [
    { name: 'Ver mi C02', route: '/mi-tienda' },
    { name: 'Mis Compras', route: '/pedidos' },
  ]
};

export const getNavItems = (role: 'admin' | 'user') => {
  return [...navItems.common, ...navItems[role]];
};