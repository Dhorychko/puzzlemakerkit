// Renders a Page as SVG. Used for the live preview; the PDF is drawn from the same ops.
import type { Page } from "@/lib/draw";

const FAMILY = {
  sans: "Helvetica, Arial, sans-serif",
  sansBold: "Helvetica, Arial, sans-serif",
  cursive: "PPKCursive, cursive",
  print: "PPKPrint, sans-serif",
};

export default function Preview({ page, label, className }: { page: Page; label: string; className?: string }) {
  return (
    <svg className={className ?? "sheet"} viewBox={`0 0 ${page.w} ${page.h}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid meet"
      style={className ? undefined : { aspectRatio: `${page.w} / ${page.h}`, maxWidth: `calc(var(--sheet-h, 78vh) * ${(page.w / page.h).toFixed(4)})` }}>
      <rect x="0" y="0" width={page.w} height={page.h} fill="#fff" />
      {page.ops.map((o, i) => {
        if (o.t === "line") return <line key={i} x1={o.x1} y1={o.y1} x2={o.x2} y2={o.y2} stroke={o.c} strokeWidth={o.w} strokeDasharray={o.dash?.join(" ")} />;
        if (o.t === "rect") return <rect key={i} x={o.x} y={o.y} width={o.w} height={o.h} rx={o.r} fill={o.fill ?? "none"} stroke={o.stroke} strokeWidth={o.stroke ? (o.lw ?? 1) : undefined} />;
        if (o.t === "circle") return <circle key={i} cx={o.cx} cy={o.cy} r={o.r} fill={o.fill ?? "none"} stroke={o.stroke} strokeWidth={o.stroke ? (o.lw ?? 1) : undefined} />;
        return (
          <text key={i} x={o.x} y={o.y} fontSize={o.size} fill={o.c} fontFamily={FAMILY[o.font]} fontWeight={o.font === "sansBold" ? 700 : 400}
            textAnchor={o.align === "center" ? "middle" : o.align === "right" ? "end" : "start"} xmlSpace="preserve" style={{ fontKerning: "none", fontVariantLigatures: "none", whiteSpace: "pre" }}>
            {o.s}
          </text>
        );
      })}
    </svg>
  );
}
