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
  // cod_rol 3 = admin
  if (codRol === 3) return "admin";
  // cod_rol 1 = user común, cod_rol 2 = entrepreneur (ambos se tratan como 'user')
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
      const AUTH_API_BASE =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api";

      console.log('[FRONTEND LOGIN] Intentando autenticación...');
      console.log('[FRONTEND LOGIN] Usuario:', username);

      // ========================================
      // INTENTO 1: LOGIN COMO USUARIO
      // ========================================
      let userLoginResponse = await fetch(`${AUTH_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_us: username,
          contra_us: password,
        }),
      });

      let userLoginData = await userLoginResponse.json();

      // Si login de usuario exitoso
      if (userLoginResponse.ok && userLoginData.success && userLoginData.user) {
        const user = userLoginData.user;
        const role = mapCodRolToRole(user.cod_rol || 1);

        console.log('[FRONTEND LOGIN] ✅ Login de USUARIO exitoso');

        // Guardar en localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("accountType", "user");
            localStorage.setItem("userId", user.cod_us.toString());
            localStorage.setItem("userName", user.nom_us);
            localStorage.setItem("userHandle", user.handle_name);
            localStorage.setItem("userEmail", user.correo_us);
            localStorage.setItem("currentUserHandle", user.handle_name);
            localStorage.setItem("currentUserRole", role);
          } catch (err) {
            console.error('[FRONTEND LOGIN] Error guardando en localStorage:', err);
          }
        }

        // Redirigir al perfil
        router.push(
          `${PROFILE_ROUTE_BASE}?type=user&role=${role}&handle=${encodeURIComponent(
            user.handle_name
          )}`
        );
        return;
      }

      // ========================================
      // INTENTO 2: LOGIN COMO ORGANIZACIÓN
      // ========================================
      console.log('[FRONTEND LOGIN] Login de usuario falló, intentando como organización...');

      const orgLoginResponse = await fetch(`${AUTH_API_BASE}/auth/login-organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo_org: username,
          cif: password,
        }),
      });

      const orgLoginData = await orgLoginResponse.json();

      // Si login de organización exitoso
      if (orgLoginResponse.ok && orgLoginData.success && orgLoginData.organization) {
        const org = orgLoginData.organization;

        console.log('[FRONTEND LOGIN] ✅ Login de ORGANIZACIÓN exitoso');

        // Guardar en localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("accountType", "organization");
            localStorage.setItem("orgId", org.cod_org.toString());
            localStorage.setItem("orgName", org.nom_com_org);
            localStorage.setItem("orgLegalName", org.nom_leg_org);
            localStorage.setItem("orgEmail", org.correo_org);
          } catch (err) {
            console.error('[FRONTEND LOGIN] Error guardando en localStorage:', err);
          }
        }

        // Redirigir al perfil de organización
        router.push(
          `${PROFILE_ROUTE_BASE}?type=org&nom_leg_org=${encodeURIComponent(
            org.nom_leg_org
          )}`
        );
        return;
      }

      // ========================================
      // AMBOS LOGINS FALLARON
      // ========================================
      console.log('[FRONTEND LOGIN] ❌ Ambos intentos de login fallaron');
      setLoginError(
        "Credenciales incorrectas. Verifica tu correo/usuario y contraseña/CIF."
      );

    } catch (error) {
      console.error('[FRONTEND LOGIN] Error en autenticación:', error);
      setLoginError(
        "Ocurrió un problema al iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  // 🔹 Firma alineada con el tipo que espera SignInOrganizationModal
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
