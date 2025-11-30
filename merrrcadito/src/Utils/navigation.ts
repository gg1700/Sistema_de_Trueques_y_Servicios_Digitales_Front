export const navItems = {
  common: [
    { name: 'Dashboard', route: '/Home' },
    { name: 'Ranking CO2', route: '/RankingCO2' },
    { name: 'Mi Perfil', route: '/perfil' },
    { name: 'Rankig Emprendedores', route: '/RankingSells' },
    { name: 'Intercambios', route: '/intercambios' },
    { name: 'Eventos', route: '/eventos' },
    { name: 'Tienda', route: '/tokens' },
    { name: 'Explorar Mas', route: '/Explorar' }
  ],
  admin: [
    { name: 'Gestión de Categorias', route: '/admin/GestionDeSecciones/GestionDeCategorias' },
    { name: 'Gestión de Subcategorias', route: '/admin/GestionDeSecciones/GestionDeSubcategorias' },
    { name: 'Gestión de la Tienda', route: '/admin/usuarios' },
    { name: 'Reportes', route: '/admin/Reportes' },
    { name: 'Gestión de Tokens', route: '/admin/GestionTokens/NewTokenPackage' },
  ]
};

export const getNavItems = (role: 'admin' | 'user') => {
  if (role === 'admin') {
    return [...navItems.common, ...navItems.admin];
  }
  return navItems.common;
};

