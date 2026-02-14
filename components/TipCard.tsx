import { Tip } from "@/lib/types";

interface TipCardProps {
  tip: Tip;
}

export function TipCard({ tip }: TipCardProps) {
  const isTrap = tip.category === "trap";

  return (
    <div
      className={`rounded-xl p-4 ${
        isTrap ? "bg-red-50 border border-red-100" : "bg-sage/5 border border-sage/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl shrink-0">{isTrap ? "\u26A0\uFE0F" : "\uD83D\uDCA1"}</span>
        <div>
          <h4 className="font-semibold text-sm text-forest">{tip.title}</h4>
          <p className="text-sm text-forest/70 mt-1">{tip.content}</p>
        </div>
      </div>
    </div>
  );
}
