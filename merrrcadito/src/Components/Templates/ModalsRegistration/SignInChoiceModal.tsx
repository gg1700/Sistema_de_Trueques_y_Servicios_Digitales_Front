"use client";

import styles from "./SignInChoiceModal.module.css";

interface Props {
  open: boolean;
  onOrganization: () => void;
  onUser: () => void;
  onClose?: () => void;
}

export default function SignInChoiceModal({
  open,
  onOrganization,
  onUser,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.screen} onClick={onClose}>
      <section
        className={styles.center}
        onClick={(e) => e.stopPropagation()}
        aria-label="Sign In Choice"
      >
        <p className={styles.text}>
          Indentifícate con alguna opción para crear tu
          <br /> nueva cuenta
        </p>

        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onOrganization}
          >
            Organización
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.btnSuccess}`}
            onClick={onUser}
          >
            Emprendedor / Usuario
          </button>
        </div>
      </section>
    </div>
  );
}
