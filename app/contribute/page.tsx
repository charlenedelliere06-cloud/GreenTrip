"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ContributePlaceForm } from "@/components/ContributePlaceForm";

export default function ContributePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/contribute");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-beige rounded-lg w-1/3" />
          <div className="h-4 bg-beige rounded-lg w-2/3" />
          <div className="h-64 bg-beige rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-forest">Suggérer un lieu</h1>
      <p className="text-forest/60 mt-2">
        Partage tes bonnes adresses vegan avec la communauté : supermarchés bio,
        épiceries, restaurants...
      </p>
      <ContributePlaceForm userId={user.id} />
    </div>
  );
}
