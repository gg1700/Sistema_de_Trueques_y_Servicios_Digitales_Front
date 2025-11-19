export const navItems = {
  common: [
    { name: 'Dashboard', route: '/admin/Home' },
    { name: 'Ranking CO2', route: '/admin/RankingCO2' },
    { name: 'Mi Perfil', route: '/perfil' },
    { name: 'Rankig Emprendedores', route: '/admin/RankingCO2/RankingSells'}
  ],
  admin: [
    { name: 'Gestión de Categorias', route: '/admin/GestionDeSecciones/GestionDeCategorias' },
    { name: 'Gestión de Subcategorias', route: '/admin/GestionDeSecciones/GestionDeSubcategorias' },
    { name: 'Gestión de la Tienda', route: '/admin/usuarios' },
    { name: 'Reportes', route: '/admin/Reportes' },
    { name: 'Gestión de Tokens', route: '/admin/GestionTokens/NewTokenPackage' },
  ],
  user: [
    { name: 'Ver mi C02', route: '/mi-tienda' },
    { name: 'Mis Compras', route: '/pedidos' },
    { name: 'Tokens', route: '/tokens' },
  ]
};

export const getNavItems = (role: 'admin' | 'user') => {
  return [...navItems.common, ...navItems[role]];
};
