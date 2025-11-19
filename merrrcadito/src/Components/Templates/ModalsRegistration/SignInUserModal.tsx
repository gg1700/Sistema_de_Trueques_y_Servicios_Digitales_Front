"use client";

import React, {
  useId,
  useRef,
  useState,
  FormEvent,
  MouseEvent,
  ChangeEvent,
} from "react";
import styles from "./SignInUserModal.module.css";

import ButtonCancel from "@/Components/Atoms/Buttons/ButtonCancel/ButtonCancel";
import Label from "@/Components/Atoms/Label/Label";
import ButtonIcon from "@/Components/Atoms/Buttons/ButtonIcon/ButtonIcon";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/users";

type Sex = "M" | "F" | "";

interface SignInForm {
  ci: string;
  firstName: string;
  lastNameFather: string;
  lastNameMother: string;
  birth: string;
  sex: Sex;
  email: string;
  phone: string;
}

interface CredentialForm {
  username: string;
  password: string;
}

type PopupType = "error" | "success";

interface PopupState {
  type: PopupType;
  message: string;
}

type CredentialMode = "user" | "admin" | null;

type SignInErrors = Partial<Record<keyof SignInForm, string>>;
type CredentialErrors = Partial<Record<keyof CredentialForm, string>>;

interface Props {
  open: boolean;
  onCancel?: () => void;
  /**
   * Se llama opcionalmente cuando el registro en el backend fue exitoso.
   * Puedes usarlo para redirigir, cerrar modales, etc.
   */
  onConfirm?: (data: SignInForm & { photo?: File | null }) => void | Promise<void>;
  onGoEntrepreneur?: () => void;
}

const SignInUserModal: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  onGoEntrepreneur,
}) => {
  const ciId = useId();
  const nId = useId();
  const apId = useId();
  const amId = useId();
  const fnId = useId();
  const sxId = useId();
  const emId = useId();
  const phId = useId();

  const credUserId = useId();
  const credPwId = useId();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<SignInForm>({
    ci: "",
    firstName: "",
    lastNameFather: "",
    lastNameMother: "",
    birth: "",
    sex: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<SignInErrors>({});

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoName, setPhotoName] = useState<string>("vacío");

  const [showCredModal, setShowCredModal] = useState<boolean>(false);
  const [credMode, setCredMode] = useState<CredentialMode>(null);
  const [credentials, setCredentials] = useState<CredentialForm>({
    username: "",
    password: "",
  });
  const [credErrors, setCredErrors] = useState<CredentialErrors>({});

  const [popup, setPopup] = useState<PopupState | null>(null);

  if (!open) return null;

  const set =
    (k: keyof SignInForm) =>
    (v: string): void =>
      setForm((prev) => ({ ...prev, [k]: v }));

  const validateMainForm = (): boolean => {
    const errors: SignInErrors = {};

    if (!form.ci.trim()) errors.ci = "El CI es obligatorio.";
    if (!form.firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!form.lastNameFather.trim())
      errors.lastNameFather = "El apellido paterno es obligatorio.";
    if (!form.lastNameMother.trim())
      errors.lastNameMother = "El apellido materno es obligatorio.";
    if (!form.birth) errors.birth = "La fecha de nacimiento es obligatoria.";
    if (!form.sex) errors.sex = "Selecciona el sexo.";
    if (!form.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "El correo no es válido.";
    }
    if (!form.phone.trim()) errors.phone = "El teléfono es obligatorio.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateMainForm()) return;

    // Registro como usuario normal por defecto
    setCredMode("user");
    setShowCredModal(true);
  };

  const handleAdminClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const isValid = validateMainForm();
    if (!isValid) return;
    setCredMode("admin");
    setShowCredModal(true);
  };

  const handleEntrepreneurClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    const isValid = validateMainForm();
    if (!isValid) return;
    onGoEntrepreneur?.();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0] ?? null;
    setPhotoFile(f);
    setPhotoName(f ? f.name : "vacío");
  };

  const validateCredentials = (): boolean => {
    const errors: CredentialErrors = {};

    if (!credentials.username.trim()) {
      errors.username = "El nombre de usuario es obligatorio.";
    }

    if (!credentials.password || credentials.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setCredErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCredSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateCredentials()) return;

    if (!credMode) {
      setPopup({
        type: "error",
        message: "No se ha definido si es usuario o administrador.",
      });
      return;
    }

    try {
      // Mapear los campos del formulario al modelo del backend
      const codRol = credMode === "admin" ? 2 : 1; // ajusta si tus roles tienen otros IDs

      const payload = {
        cod_rol: codRol,
        cod_disp: null,
        ci: form.ci,
        nom_us: form.firstName,
        handle_name: credentials.username,
        ap_pat_us: form.lastNameFather,
        ap_mat_us: form.lastNameMother || null,
        contra_us: credentials.password,
        fecha_nacimiento: form.birth, // viene como "YYYY-MM-DD" del input date
        sexo: form.sex || "M", // ya validaste que no esté vacío
        estado_us: "activo",
        correo_us: form.email,
        telefono_us: form.phone,
        // foto_us no se envía: el backend usa imagen por defecto si falta
      };

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        // El back manda mensajes como "El handle name ya existe."
        throw new Error(json.message || "Error al registrar el usuario.");
      }

      // Aviso visual
      setPopup({
        type: "success",
        message:
          credMode === "admin"
            ? "Administrador registrado con éxito."
            : "Usuario registrado con éxito.",
      });

      // Si el padre quiere enterarse del éxito, se lo notificamos
      if (onConfirm) {
        await onConfirm({ ...form, photo: photoFile });
      }
    } catch (err: any) {
      setPopup({
        type: "error",
        message: err?.message ?? "Ocurrió un error al registrar.",
      });
    }
  };

  const closePopup = (): void => {
    if (popup?.type === "success") {
      setForm({
        ci: "",
        firstName: "",
        lastNameFather: "",
        lastNameMother: "",
        birth: "",
        sex: "",
        email: "",
        phone: "",
      });
      setFormErrors({});
      setPhotoFile(null);
      setPhotoName("vacío");
      setCredentials({ username: "", password: "" });
      setCredErrors({});
      setShowCredModal(false);
      setCredMode(null);
    }
    setPopup(null);
  };

  const inputClass = (fieldError?: string) =>
    fieldError ? `${styles.inputBase} ${styles.inputError}` : styles.inputBase;

  return (
    <>
      <div className={styles.screen} onClick={onCancel}>
        <form
          className={styles.sheet}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleConfirmSubmit}
          aria-label="Registro de Usuario"
        >
          <div className={styles.content}>
            <div className={styles.field}>
              <Label htmlFor={ciId}>CI</Label>
              <input
                id={ciId}
                className={inputClass(formErrors.ci)}
                value={form.ci}
                onChange={(e) => set("ci")(e.target.value)}
              />
              {formErrors.ci && (
                <span className={styles.errorText}>{formErrors.ci}</span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={nId}>Nombre</Label>
              <input
                id={nId}
                className={inputClass(formErrors.firstName)}
                value={form.firstName}
                onChange={(e) => set("firstName")(e.target.value)}
              />
              {formErrors.firstName && (
                <span className={styles.errorText}>
                  {formErrors.firstName}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={apId}>Apellido Paterno</Label>
              <input
                id={apId}
                className={inputClass(formErrors.lastNameFather)}
                value={form.lastNameFather}
                onChange={(e) => set("lastNameFather")(e.target.value)}
              />
              {formErrors.lastNameFather && (
                <span className={styles.errorText}>
                  {formErrors.lastNameFather}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={amId}>Apellido Materno</Label>
              <input
                id={amId}
                className={inputClass(formErrors.lastNameMother)}
                value={form.lastNameMother}
                onChange={(e) => set("lastNameMother")(e.target.value)}
              />
              {formErrors.lastNameMother && (
                <span className={styles.errorText}>
                  {formErrors.lastNameMother}
                </span>
              )}
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <Label htmlFor={fnId}>Fecha de Nacimiento</Label>
                <input
                  id={fnId}
                  type="date"
                  className={inputClass(formErrors.birth)}
                  value={form.birth}
                  onChange={(e) => set("birth")(e.target.value)}
                />
                {formErrors.birth && (
                  <span className={styles.errorText}>{formErrors.birth}</span>
                )}
              </div>

              <div className={styles.field}>
                <Label htmlFor={sxId}>Sexo</Label>
                <select
                  id={sxId}
                  className={inputClass(formErrors.sex)}
                  value={form.sex}
                  onChange={(e) => set("sex")(e.target.value as Sex)}
                >
                  <option value="">—</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
                {formErrors.sex && (
                  <span className={styles.errorText}>{formErrors.sex}</span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <Label htmlFor={emId}>Correo</Label>
              <input
                id={emId}
                type="email"
                className={inputClass(formErrors.email)}
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
              />
              {formErrors.email && (
                <span className={styles.errorText}>{formErrors.email}</span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={phId}>Teléfono</Label>
              <input
                id={phId}
                className={inputClass(formErrors.phone)}
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
              />
              {formErrors.phone && (
                <span className={styles.errorText}>{formErrors.phone}</span>
              )}
            </div>

            <div className={styles.uploadBar}>
              <span className={styles.fileLabel}>Foto: {photoName}</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className={styles.hidden}
                onChange={handleFileChange}
              />
              <ButtonIcon
                icon="bi-upload"
                type="default"
                name="Subir Imagen"
                onClick={() => fileRef.current?.click()}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <ButtonCancel onClick={() => onCancel?.()} />
            <button type="submit" className={styles.btnConfirm}>
              Confirmar
            </button>
          </div>

          <div className={styles.linksBar}>
            <button
              type="button"
              className={styles.linkChip}
              onClick={handleEntrepreneurClick}
            >
              <span className={styles.linkIcon}>📌</span>
              <span>Iniciar como emprendedor</span>
            </button>
            <button
              type="button"
              className={styles.linkChip}
              onClick={handleAdminClick}
            >
              <span className={styles.linkIcon}>🛡️</span>
              <span>Iniciar como administrador</span>
            </button>
          </div>
        </form>
      </div>

      {showCredModal && (
        <div
          className={styles.loginScreen}
          onClick={() => setShowCredModal(false)}
        >
          <form
            className={styles.loginSheet}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCredSubmit}
          >
            <div className={styles.loginHeader}>
              <h2 className={styles.loginTitle}>
                {credMode === "admin"
                  ? "Registrar administrador"
                  : "Registrar usuario"}
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setShowCredModal(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <div className={styles.field}>
              <Label htmlFor={credUserId}>Nombre de usuario</Label>
              <input
                id={credUserId}
                className={inputClass(credErrors.username)}
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
              {credErrors.username && (
                <span className={styles.errorText}>
                  {credErrors.username}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={credPwId}>Contraseña</Label>
              <input
                id={credPwId}
                type="password"
                className={inputClass(credErrors.password)}
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
              {credErrors.password && (
                <span className={styles.errorText}>
                  {credErrors.password}
                </span>
              )}
            </div>

            <div className={styles.loginActions}>
              <button
                type="button"
                className={styles.btnCancelLogin}
                onClick={() => setShowCredModal(false)}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.btnConfirmLogin}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {popup && (
        <div
          className={styles.popupScreen}
          onClick={closePopup}
        >
          <div
            className={styles.popupCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.popupHeader}>
              <span className={styles.popupTitle}>
                {popup.type === "error"
                  ? "Error"
                  : "Registro completado"}
              </span>
              <button
                type="button"
                className={styles.popupCloseBtn}
                onClick={closePopup}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

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
              onClick={closePopup}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SignInUserModal;
