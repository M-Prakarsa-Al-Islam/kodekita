// Accessible progress bar (server-safe, no client JS). Colours come from the
// site palette: green fill on the neutral `line` track.
export default function ProgressBar({
  value,
  max,
  label,
  size = "md",
  className = "",
}: {
  value: number;
  max: number;
  label: string; // accessible name, e.g. "Progres Python Dasar"
  size?: "sm" | "md";
  className?: string;
}) {
  const safeMax = Math.max(max, 0);
  const clamped = safeMax === 0 ? 0 : Math.min(Math.max(value, 0), safeMax);
  const percent = safeMax === 0 ? 0 : Math.round((clamped / safeMax) * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={clamped}
      aria-valuetext={`${clamped} dari ${safeMax} selesai (${percent}%)`}
      className={`w-full overflow-hidden rounded-full bg-line ${
        size === "sm" ? "h-1.5" : "h-2.5"
      } ${className}`}
    >
      <div
        className="h-full rounded-full bg-code transition-[width] duration-500 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
