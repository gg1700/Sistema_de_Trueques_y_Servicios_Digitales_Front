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
  appName = "MERRRCADITO",
  year = new Date().getFullYear(),
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.screen} aria-label="Login">
      <div className={styles.center}>
        <img
          src="/images/logo_merrrcadito_login.png"
          alt={appName}
          className={styles.loginLogo}
        />

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
