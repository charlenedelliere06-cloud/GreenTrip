import { Leaf } from "lucide-react"

interface VeganScoreProps {
  score: number
  maxScore?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function VeganScore({
  score,
  maxScore = 5,
  size = "md",
  showLabel = true,
}: VeganScoreProps) {
  const clampedScore = Math.min(Math.max(0, score), maxScore)

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  }

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  }

  return (
    <div
      className={`inline-flex items-center rounded-full bg-sage/15 text-sage-dark font-medium ${sizeClasses[size]}`}
    >
      <Leaf
        size={iconSizes[size]}
        className="text-sage-dark shrink-0"
        strokeWidth={2.5}
      />
      {showLabel && (
        <span className="text-sage-dark">Vegan</span>
      )}
      <span className="flex items-center">
        <span className="font-semibold">{clampedScore}</span>
        <span className="text-sage font-normal">/{maxScore}</span>
      </span>
    </div>
  )
}
