"use client";

import type { ReactNode } from "react";

export const num = (s: string) => {
  const n = parseFloat(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export function Num({ id, label, value, onChange, unit, help, step = "any", min, max }: {
  id: string; label: string; value: string; onChange: (v: string) => void; unit?: string; help?: string; step?: string | number; min?: number; max?: number;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <span className="with-unit">
        <input id={id} type="number" inputMode="decimal" step={step} min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} onFocus={(e) => e.target.select()} />
        {unit && <span className="unit">{unit}</span>}
      </span>
      {help && <span className="help">{help}</span>}
    </label>
  );
}

export function Select<T extends string>({ id, label, value, onChange, options, help }: {
  id: string; label: string; value: T; onChange: (v: T) => void; options: [T, string][]; help?: string;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      {help && <span className="help">{help}</span>}
    </label>
  );
}

export function Seg<T extends string>({ name, value, onChange, options, label }: {
  name: string; value: T; onChange: (v: T) => void; options: [T, string][]; label: string;
}) {
  return (
    <div className="field">
      <span>{label}</span>
      <span className="seg" role="radiogroup" aria-label={label}>
        {options.map(([v, l]) => (
          <label key={v}><input type="radio" name={name} checked={value === v} onChange={() => onChange(v)} />{l}</label>
        ))}
      </span>
    </div>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label className="check"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>;
}

export function Text({ id, label, value, onChange, placeholder, help, rows }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; help?: string; rows?: number;
}) {
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {rows ? <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input id={id} type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
      {help && <span className="help">{help}</span>}
    </label>
  );
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return <fieldset className="group"><legend>{title}</legend>{children}</fieldset>;
}
