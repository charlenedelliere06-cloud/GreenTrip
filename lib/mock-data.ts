import { City, Place, Tip } from "./types";

export const cities: City[] = [
  {
    id: "1",
    name: "Bali",
    country: "Indonésie",
    slug: "bali",
    vegan_score: 5,
    description:
      "Bali est un véritable paradis pour les vegans. Ubud regorge de cafés et restaurants 100% plant-based, et la culture locale intègre naturellement beaucoup de plats à base de tempeh et tofu.",
    image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop",
    lat: -8.4095,
    lng: 115.1889,
  },
  {
    id: "2",
    name: "Athènes",
    country: "Grèce",
    slug: "athenes",
    vegan_score: 3,
    description:
      "Athènes offre une scène vegan en pleine croissance. Entre les mezze végétaux traditionnels et les nouveaux restaurants plant-based, la ville propose de bonnes options, même si la culture reste très orientée viande et fromage.",
    image_url: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&h=500&fit=crop",
    lat: 37.9838,
    lng: 23.7275,
  },
  {
    id: "3",
    name: "Lisbonne",
    country: "Portugal",
    slug: "lisbonne",
    vegan_score: 4,
    description:
      "Lisbonne est l'une des capitales européennes les plus vegan-friendly. On y trouve de nombreux restaurants entièrement végétaliens, des supermarchés bio bien fournis et une communauté vegan active.",
    image_url: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=500&fit=crop",
    lat: 38.7223,
    lng: -9.1393,
  },
  {
    id: "4",
    name: "Londres",
    country: "Royaume-Uni",
    slug: "londres",
    vegan_score: 5,
    description:
      "Londres est la capitale mondiale du véganisme depuis 4 ans. Avec plus de 3 600 lieux vegan-friendly, la ville offre une diversité incroyable de supermarchés bio, épiceries spécialisées et restaurants plant-based.",
    image_url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    id: "5",
    name: "Barcelone",
    country: "Espagne",
    slug: "barcelone",
    vegan_score: 4,
    description:
      "Barcelone est un paradis vegan méditerranéen. La ville combine une tradition culinaire riche avec une scène vegan ultra dynamique. On y trouve des supermarchés bio à chaque coin de rue et des restos plant-based créatifs.",
    image_url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=500&fit=crop",
    lat: 41.3851,
    lng: 2.1734,
  },
  {
    id: "6",
    name: "Los Angeles",
    country: "États-Unis",
    slug: "los-angeles",
    vegan_score: 5,
    description:
      "Los Angeles est la mecque du véganisme aux États-Unis. Avec plus de 50 restaurants 100% vegan et des supermarchés bio partout, c'est l'une des villes les plus faciles au monde pour faire ses courses vegan.",
    image_url: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&h=500&fit=crop",
    lat: 34.0522,
    lng: -118.2437,
  },
];

export const places: Place[] = [];

export const tips: Tip[] = [];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getPlacesByCity(cityId: string): Place[] {
  return places.filter((p) => p.city_id === cityId);
}

export function getPlacesByType(cityId: string, type?: Place["type"]): Place[] {
  return places.filter((p) => p.city_id === cityId && (!type || p.type === type));
}

export function getPlaceById(id: string): Place | undefined {
  return places.find((p) => p.id === id);
}

export function getTipsByCity(cityId: string): Tip[] {
  return tips.filter((t) => t.city_id === cityId);
}
