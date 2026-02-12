# GreenTrip — Roadmap Vibe Coding

## Le projet

GreenTrip est un guide de voyage vegan. Pas juste des restos — on va plus loin : supermarchés, épiceries bio, tips par pays, pièges à éviter, et un score par ville pour savoir à quel point c'est vegan-friendly.

C'est une web app (mobile-first). Pas de booking, pas d'hébergement, pas de e-commerce.

## Stack recommandée

- **Frontend** : Next.js (App Router) + Tailwind CSS
- **Backend** : Next.js API routes
- **Base de données** : Supabase (PostgreSQL + auth + storage)
- **Déploiement** : Vercel
- **Maps** : Leaflet ou Mapbox (gratuit jusqu'à 50k requêtes)

## Phase 1 — Fondations (semaine 1-2)

### Setup projet
- Init Next.js + Tailwind + Supabase
- Créer la DB avec ces tables :
  - `cities` (id, name, country, slug, vegan_score, description, image_url, lat, lng)
  - `places` (id, city_id, name, type [supermarket|restaurant|cafe|store], address, lat, lng, description, google_maps_url, tags)
  - `tips` (id, city_id, country, title, content, category [tip|trap])
  - `contributions` (id, user_id, city_id, place_id, content, status [pending|approved|rejected])
  - `users` (géré par Supabase Auth)

### Pages de base
- **Homepage** : hero + barre de recherche + villes populaires
- **Page ville** (`/city/[slug]`) : score vegan, carte, liste des lieux, tips
- **Page lieu** (`/place/[id]`) : détails, adresse, lien Google Maps

## Phase 2 — Contenu & Score (semaine 3-4)

### Système de score vegan par ville (1-5 🌱)
Critères :
- Nombre de restos vegan/vegan-friendly
- Présence de supermarchés bio/vegan
- Variété de cuisine végétale
- Facilité au quotidien (étiquetage, culture locale)

### Premières fiches villes (5 pour le lancement)
- Bali 🇮🇩
- Athènes 🇬🇷
- Mykonos 🇬🇷
- Lisbonne 🇵🇹
- Amsterdam 🇳🇱

### Tips par pays
- Format : carte avec icône 💡 (tip) ou ⚠️ (piège)
- Exemples : "En Grèce, demandez si le tzatziki est fait au yaourt végétal" / "À Bali, 'vegetarian' inclut souvent l'œuf"

## Phase 3 — Communauté (semaine 5-6)

### Auth utilisateur
- Inscription/connexion via Supabase Auth (email + Google)
- Profil basique (pseudo, avatar, villes visitées)

### Contributions
- Formulaire "Suggérer un lieu" (nom, adresse, type, commentaire)
- Formulaire "Ajouter un tip"
- File de modération (admin dashboard simple)
- Statut : en attente → approuvé / rejeté

### Favoris
- Sauvegarder des lieux et des villes
- Liste perso accessible depuis le profil

## Phase 4 — Polish & Lancement (semaine 7-8)

### SEO & Performance
- Métadonnées par ville et par lieu
- Sitemap dynamique
- Images optimisées (next/image)
- Score Lighthouse > 90

### Design
- Palette : vert sauge (#9CAF88), beige (#F5F0E8), blanc cassé, touches de vert foncé
- Typo : moderne, clean (Inter ou Poppins)
- Mobile-first, cards arrondies, icônes simples
- Pas de dark mode pour le MVP

### Admin
- Dashboard simple pour :
  - Ajouter/modifier des villes et lieux
  - Modérer les contributions
  - Voir les stats basiques (nombre de villes, lieux, users)

### Lancement
- Déployer sur Vercel
- Domaine : greentrip.app ou greentrip.co (ou autre dispo)
- 5 villes complètes minimum
- Page "À propos" avec la story du projet
- Page "Contribuer" pour encourager la communauté

## Structure des fichiers

```
greentrip/
├── app/
│   ├── page.tsx              (homepage)
│   ├── city/[slug]/page.tsx  (fiche ville)
│   ├── place/[id]/page.tsx   (fiche lieu)
│   ├── contribute/page.tsx   (formulaire contribution)
│   ├── profile/page.tsx      (profil user)
│   ├── admin/page.tsx        (dashboard admin)
│   ├── about/page.tsx
│   └── api/
│       ├── cities/route.ts
│       ├── places/route.ts
│       ├── tips/route.ts
│       └── contributions/route.ts
├── components/
│   ├── CityCard.tsx
│   ├── PlaceCard.tsx
│   ├── TipCard.tsx
│   ├── SearchBar.tsx
│   ├── Map.tsx
│   ├── VeganScore.tsx
│   └── Navbar.tsx
├── lib/
│   ├── supabase.ts
│   └── types.ts
└── public/
    └── images/
```

## Règles pour le code

- Tout en anglais (code, variables, composants)
- Commentaires en français OK
- Mobile-first toujours
- Composants réutilisables
- Pas d'over-engineering : simple > parfait
- Données en dur OK pour commencer, migration DB ensuite

## Prompt de démarrage

> Crée une web app Next.js appelée GreenTrip — un guide de voyage vegan. Commence par le setup : Next.js 14 App Router + Tailwind CSS + Supabase. Crée la homepage avec une barre de recherche, des city cards avec un score vegan (1-5 🌱), et une page ville dynamique avec une carte, la liste des lieux (supermarchés, restos, cafés) et des tips. Mobile-first, palette vert sauge + beige. Données mockées pour 3 villes (Bali, Athènes, Lisbonne) pour commencer.
