// Ejemplo de cómo integrar NotificationBell en tu Navbar existente
// Copia este código y adáptalo a tu navbar actual

"use client";

import { useState } from 'react';
import Link from 'next/link';
import NotificationBell from '@/Components/Molecules/NotificationBell/NotificationBell';
import NotificationDropdown from '@/Components/Molecules/NotificationDropdown/NotificationDropdown';

export default function NavbarWithNotifications() {
    const [showNotifications, setShowNotifications] = useState(false);

    // Obtén el userId de tu sistema de autenticación
    // Ajusta esto según tu implementación
    const userId = typeof window !== 'undefined'
        ? parseInt(localStorage.getItem('userId') || '0')
        : 0;

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {/* Logo y links del navbar */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link href="/">Logo</Link>
                <Link href="/productos">Productos</Link>
                <Link href="/servicios">Servicios</Link>
                <Link href="/intercambios">Intercambios</Link>
                <Link href="/eventos">Eventos</Link>
            </div>

            {/* Sección derecha con notificaciones */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {/* Otros elementos del navbar (perfil, etc.) */}

                {/* Campana de notificaciones */}
                <div style={{ position: 'relative' }}>
                    <NotificationBell
                        userId={userId}
                        onClick={() => setShowNotifications(!showNotifications)}
                    />
                    <NotificationDropdown
                        userId={userId}
                        isOpen={showNotifications}
                        onClose={() => setShowNotifications(false)}
                    />
                </div>
            </div>
        </nav>
    );
}

/* 
INSTRUCCIONES DE INTEGRACIÓN:

1. Encuentra tu componente de Navbar actual
2. Importa NotificationBell y NotificationDropdown
3. Agrega el estado: const [showNotifications, setShowNotifications] = useState(false);
4. Obtén el userId de tu sistema de autenticación
5. Agrega el bloque de código de la campana donde quieras que aparezca
6. Asegúrate de que el contenedor tenga position: relative

EJEMPLO MÍNIMO:
```tsx
import { useState } from 'react';
import NotificationBell from '@/Components/Molecules/NotificationBell/NotificationBell';
import NotificationDropdown from '@/Components/Molecules/NotificationDropdown/NotificationDropdown';

function YourNavbar() {
    const [showNotifications, setShowNotifications] = useState(false);
    const userId = getCurrentUserId(); // Tu función para obtener userId

    return (
        <nav>
            {/* ... otros elementos ... *}
            
            <div style={{ position: 'relative' }}>
                <NotificationBell 
                    userId={userId} 
                    onClick={() => setShowNotifications(!showNotifications)}
                />
                <NotificationDropdown
                    userId={userId}
                    isOpen={showNotifications}
                    onClose={() => setShowNotifications(false)}
                />
            </div>
        </nav>
    );
}
```
*/
