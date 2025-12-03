import styles from './Footer.module.css';

interface FooterProps {
    year?: string | number;
}

export default function Footer({ year = new Date().getFullYear() }: FooterProps) {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                {/* Columna 1: Acerca de */}
                <div className={styles.footerColumn}>
                    <h3 className={styles.footerTitle}>MERRRCADITO</h3>
                    <p className={styles.footerText}>
                        Plataforma de intercambio sostenible y comercio colaborativo.
                        Conectando personas, promoviendo el consumo responsable.
                    </p>
                    <div className={styles.socialIcons}>
                        <a href="#" className={styles.socialIcon} aria-label="Facebook">
                            <i className="bi bi-facebook"></i>
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Instagram">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="Twitter">
                            <i className="bi bi-twitter"></i>
                        </a>
                        <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                            <i className="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>

                {/* Columna 2: Enlaces Rápidos */}
                <div className={styles.footerColumn}>
                    <h4 className={styles.footerSubtitle}>Enlaces Rápidos</h4>
                    <ul className={styles.footerList}>
                        <li><a href="/Home" className={styles.footerLink}>Inicio</a></li>
                        <li><a href="/Explorar" className={styles.footerLink}>Explorar</a></li>
                        <li><a href="/intercambios" className={styles.footerLink}>Intercambios</a></li>
                        <li><a href="/eventos" className={styles.footerLink}>Eventos</a></li>
                        <li><a href="/promociones" className={styles.footerLink}>Promociones</a></li>
                    </ul>
                </div>

                {/* Columna 3: Soporte */}
                <div className={styles.footerColumn}>
                    <h4 className={styles.footerSubtitle}>Soporte</h4>
                    <ul className={styles.footerList}>
                        <li><a href="#" className={styles.footerLink}>Centro de Ayuda</a></li>
                        <li><a href="#" className={styles.footerLink}>Términos y Condiciones</a></li>
                        <li><a href="#" className={styles.footerLink}>Política de Privacidad</a></li>
                        <li><a href="#" className={styles.footerLink}>Preguntas Frecuentes</a></li>
                    </ul>
                </div>

                {/* Columna 4: Contacto */}
                <div className={styles.footerColumn}>
                    <h4 className={styles.footerSubtitle}>Contacto</h4>
                    <ul className={styles.footerList}>
                        <li className={styles.contactItem}>
                            <i className="bi bi-envelope"></i>
                            <span>contacto@merrrcadito.com</span>
                        </li>
                        <li className={styles.contactItem}>
                            <i className="bi bi-telephone"></i>
                            <span>+591 123 456 789</span>
                        </li>
                        <li className={styles.contactItem}>
                            <i className="bi bi-geo-alt"></i>
                            <span>La Paz, Bolivia</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Línea divisoria */}
            <div className={styles.footerDivider}></div>

            {/* Copyright */}
            <div className={styles.footerBottom}>
                <small>© {year} MERRRCADITO. Todos los derechos reservados.</small>
                <small className={styles.footerCredit}>
                    Hecho con <i className="bi bi-heart-fill" style={{ color: '#e74c3c' }}></i> para un mundo más sostenible
                </small>
            </div>
        </footer>
    );
}
