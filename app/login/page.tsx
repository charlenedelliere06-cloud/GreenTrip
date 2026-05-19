"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    const result = await resetPassword(forgotEmail);
    setForgotLoading(false);
    if (result.error) {
      setForgotError("Une erreur est survenue. Vérifie ton adresse email.");
    } else {
      setForgotSuccess(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signInWithEmail(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push(redirect);
    }
  };

  return (
    <div className="min-h-[80vh] bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-xl font-bold text-forest">
            Green<span className="text-sage-dark">Trip</span>
          </Link>
          <h1 className="text-2xl font-bold text-forest mt-6 mb-1">Connexion</h1>
          <p className="text-sm text-forest/60">
            Connecte-toi pour partager tes bonnes adresses vegan.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">

          {/* Google */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 border border-forest/10 rounded-xl px-4 py-3 text-sm font-medium text-forest hover:bg-white/60 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-forest/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-forest/60">ou</span>
            </div>
          </div>

          {/* Formulaire email */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-forest/60 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white/50 text-forest text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50 transition-all"
                placeholder="ton@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-forest/60 uppercase tracking-wide">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => { setShowForgot(!showForgot); setForgotSuccess(false); setForgotError(""); }}
                  className="text-xs text-sage-dark hover:underline"
                >
                  Oublié ?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white/50 text-forest text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Mot de passe oublié */}
            {showForgot && (
              <div className="bg-white rounded-xl p-4 space-y-3">
                {forgotSuccess ? (
                  <p className="text-sm text-sage-dark text-center">
                    Email envoyé ! Vérifie ta boîte mail.
                  </p>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-3">
                    <p className="text-xs text-forest/60">
                      On t&apos;envoie un lien pour réinitialiser ton mot de passe.
                    </p>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-forest/10 bg-white text-forest text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 transition-all"
                      placeholder="ton@email.com"
                    />
                    {forgotError && <p className="text-xs text-red-500">{forgotError}</p>}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full bg-sage text-white py-2 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
                    >
                      {forgotLoading ? "Envoi..." : "Envoyer le lien"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage text-white py-2.5 rounded-xl text-sm font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-xs text-forest/60 mt-5">
            Pas encore de compte ?{" "}
            <Link
              href={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`}
              className="text-sage-dark font-medium hover:underline"
            >
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
