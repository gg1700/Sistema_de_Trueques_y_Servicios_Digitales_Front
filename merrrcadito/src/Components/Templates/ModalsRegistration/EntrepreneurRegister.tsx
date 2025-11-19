"use client";

import React, {
  useState,
  useId,
  FormEvent,
  ChangeEvent,
} from "react";
import styles from "./EntrepreneurRegister.module.css";
import Label from "@/Components/Atoms/Label/Label";

const MOCK_USERNAMES: string[] = ["angelica", "demo", "admin"];

type PopupType = "error" | "success";

interface EntrepreneurForm {
  freeHours: string;
  busyHours: string;
  username: string;
  password: string;
}

interface PopupState {
  type: PopupType;
  message: string;
}

type EntrepreneurErrors = Partial<Record<keyof EntrepreneurForm, string>>;

interface Props {
  onBack?: () => void;
}

async function isUsernameTaken(username: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 300));
  return MOCK_USERNAMES.includes(username.toLowerCase());
}

const EntrepreneurRegister: React.FC<Props> = ({ onBack }) => {
  const [form, setForm] = useState<EntrepreneurForm>({
    freeHours: "",
    busyHours: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<EntrepreneurErrors>({});
  const [popup, setPopup] = useState<PopupState | null>(null);

  const freeHoursId = useId();
  const busyHoursId = useId();
  const usernameId = useId();
  const passwordId = useId();

  const set =
    (k: keyof EntrepreneurForm) =>
    (v: string): void =>
      setForm((prev) => ({ ...prev, [k]: v }));

  const handleChange =
    (key: keyof EntrepreneurForm) =>
    (e: ChangeEvent<HTMLInputElement>): void =>
      set(key)(e.target.value);

  const validate = (): boolean => {
    const errs: EntrepreneurErrors = {};

    if (!form.freeHours.trim())
      errs.freeHours = "Las horas libres son obligatorias.";

    if (!form.busyHours.trim())
      errs.busyHours = "Las horas ocupadas son obligatorias.";

    if (!form.username.trim())
      errs.username = "El nombre de usuario es obligatorio.";

    if (!form.password || form.password.length < 6)
      errs.password = "La contraseña debe tener al menos 6 caracteres.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validate()) return;

    const taken = await isUsernameTaken(form.username);
    if (taken) {
      setPopup({
        type: "error",
        message:
          "El nombre de usuario ya está ocupado, por favor elige otro.",
      });
      return;
    }

    // Aquí registrarías al emprendedor en tu backend
    setPopup({
      type: "success",
      message: "Usuario registrado con éxito.",
    });
  };

  const inputClass = (error?: string) =>
    error ? `${styles.inputBase} ${styles.inputError}` : styles.inputBase;

  return (
    <div className={styles.screen}>
      <form className={styles.sheet} onSubmit={handleSubmit}>
        <div className={styles.headerRow}>
          {onBack && (
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onBack}
              aria-label="Cerrar"
            >
              ×
            </button>
          )}
          <h1 className={styles.title}>Registro Emprendedor</h1>
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <Label htmlFor={freeHoursId}>Horas libres</Label>
            <input
              id={freeHoursId}
              className={inputClass(errors.freeHours)}
              value={form.freeHours}
              onChange={handleChange("freeHours")}
              placeholder="Ej: 08:00-12:00"
            />
            {errors.freeHours && (
              <span className={styles.errorText}>{errors.freeHours}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label htmlFor={busyHoursId}>Horas ocupadas</Label>
            <input
              id={busyHoursId}
              className={inputClass(errors.busyHours)}
              value={form.busyHours}
              onChange={handleChange("busyHours")}
              placeholder="Ej: 14:00-18:00"
            />
            {errors.busyHours && (
              <span className={styles.errorText}>{errors.busyHours}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label htmlFor={usernameId}>Nombre de usuario / handlename</Label>
            <input
              id={usernameId}
              className={inputClass(errors.username)}
              value={form.username}
              onChange={handleChange("username")}
            />
            {errors.username && (
              <span className={styles.errorText}>{errors.username}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label htmlFor={passwordId}>Contraseña</Label>
            <input
              id={passwordId}
              type="password"
              className={inputClass(errors.password)}
              value={form.password}
              onChange={handleChange("password")}
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnConfirm}>
            Registrar
          </button>
        </div>
      </form>

      {popup && (
        <div
          className={styles.popupScreen}
          onClick={() => setPopup(null)}
        >
          <div
            className={styles.popupCard}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className={
                popup.type === "error"
                  ? styles.popupTextError
                  : styles.popupTextSuccess
              }
            >
              {popup.message}
            </p>
            <button
              className={styles.popupBtn}
              onClick={() => setPopup(null)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurRegister;
