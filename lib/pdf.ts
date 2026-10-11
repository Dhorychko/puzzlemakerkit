// PDF export. jsPDF and the handwriting fonts are loaded only when someone clicks "Download PDF".
import { hex, type Page } from "./draw.ts";

const fontCache: Record<string, string> = {};
async function fontB64(name: "cursive" | "print"): Promise<string> {
  if (fontCache[name]) return fontCache[name];
  const buf = await (await fetch(`/fonts/${name}.ttf`)).arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return (fontCache[name] = btoa(bin));
}

export async function downloadPdf(pages: Page[], filename: string, title: string) {
  if (!pages.length) return;
  const { jsPDF } = await import("jspdf");
  const first = pages[0];
  const doc = new jsPDF({ unit: "pt", format: [first.w, first.h], orientation: first.w > first.h ? "landscape" : "portrait", compress: true });
  doc.setProperties({ title, creator: "PuzzleMakerKit (puzzlemakerkit.com)" });
  const used = new Set(pages.flatMap((p) => p.ops.filter((o) => o.t === "text").map((o) => (o as { font: string }).font)));
  for (const f of ["cursive", "print"] as const) {
    if (!used.has(f)) continue;
    doc.addFileToVFS(`${f}.ttf`, await fontB64(f));
    doc.addFont(`${f}.ttf`, f, "normal");
  }
  pages.forEach((p, i) => {
    if (i > 0) doc.addPage([p.w, p.h], p.w > p.h ? "landscape" : "portrait");
    for (const o of p.ops) {
      if (o.t === "line") {
        doc.setDrawColor(...hex(o.c)); doc.setLineWidth(o.w);
        doc.setLineDashPattern(o.dash ?? [], 0);
        doc.line(o.x1, o.y1, o.x2, o.y2);
        if (o.dash) doc.setLineDashPattern([], 0);
      } else if (o.t === "rect") {
        if (o.fill) doc.setFillColor(...hex(o.fill));
        if (o.stroke) { doc.setDrawColor(...hex(o.stroke)); doc.setLineWidth(o.lw ?? 1); }
        const style = o.fill && o.stroke ? "FD" : o.fill ? "F" : "S";
        if (o.r) doc.roundedRect(o.x, o.y, o.w, o.h, o.r, o.r, style); else doc.rect(o.x, o.y, o.w, o.h, style);
      } else if (o.t === "circle") {
        if (o.fill) doc.setFillColor(...hex(o.fill));
        if (o.stroke) { doc.setDrawColor(...hex(o.stroke)); doc.setLineWidth(o.lw ?? 1); }
        doc.circle(o.cx, o.cy, o.r, o.fill && o.stroke ? "FD" : o.fill ? "F" : "S");
      } else {
        const f = o.font === "sans" ? ["helvetica", "normal"] : o.font === "sansBold" ? ["helvetica", "bold"] : [o.font, "normal"];
        doc.setFont(f[0], f[1]); doc.setFontSize(o.size); doc.setTextColor(...hex(o.c));
        doc.text(o.s, o.x, o.y, { align: o.align ?? "left", baseline: "alphabetic" });
      }
    }
  });
  doc.save(filename);
}
