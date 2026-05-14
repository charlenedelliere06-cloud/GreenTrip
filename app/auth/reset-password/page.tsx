"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.error) {
      setError("Une erreur est survenue. Réessaie ou redemande un lien.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/"), 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-forest">Nouveau mot de passe</h1>
          <p className="text-forest/60 mt-2">
            Choisis un nouveau mot de passe pour ton compte.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {success ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✅</div>
              <p className="text-forest font-medium">Mot de passe mis à jour !</p>
              <p className="text-sm text-forest/60">Tu vas être redirigée vers l&apos;accueil...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest mb-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
                  placeholder="Au moins 6 caractères"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest mb-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-beige-dark bg-offwhite text-forest focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sage text-white py-2.5 rounded-xl font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Enregistrement..." : "Enregistrer le mot de passe"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
