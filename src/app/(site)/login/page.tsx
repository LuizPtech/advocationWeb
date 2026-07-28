import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function LoginPage() {
  return (
    <div className="section-pad">
      <div className="container-page mx-auto max-w-md">
        <h1 className="font-display text-center text-5xl text-ink">Entrar</h1>
        <p className="mt-3 text-center text-muted">
          Acesse a área do cliente ou o painel administrativo.
        </p>
        <div className="mt-8">
          <Suspense fallback={<div className="panel p-8">Carregando...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
