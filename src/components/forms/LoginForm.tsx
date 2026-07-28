"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/area-cliente";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    if (email === "admin@helenavasconcelos.adv.br") {
      router.push("/admin");
    } else {
      router.push(callbackUrl);
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="panel space-y-5 p-6 shadow-[var(--shadow)] md:p-8">
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
      <p className="text-sm text-muted">
        Demonstração — cliente:{" "}
        <code>cliente@exemplo.com</code> / <code>cliente123</code>
        <br />
        Admin: <code>admin@helenavasconcelos.adv.br</code> / <code>admin123</code>
      </p>
      <p className="text-sm text-muted">
            Ainda não é cliente?{" "}
        <Link href="/agendar" className="text-accent">
          Agende uma consulta
        </Link>
        .
      </p>
    </form>
  );
}
