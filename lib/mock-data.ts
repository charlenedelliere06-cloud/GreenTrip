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
];

export const places: Place[] = [
  // Bali
  {
    id: "p1",
    city_id: "1",
    name: "The Seeds of Life",
    type: "restaurant",
    address: "Jl. Goutama Sel., Ubud",
    lat: -8.5069,
    lng: 115.2625,
    description: "Raw vegan café avec des jus pressés, smoothie bowls et plats crus créatifs.",
    google_maps_url: "https://maps.google.com/?q=The+Seeds+of+Life+Ubud",
    tags: ["raw", "vegan", "jus", "smoothie bowls"],
  },
  {
    id: "p2",
    city_id: "1",
    name: "Bali Buda",
    type: "supermarket",
    address: "Jl. Jembawan No.1, Ubud",
    lat: -8.5056,
    lng: 115.2635,
    description: "Épicerie bio et healthy avec un large choix de produits vegan, locaux et importés.",
    google_maps_url: "https://maps.google.com/?q=Bali+Buda+Ubud",
    tags: ["bio", "épicerie", "vegan", "local"],
  },
  {
    id: "p3",
    city_id: "1",
    name: "Sage",
    type: "restaurant",
    address: "Jl. Goutama, Ubud",
    lat: -8.5075,
    lng: 115.2630,
    description: "Restaurant 100% plant-based avec une cuisine inventive et une ambiance cosy.",
    google_maps_url: "https://maps.google.com/?q=Sage+Ubud",
    tags: ["vegan", "plant-based", "cosy"],
  },
  // Athènes
  {
    id: "p4",
    city_id: "2",
    name: "Vegan Beat",
    type: "restaurant",
    address: "Pallados 6, Athènes",
    lat: 37.9778,
    lng: 23.7250,
    description: "Street food vegan au cœur d'Athènes. Gyros, burgers et wraps 100% végétaliens.",
    google_maps_url: "https://maps.google.com/?q=Vegan+Beat+Athens",
    tags: ["street food", "vegan", "gyros", "burgers"],
  },
  {
    id: "p5",
    city_id: "2",
    name: "Mama Tierra",
    type: "restaurant",
    address: "Platia Avyssinias 2, Athènes",
    lat: 37.9770,
    lng: 23.7218,
    description: "Restaurant vegan avec des options grecques revisitées et des plats internationaux.",
    google_maps_url: "https://maps.google.com/?q=Mama+Tierra+Athens",
    tags: ["vegan", "grec", "international"],
  },
  {
    id: "p6",
    city_id: "2",
    name: "Green Farm Bio Shop",
    type: "supermarket",
    address: "Athinas 34, Athènes",
    lat: 37.9800,
    lng: 23.7260,
    description: "Magasin bio avec un bon rayon vegan : fromages végétaux, laits, snacks.",
    google_maps_url: "https://maps.google.com/?q=Green+Farm+Bio+Shop+Athens",
    tags: ["bio", "supermarché", "vegan"],
  },
  // Lisbonne
  {
    id: "p7",
    city_id: "3",
    name: "The Food Temple",
    type: "restaurant",
    address: "Beco do Jasmim 18, Lisbonne",
    lat: 38.7130,
    lng: -9.1335,
    description: "Petit restaurant vegan dans l'Alfama avec un menu qui change chaque jour.",
    google_maps_url: "https://maps.google.com/?q=The+Food+Temple+Lisbon",
    tags: ["vegan", "menu du jour", "alfama"],
  },
  {
    id: "p8",
    city_id: "3",
    name: "Ao 26 - Vegan Food Project",
    type: "restaurant",
    address: "R. Vítor Cordon 26, Lisbonne",
    lat: 38.7100,
    lng: -9.1420,
    description: "Un des meilleurs restos vegan de Lisbonne. Brunch, bowls et desserts incroyables.",
    google_maps_url: "https://maps.google.com/?q=Ao+26+Vegan+Food+Project+Lisbon",
    tags: ["vegan", "brunch", "bowls", "desserts"],
  },
  {
    id: "p9",
    city_id: "3",
    name: "Celeiro",
    type: "supermarket",
    address: "R. 1º de Dezembro 65, Lisbonne",
    lat: 38.7140,
    lng: -9.1400,
    description: "Chaîne de supermarchés bio portugaise avec un excellent rayon vegan.",
    google_maps_url: "https://maps.google.com/?q=Celeiro+Lisbon",
    tags: ["bio", "supermarché", "vegan", "chaîne"],
  },
];

export const tips: Tip[] = [
  // Bali
  {
    id: "t1",
    city_id: "1",
    country: "Indonésie",
    title: "Le tempeh est ton meilleur ami",
    content: "À Bali, le tempeh est partout et pas cher. C'est une excellente source de protéines locales et c'est toujours vegan.",
    category: "tip",
  },
  {
    id: "t2",
    city_id: "1",
    country: "Indonésie",
    title: "'Vegetarian' inclut souvent l'œuf",
    content: "Quand un plat est marqué 'vegetarian' à Bali, il peut contenir des œufs. Précise bien 'no egg, no dairy' ou demande 'vegan'.",
    category: "trap",
  },
  // Athènes
  {
    id: "t3",
    city_id: "2",
    country: "Grèce",
    title: "Les mezze sont souvent veganisables",
    content: "Houmous, fava, dolmadakia (feuilles de vigne farcies au riz) et gigantes (haricots géants) sont naturellement vegan dans la cuisine grecque traditionnelle.",
    category: "tip",
  },
  {
    id: "t4",
    city_id: "2",
    country: "Grèce",
    title: "Attention au tzatziki et à la feta",
    content: "Les Grecs mettent de la feta et du tzatziki partout. Vérifie toujours que ton plat n'en contient pas, surtout dans les salades et les plats de légumes.",
    category: "trap",
  },
  // Lisbonne
  {
    id: "t5",
    city_id: "3",
    country: "Portugal",
    title: "Les pastéis de nata vegan existent !",
    content: "Plusieurs pâtisseries à Lisbonne proposent des pastéis de nata vegan. Cherche 'nata vegana' — ça vaut le détour.",
    category: "tip",
  },
  {
    id: "t6",
    city_id: "3",
    country: "Portugal",
    title: "Le bacalhau est PARTOUT",
    content: "La morue (bacalhau) est l'ingrédient national. Dans les restaurants traditionnels, vérifie bien que les plats de légumes ne sont pas cuisinés avec du bouillon de poisson.",
    category: "trap",
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getPlacesByCity(cityId: string): Place[] {
  return places.filter((p) => p.city_id === cityId);
}

export function getPlaceById(id: string): Place | undefined {
  return places.find((p) => p.id === id);
}

export function getTipsByCity(cityId: string): Tip[] {
  return tips.filter((t) => t.city_id === cityId);
}
