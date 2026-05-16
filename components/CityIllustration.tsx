const PALETTES = [
  { a: "#3D6A45", b: "#1E3528" }, // vert sauge profond
  { a: "#2D4A6A", b: "#16253A" }, // bleu nuit
  { a: "#4A3D6A", b: "#251E35" }, // violet forêt
  { a: "#6A4A2D", b: "#3A2516" }, // ambre terreux
  { a: "#2D6A6A", b: "#163535" }, // teal océan
];

function slugToIndex(slug: string): number {
  return slug.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % PALETTES.length;
}

export function CityIllustration({ slug }: { slug: string }) {
  const { a, b } = PALETTES[slugToIndex(slug)];

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${a} 0%, ${b} 100%)` }}
    >
      {/* Cercles concentriques — référence à la localisation / carte */}
      <svg
        viewBox="0 0 200 200"
        className="absolute"
        style={{ width: "260px", height: "260px", bottom: "-60px", right: "-40px", opacity: 0.12 }}
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="30"  fill="none" stroke="white" strokeWidth="1" />
        <circle cx="100" cy="100" r="55"  fill="none" stroke="white" strokeWidth="1" />
        <circle cx="100" cy="100" r="82"  fill="none" stroke="white" strokeWidth="1" />
        <circle cx="100" cy="100" r="112" fill="none" stroke="white" strokeWidth="1" />
      </svg>

      {/* Point central */}
      <div
        className="absolute"
        style={{
          width: "8px",
          height: "8px",
          background: "white",
          borderRadius: "50%",
          bottom: "34px",
          right: "55px",
          opacity: 0.35,
        }}
      />
    </div>
  );
}
