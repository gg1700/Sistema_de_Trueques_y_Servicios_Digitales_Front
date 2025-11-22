"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import LoginLandingModal from "@/Components/Templates/ModalsRegistration/LoginLandingModal";
import LogInModal from "@/Components/Templates/ModalsRegistration/LogInModal";
import SignInChoiceModal from "@/Components/Templates/ModalsRegistration/SignInChoiceModal";
import SignInOrganizationModal from "@/Components/Templates/ModalsRegistration/SignInOrganizationModal";
import SignInUserModal from "@/Components/Templates/ModalsRegistration/SignInUserModal";
import EntrepreneurRegister from "@/Components/Templates/ModalsRegistration/EntrepreneurRegister";

type Step =
  | "landing"
  | "login"
  | "choice"
  | "organization"
  | "user"
  | "entrepreneur";

type Role = "admin" | "user" | "entrepreneur";

const USERS_API_BASE =
  process.env.NEXT_PUBLIC_USERS_API_BASE_URL ??
  "http://localhost:5000/api/users";

const ORG_API_BASE =
  process.env.NEXT_PUBLIC_ORGANIZATION_API_BASE_URL ??
  "http://localhost:5000/api/organization";

const PROFILE_ROUTE_BASE = "/Home";

const mapCodRolToRole = (codRol?: number): Role => {
  if (codRol === 2) return "admin";
  if (codRol === 3) return "entrepreneur";
  return "user";
};

const AuthRegistrationFlow: React.FC = () => {
  const [step, setStep] = useState<Step>("landing");
  const [loginError, setLoginError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async (data: { username: string; password: string }) => {
    const { username, password } = data;
    setLoginError(null);
    try {
      const resUser = await fetch(
        `${USERS_API_BASE}/get_user_data?handle_name=${encodeURIComponent(
          username
        )}`,
        { method: "GET" }
      );

      const jsonUser = await resUser.json().catch(() => ({} as any));

      const rawData = jsonUser?.data;
      const userData = Array.isArray(rawData) ? rawData[0] : rawData;

      const userFound =
        resUser.ok && jsonUser.success !== false && userData != null;

      if (userFound) {
        const role = mapCodRolToRole(userData.cod_rol);
        const codUs: number | undefined = userData.cod_us;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem("currentUserHandle", username);
            window.localStorage.setItem("currentUserRole", role);
            if (codUs != null) {
              window.localStorage.setItem("currentUserId", String(codUs));
            }
          } catch {
          }
        }
        const params = new URLSearchParams({
          type: "user",
          role,
          handle: username,
        });
        if (codUs != null) {
          params.append("cod_us", String(codUs)); 
        }

        router.push(`${PROFILE_ROUTE_BASE}?${params.toString()}`);
        return;
      }
      const resOrg = await fetch(
        `${ORG_API_BASE}/get_org_data?nom_leg_org=${encodeURIComponent(
          username
        )}&cif=${encodeURIComponent(password)}`,
        { method: "GET" }
      );

      const jsonOrg = await resOrg.json().catch(() => ({} as any));

      const orgFound =
        resOrg.ok &&
        jsonOrg.success !== false &&
        jsonOrg.data &&
        jsonOrg.data.length > 0;

      if (orgFound) {
        router.push(
          `${PROFILE_ROUTE_BASE}?type=org&nom_leg_org=${encodeURIComponent(
            username
          )}`
        );
        return;
      }
      setLoginError(
        "Usuario u organización no registrados o credenciales incorrectas."
      );
    } catch {
      setLoginError(
        "Ocurrió un problema al iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  const handleOrganizationRegister = async (data: {
    nom_com_org: string;
    nom_leg_org: string;
    tipo_org: "" | "con_fines_lucro" | "sin_fines_lucro";
    rubro_org: string;
    cif: string;
    correo_org: string;
    telf_org: string;
    dir_org: string;
    sitio_web: string;
    logo?: File | null;
  }) => {
    console.log("Registro Organización (callback padre):", data);
  };

  const handleUserRegister = async (data: {
    ci: string;
    firstName: string;
    lastNameFather: string;
    lastNameMother: string;
    birth: string;
    sex: "M" | "F" | "";
    email: string;
    phone: string;
    photo?: File | null;
  }) => {
    console.log("Registro Usuario (callback padre):", data);
  };

  return (
    <>
      <LoginLandingModal
        open={step === "landing"}
        onSignIn={() => setStep("choice")}
        onLogIn={() => {
          setLoginError(null);
          setStep("login");
        }}
        onClose={() => {
          console.log("Cerrar landing de login");
        }}
      />

      <LogInModal
        open={step === "login"}
        onConfirm={handleLogin}
        onCancel={() => {
          setLoginError(null);
          setStep("landing");
        }}
      />

      {step === "login" && loginError && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setLoginError(null)}
        >
          <div
            style={{
              background: "#1b1024",
              color: "#ffffffff",
              padding: "20px 24px",
              borderRadius: "12px",
              maxWidth: "320px",
              width: "90%",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontWeight: 600 }}>Error de inicio de sesión</span>
              <button
                type="button"
                onClick={() => setLoginError(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: "18px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                marginBottom: "16px",
                color: "#ff9ca1",
              }}
            >
              {loginError}
            </p>

            <button
              type="button"
              onClick={() => setLoginError(null)}
              style={{
                width: "100%",
                padding: "8px 0",
                borderRadius: "999px",
                border: "none",
                background: "#08c9acff",
                color: "#1b1024",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      <SignInChoiceModal
        open={step === "choice"}
        onOrganization={() => setStep("organization")}
        onUser={() => setStep("user")}
        onClose={() => setStep("landing")}
      />

      <SignInOrganizationModal
        open={step === "organization"}
        onCancel={() => setStep("choice")}
        onConfirm={handleOrganizationRegister}
        onPickLocation={() => {
          console.log("Elegir ubicación en mapa");
        }}
      />

      <SignInUserModal
        open={step === "user"}
        onCancel={() => setStep("choice")}
        onConfirm={handleUserRegister}
        onGoEntrepreneur={() => setStep("entrepreneur")}
      />

      {step === "entrepreneur" && (
        <EntrepreneurRegister onBack={() => setStep("user")} />
      )}
    </>
  );
};

export default AuthRegistrationFlow;
