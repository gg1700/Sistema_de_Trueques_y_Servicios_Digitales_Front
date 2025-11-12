"use client";

import { useState } from "react";
import styles from "./AuthRegistrationFlow.module.css";

/* Importes RELATIVOS porque están en la misma carpeta */
import LoginLandingModal from "./LoginLandingModal";
import SignInChoiceModal from "./SignInChoiceModal";
import LogInModal from "./LogInModal";
import SignInUserModal from "./SignInUserModal";
import SignInOrganizationModal from "./SignInOrganizationModal";

/* Estados del flujo */
type Step =
  | "landing"
  | "choice"
  | "login"
  | "signup_user"
  | "signup_org"
  | "idle";

export default function AuthRegistrationFlow() {
  const [step, setStep] = useState<Step>("landing");

  // Navegación entre pantallas
  const goLanding = () => setStep("landing");
  const goChoice = () => setStep("choice");
  const goLogin = () => setStep("login");
  const goSignupUser = () => setStep("signup_user");
  const goSignupOrg = () => setStep("signup_org");
  const closeAll = () => setStep("idle");

  // Submits (conecta aquí tu API)
  const handleLogin = async (data: { username: string; password: string }) => {
    console.log("LOGIN", data);
    closeAll();
  };

  const handleSignupUser = async (payload: unknown) => {
    console.log("SIGNUP USER", payload);
    closeAll();
  };

  const handleSignupOrg = async (payload: unknown) => {
    console.log("SIGNUP ORG", payload);
    closeAll();
  };

  return (
    <div className={styles.host}>
      {/* 1) Landing pantalla completa */}
      {step === "landing" ? (
        <LoginLandingModal
          open={true}
          onSignIn={goChoice}
          onLogIn={goLogin}
          appName="Pixer"
        />
      ) : null}

      {/* 2) Elección de tipo */}
      <SignInChoiceModal
        open={step === "choice"}
        onOrganization={goSignupOrg}
        onUser={goSignupUser}
        onClose={goLanding}
      />

      {/* 3) Login */}
      <LogInModal
        open={step === "login"}
        onConfirm={handleLogin}
        onCancel={goLanding}
      />

      {/* 4) Registro Usuario */}
      <SignInUserModal
        open={step === "signup_user"}
        onCancel={goChoice}
        onConfirm={handleSignupUser}
      />

      {/* 5) Registro Organización */}
      <SignInOrganizationModal
        open={step === "signup_org"}
        onCancel={goChoice}
        onConfirm={handleSignupOrg}
        onPickLocation={() => {
          // sólo se ejecuta cuando se hace clic
          alert("Abrir mapa aquí");
        }}
      />
    </div>
  );
}
