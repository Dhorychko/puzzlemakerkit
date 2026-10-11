"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Page } from "@/lib/draw";
import { downloadPdf } from "@/lib/pdf";
import Preview from "./Preview";

export default function ToolShell({ pages, filename, title, children, note }: {
  pages: Page[]; filename: string; title: string; children: ReactNode; note?: ReactNode;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [idx, setIdx] = useState(0);
  const [printing, setPrinting] = useState(false);
  // Render the full print copy only while printing, so the page stays light.
  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    const t = window.setTimeout(() => window.print(), 50);
    return () => { window.clearTimeout(t); window.removeEventListener("afterprint", done); };
  }, [printing]);
  const i = Math.min(idx, Math.max(0, pages.length - 1));
  const page = pages[i];

  const pdf = async () => {
    setBusy(true); setErr("");
    try { await downloadPdf(pages, filename, title); }
    catch { setErr("The PDF couldn't be created. Try again, or use Print and choose “Save as PDF”."); }
    finally { setBusy(false); }
  };

  return (
    <div className="tool">
      <div className="controls">
        {children}
        {/* Phones: the preview sits above the settings, so keep the download within reach while changing them. */}
        <div className="dl-sticky">
          <button type="button" className="btn-pdf" onClick={pdf} disabled={busy}>{busy ? "Making PDF…" : "Download PDF"}</button>
          <a className="btn-ghost" href="#preview">↑ Preview</a>
        </div>
      </div>
      <div className="preview-col" id="preview">
        <div className="actions">
          <button type="button" className="btn-pdf" onClick={pdf} disabled={busy}>{busy ? "Making PDF…" : "Download PDF"}</button>
          <button type="button" className="btn-ghost" onClick={() => setPrinting(true)}>Print</button>
        </div>
        {err && <p className="warn" role="alert">{err}</p>}
        {page && <div className="sheet-wrap"><Preview page={page} label={`Preview of ${title}, page ${i + 1}`} /></div>}
        <div className="pager">
          {pages.length > 1 ? (
            <>
              <button type="button" className="btn-ghost sm" onClick={() => setIdx(Math.max(0, i - 1))} disabled={i === 0} aria-label="Previous page">‹</button>
              <span>Page {i + 1} of {pages.length}</span>
              <button type="button" className="btn-ghost sm" onClick={() => setIdx(Math.min(pages.length - 1, i + 1))} disabled={i === pages.length - 1} aria-label="Next page">›</button>
            </>
          ) : <span>1 page{page ? ` · ${Math.round((page.w / 72) * 10) / 10} × ${Math.round((page.h / 72) * 10) / 10} in` : ""}</span>}
        </div>
        {note && <p className="note">{note}</p>}
      </div>
      {/* Print copy: every page, one per sheet */}
      {printing && <div className="print-only" aria-hidden="true">
        {page && <style>{`@page { size: ${page.w}pt ${page.h}pt; margin: 0; }`}</style>}
        {pages.map((p, k) => <div className="print-page" key={k}><Preview page={p} label="" className="print-svg" /></div>)}
      </div>}
    </div>
  );
}
