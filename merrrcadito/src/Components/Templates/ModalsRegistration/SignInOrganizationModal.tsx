"use client";

import {
  useId,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
import styles from "./SignInOrganizationModal.module.css";

import ButtonCancel from "@/Components/Atoms/Buttons/ButtonCancel/ButtonCancel";
import Label from "@/Components/Atoms/Label/Label";
import ButtonIcon from "@/Components/Atoms/Buttons/ButtonIcon/ButtonIcon";

interface Props {
  open: boolean;
  onCancel?: () => void;
  onConfirm: (data: {
    legalName: string;
    alias: string;
    type: string;
    cif: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    logo?: File | null;
  }) => void | Promise<void>;
  onPickLocation?: () => void;
}

interface OrgForm {
  legalName: string;
  alias: string;
  type: string;
  cif: string;
  email: string;
  phone: string;
  address: string;
  website: string;
}

interface CredentialForm {
  username: string;
  password: string;
}

type OrgErrors = Partial<Record<keyof OrgForm, string>>;
type CredentialErrors = Partial<Record<keyof CredentialForm, string>>;

type PopupType = "error" | "success";

interface PopupState {
  type: PopupType;
  message: string;
}

const MOCK_ORG_USERNAMES: string[] = ["ongdemo", "empresa", "orgadmin"];

async function isUsernameTaken(username: string): Promise<boolean> {
  await new Promise((res) => setTimeout(res, 300));
  return MOCK_ORG_USERNAMES.includes(username.toLowerCase());
}

export default function SignInOrganizationModal({
  open,
  onCancel,
  onConfirm,
  onPickLocation,
}: Props) {
  const legalId = useId();
  const aliasId = useId();
  const typeId = useId();
  const cifId = useId();
  const emId = useId();
  const phId = useId();
  const addrId = useId();
  const webId = useId();

  const credUserId = useId();
  const credPwId = useId();

  const logoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<OrgForm>({
    legalName: "",
    alias: "",
    type: "",
    cif: "",
    email: "",
    phone: "",
    address: "",
    website: "",
  });
  const [formErrors, setFormErrors] = useState<OrgErrors>({});

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("vacío");

  const [credentials, setCredentials] = useState<CredentialForm>({
    username: "",
    password: "",
  });
  const [credErrors, setCredErrors] = useState<CredentialErrors>({});

  const [showCredModal, setShowCredModal] = useState(false);
  const [popup, setPopup] = useState<PopupState | null>(null);

  if (!open) return null;

  const set =
    (k: keyof OrgForm) =>
    (v: string): void =>
      setForm((prev) => ({ ...prev, [k]: v }));

  const validateMainForm = (): boolean => {
    const errors: OrgErrors = {};

    if (!form.legalName.trim()) errors.legalName = "El nombre legal es obligatorio.";
    if (!form.alias.trim()) errors.alias = "El alias es obligatorio.";
    if (!form.type.trim()) errors.type = "Selecciona un tipo.";
    if (!form.cif.trim()) errors.cif = "El CIF es obligatorio.";

    if (!form.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = "El correo no es válido.";
    }

    if (!form.phone.trim()) errors.phone = "El teléfono es obligatorio.";
    if (!form.address.trim()) errors.address = "La dirección es obligatoria.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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

  const handleSubmitMain = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateMainForm()) return;

    await onConfirm({ ...form, logo: logoFile });

    setShowCredModal(true);
  };

  const handleCredSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateCredentials()) return;

    const taken = await isUsernameTaken(credentials.username);
    if (taken) {
      setPopup({
        type: "error",
        message: "El nombre de usuario ya está ocupado, por favor elige otro.",
      });
      return;
    }

    setPopup({
      type: "success",
      message: "Organización registrada con éxito.",
    });
  };

  const closePopup = (): void => {
    if (popup?.type === "success") {
      setForm({
        legalName: "",
        alias: "",
        type: "",
        cif: "",
        email: "",
        phone: "",
        address: "",
        website: "",
      });
      setFormErrors({});
      setLogoFile(null);
      setLogoName("vacío");
      setCredentials({ username: "", password: "" });
      setCredErrors({});
      setShowCredModal(false);
    }
    setPopup(null);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const f = e.target.files?.[0] ?? null;
    setLogoFile(f);
    setLogoName(f ? f.name : "vacío");
  };

  const inputClass = (fieldError?: string) =>
    fieldError ? `${styles.inputBase} ${styles.inputError}` : styles.inputBase;

  return (
    <>
      <div className={styles.screen} onClick={onCancel}>
        <form
          className={styles.sheet}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmitMain}
          aria-label="Registro de Organización"
        >
          <div className={styles.content}>
            <div className={styles.field}>
              <Label htmlFor={legalId}>Nombre Legal</Label>
              <input
                id={legalId}
                className={inputClass(formErrors.legalName)}
                value={form.legalName}
                onChange={(e) => set("legalName")(e.target.value)}
              />
              {formErrors.legalName && (
                <span className={styles.errorText}>{formErrors.legalName}</span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={aliasId}>Alias</Label>
              <input
                id={aliasId}
                className={inputClass(formErrors.alias)}
                value={form.alias}
                onChange={(e) => set("alias")(e.target.value)}
              />
              {formErrors.alias && (
                <span className={styles.errorText}>{formErrors.alias}</span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={typeId}>Tipo</Label>
              <select
                id={typeId}
                className={inputClass(formErrors.type)}
                value={form.type}
                onChange={(e) => set("type")(e.target.value)}
              >
                <option value="">—</option>
                <option value="ONG">ONG</option>
                <option value="Empresa">Empresa</option>
                <option value="Fundación">Fundación</option>
                <option value="Asociación">Asociación</option>
              </select>
              {formErrors.type && (
                <span className={styles.errorText}>{formErrors.type}</span>
              )}
            </div>

            <div className={styles.field}>
              <Label htmlFor={cifId}>CIF</Label>
              <input
                id={cifId}
                className={inputClass(formErrors.cif)}
                value={form.cif}
                onChange={(e) => set("cif")(e.target.value)}
              />
              {formErrors.cif && (
                <span className={styles.errorText}>{formErrors.cif}</span>
              )}
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

            <div className={styles.addressRow}>
              <div className={styles.field} style={{ flex: 1 }}>
                <Label htmlFor={addrId}>Dirección</Label>
                <input
                  id={addrId}
                  className={inputClass(formErrors.address)}
                  value={form.address}
                  onChange={(e) => set("address")(e.target.value)}
                />
                {formErrors.address && (
                  <span className={styles.errorText}>{formErrors.address}</span>
                )}
              </div>

              <ButtonIcon
                icon="bi-geo-alt"
                type="default"
                name="Elegir en mapa"
                onClick={onPickLocation ?? (() => {})}
              />
            </div>

            <div className={styles.field}>
              <Label htmlFor={webId}>Sitio Web</Label>
              <input
                id={webId}
                className={inputClass()}
                value={form.website}
                onChange={(e) => set("website")(e.target.value)}
              />
            </div>

            <div className={styles.uploadBar}>
              <span className={styles.fileLabel}>Logo: {logoName}</span>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className={styles.hidden}
                onChange={handleLogoChange}
              />
              <ButtonIcon
                icon="bi-upload"
                type="default"
                name="Subir Imagen"
                onClick={() => logoRef.current?.click()}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <ButtonCancel onClick={onCancel} />
            <button type="submit" className={styles.btnConfirm}>
              Confirmar
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
              <h2 className={styles.loginTitle}>Credenciales de la organización</h2>
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
                <span className={styles.errorText}>{credErrors.username}</span>
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
                <span className={styles.errorText}>{credErrors.password}</span>
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
              <button type="submit" className={styles.btnConfirmLogin}>
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
}
