// A tiny drawing model shared by the on-screen preview (SVG) and the PDF export (jsPDF).
// Units are PDF points (1/72 inch), origin top-left.
import metrics from "./fontMetrics.ts";

export type FontName = "sans" | "sansBold" | "cursive" | "print";
export type Op =
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; w: number; c: string; dash?: number[] }
  | { t: "rect"; x: number; y: number; w: number; h: number; stroke?: string; fill?: string; lw?: number; r?: number }
  | { t: "circle"; cx: number; cy: number; r: number; fill?: string; stroke?: string; lw?: number }
  | { t: "text"; x: number; y: number; s: string; size: number; font: FontName; c: string; align?: "left" | "center" | "right" };

export type Page = { w: number; h: number; ops: Op[] };

export const SIZES = {
  letter: { w: 612, h: 792, label: "US Letter (8.5 × 11 in)" },
  a4: { w: 595.28, h: 841.89, label: "A4 (210 × 297 mm)" },
  legal: { w: 612, h: 1008, label: "US Legal (8.5 × 14 in)" },
} as const;
export type SizeKey = keyof typeof SIZES;

export const IN = 72;
export const MM = 72 / 25.4;

export function pageSize(size: SizeKey, landscape = false) {
  const s = SIZES[size];
  return landscape ? { w: s.h, h: s.w } : { w: s.w, h: s.h };
}

type M = { w: Record<string, number>; cap: number; x: number; asc: number; desc: number };
const FM = metrics as unknown as Record<"cursive" | "print", M>;

// Helvetica widths (PDF standard font) for the characters we use in headings/labels; average fallback.
const HELV: Record<string, number> = { " ": 0.278, "0": 0.556, "1": 0.556, "2": 0.556, "3": 0.556, "4": 0.556, "5": 0.556, "6": 0.556, "7": 0.556, "8": 0.556, "9": 0.556, "×": 0.584, "=": 0.584, "+": 0.584, "−": 0.584, "-": 0.333, ":": 0.278, ".": 0.278, ",": 0.278, "_": 0.556, "÷": 0.584 };

export function textWidth(s: string, font: FontName, size: number): number {
  if (font === "cursive" || font === "print") {
    const m = FM[font];
    let w = 0;
    for (const ch of s) w += m.w[ch] ?? 0.6;
    return w * size;
  }
  let w = 0;
  for (const ch of s) w += HELV[ch] ?? (ch === ch.toUpperCase() && /[A-Z]/.test(ch) ? 0.68 : 0.52);
  return w * size * (font === "sansBold" ? 1.05 : 1);
}

export const fontInfo = (f: "cursive" | "print") => FM[f];

/** Size a font so its capital letters fill `h` points. */
export const sizeForCap = (f: "cursive" | "print", h: number) => h / FM[f].cap;

export function hex(c: string): [number, number, number] {
  const v = c.replace("#", "");
  const n = parseInt(v.length === 3 ? v.split("").map((x) => x + x).join("") : v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Handwriting guide: top line, dashed midline, baseline, optional descender line. Returns the baseline y. */
export function guideLines(ops: Op[], x1: number, x2: number, top: number, h: number, opts: { color?: string; mid?: number; desc?: boolean; lw?: number } = {}) {
  const c = opts.color ?? "#7aa7d9";
  const lw = opts.lw ?? 0.8;
  const base = top + h;
  ops.push({ t: "line", x1, y1: top, x2, y2: top, w: lw, c });
  ops.push({ t: "line", x1, y1: top + h * (opts.mid ?? 0.5), x2, y2: top + h * (opts.mid ?? 0.5), w: lw * 0.8, c, dash: [4, 3] });
  ops.push({ t: "line", x1, y1: base, x2, y2: base, w: lw * 1.3, c: opts.color ? c : "#d8434a" });
  if (opts.desc) ops.push({ t: "line", x1, y1: base + h * 0.5, x2, y2: base + h * 0.5, w: lw * 0.6, c, dash: [1, 3] });
  return base;
}

/** Standard page header: Name / Date lines and an optional title. Returns the y where content can start. */
export function header(ops: Op[], w: number, margin: number, title?: string, nameDate = true): number {
  let y = margin;
  if (nameDate) {
    ops.push({ t: "text", x: margin, y: y + 12, s: "Name", size: 10, font: "sans", c: "#555555" });
    ops.push({ t: "line", x1: margin + 34, y1: y + 13, x2: w * 0.62, y2: y + 13, w: 0.6, c: "#888888" });
    ops.push({ t: "text", x: w * 0.66, y: y + 12, s: "Date", size: 10, font: "sans", c: "#555555" });
    ops.push({ t: "line", x1: w * 0.66 + 30, y1: y + 13, x2: w - margin, y2: y + 13, w: 0.6, c: "#888888" });
    y += 26;
  }
  if (title) {
    ops.push({ t: "text", x: w / 2, y: y + 16, s: title, size: 16, font: "sansBold", c: "#12343b", align: "center" });
    y += 30;
  }
  return y;
}

export function footer(ops: Op[], w: number, h: number, text = "puzzlemakerkit.com") {
  ops.push({ t: "text", x: w / 2, y: h - 16, s: text, size: 7, font: "sans", c: "#9aa3b2", align: "center" });
}
