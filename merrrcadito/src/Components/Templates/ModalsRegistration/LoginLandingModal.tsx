"use client";

import styles from "./LoginLandingModal.module.css";

interface Props {
  open: boolean;
  onSignIn: () => void;
  onLogIn: () => void;
  onClose?: () => void;
  appName?: string;
  year?: string | number;
}

export default function LoginLandingModal({
  open,
  onSignIn,
  onLogIn,
  appName = "Pixer",
  year = new Date().getFullYear(),
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.screen} aria-label="Login">
      <div className={styles.center}>
        <div className={styles.logoRow}>

          <svg
            className={styles.logoSvg}
            viewBox="0 0 64 64"
            aria-hidden
            role="img"
          >
            <defs>
              <linearGradient id="g-top" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#36E2B7" />
                <stop offset="100%" stopColor="#0FA37C" />
              </linearGradient>
              <linearGradient id="g-fold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#45E1B9" />
                <stop offset="100%" stopColor="#16B088" />
              </linearGradient>
              <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity=".18" />
              </filter>
            </defs>
   
            <path
              d="M30 4c2.2 0 3.6 2.3 2.7 4.3L27 20h10.7c2.2 0 3.6 2.3 2.7 4.3l-9.2 19.2c-.7 1.5-2.8 1.7-3.8.4-1.1-1.4-2.1-2.6-3-3.7-1.3-1.6-2.3-2.9-3.3-4.2-.8-1.1-1.4-2.1-.5-4.1L23.7 24H16c-2.6 0-3.8-3.2-1.9-5.1L27.7 4.9A4 4 0 0 1 30 4Z"
              fill="url(#g-top)"
              filter="url(#s)"
            />
   
            <path
              d="M35.5 29.8c3.1 3.5 7.8 9 11.2 12.9 1.4 1.6.7 4.1-1.3 4.7-4.8 1.5-11.6 4.1-15.8 5.6-1.9.7-3.7-.9-3.5-2.9l.9-9.7c.1-1.1.6-2.1 1.3-2.9l7.2-7.7Z"
              fill="url(#g-fold)"
              filter="url(#s)"
            />
          </svg>

          <h1 className={styles.brand}>{appName}</h1>
        </div>

        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onSignIn}
          >
            Sign In
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnSuccess}`}
            onClick={onLogIn}
          >
            Log In
          </button>
        </div>
      </div>

      <footer className={styles.footer}>
        <small>© All rights reserved | {year}</small>
      </footer>
    </div>
  );
}
