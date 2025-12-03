export interface NavItem {
  name: string;
  route: string;
  icon?: string;
}

export const navItems: {
  common: NavItem[];
  admin: NavItem[];
} = {
  common: [
    { name: 'Dashboard', route: '/Home', icon: 'dashboard' },
    { name: 'Ranking CO2', route: '/RankingCO2', icon: 'ranking' },
    { name: 'Mi Perfil', route: '/perfil', icon: 'profile' },
    { name: 'Ranking Emprendedores', route: '/RankingSells', icon: 'ranking' },
    { name: 'Intercambios', route: '/intercambios', icon: 'exchanges' },
    { name: 'Eventos', route: '/eventos', icon: 'events' },
    { name: 'Explorar Mas', route: '/Explorar', icon: 'explore' },
    { name: 'Promociones', route: '/promociones', icon: 'promotions' },
    { name: 'Tienda de Tokens', route: '/tokens', icon: 'stores' }
  ],
  admin: [
    { name: 'Gestión de Categorias', route: '/admin/GestionDeSecciones/GestionDeCategorias', icon: 'categories' },
    { name: 'Gestión de Subcategorias', route: '/admin/GestionDeSecciones/GestionDeSubcategorias', icon: 'subcategories' },
    { name: 'Reportes', route: '/admin/Reportes', icon: 'reports' },
  ]
};

export const getNavItems = (role: 'admin' | 'user'): NavItem[] => {
  if (role === 'admin') {
    return [...navItems.common, ...navItems.admin];
  }
  return navItems.common;
};
