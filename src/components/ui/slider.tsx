import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  min = 0,
  max = 1,
  step = 0.01,
  value,
  onValueChange,
  "aria-label": ariaLabel,
}: {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number[];
  onValueChange: (value: number[]) => void;
  "aria-label"?: string;
}) {
  const current = value[0] ?? min;
  const pct = ((current - min) / (max - min)) * 100;

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      aria-label={ariaLabel}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      className={cn("range", className)}
      style={{ "--pct": `${pct}%` } as CSSProperties}
    />
  );
}
