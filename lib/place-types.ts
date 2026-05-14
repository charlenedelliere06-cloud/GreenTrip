export const PLACE_TYPE_CONFIG: Record<
  string,
  { label: string; icon: string; color: string; pastelBg: string; pastelText: string }
> = {
  supermarket: {
    label: "Grande surface",
    icon: "🛒",
    color: "#FFADA0",
    pastelBg: "bg-[#FFF0EE]",
    pastelText: "text-[#C0524A]",
  },
  store: {
    label: "Magasin bio",
    icon: "🌿",
    color: "#A8D5B5",
    pastelBg: "bg-[#EBF7EF]",
    pastelText: "text-[#3A7A52]",
  },
  grocery: {
    label: "Épicerie de quartier",
    icon: "🧺",
    color: "#C3B1E1",
    pastelBg: "bg-[#F3EFFE]",
    pastelText: "text-[#6B4FA0]",
  },
  market: {
    label: "Marché / primeur",
    icon: "🥦",
    color: "#FFE0A0",
    pastelBg: "bg-[#FFF8E7]",
    pastelText: "text-[#9A6C00]",
  },
};

export type PlaceType = keyof typeof PLACE_TYPE_CONFIG;
