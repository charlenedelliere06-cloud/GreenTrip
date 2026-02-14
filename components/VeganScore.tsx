interface VeganScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export function VeganScore({ score, size = "md" }: VeganScoreProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <span className={`${sizeClasses[size]} leading-none`} title={`Score vegan : ${score}/5`}>
      {"🌱".repeat(score)}
      {"🌱".repeat(5 - score).split("🌱").join("")}
      <span className="opacity-20">{"🌱".repeat(5 - score)}</span>
    </span>
  );
}
