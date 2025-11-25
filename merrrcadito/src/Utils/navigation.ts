export const navItems = {
  common: [
    { name: 'Dashboard', route: '/Home' },
    { name: 'Ranking CO2', route: '/RankingCO2' },
    { name: 'Mi Perfil', route: '/perfil' },
<<<<<<< HEAD
    { name: 'Rankig Emprendedores', route: '/RankingSells'},
    { name: 'Tienda', route: '/tokens'}
=======
    { name: 'Rankig Emprendedores', route: '/RankingSells' },
    { name: 'Tienda', route: '/tokens' }
>>>>>>> origin/test/reportes
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
  ]
};

export const getNavItems = (role: 'admin' | 'user') => {
  return [...navItems.common, ...navItems[role]];
};
