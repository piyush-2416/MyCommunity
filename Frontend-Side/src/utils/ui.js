import { useEffect, useState } from "react";

const PAIRS = [
  ["#14b8a6", "#10b981"],
  ["#0ea5e9", "#6366f1"],
  ["#f43f5e", "#fb923c"],
  ["#8b5cf6", "#d946ef"],
  ["#f59e0b", "#f97316"],
  ["#06b6d4", "#3b82f6"],
];

// naam se hamesha same gradient milta hai
export const gradientFor = (s = "") => {
  const [a, b] = PAIRS[[...s].reduce((x, c) => x + c.charCodeAt(0), 0) % PAIRS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
};

export const daysSince = (d) =>
  Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000));

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const joinedLabel = (d) => {
  const n = daysSince(d);
  if (n === 0) return "Aaj join hua";
  if (n === 1) return "Kal join hua";
  if (n < 30) return `${n} din pehle`;
  return fmtDate(d);
};

export const fmtSize = (b) => {
  if (!b) return "";
  if (b >= 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(b / 1024))} KB`;
};

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

export const fileKind = (name = "") => {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return { label: "PDF", bg: "#fee2e2", color: "#dc2626" };
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return { label: "IMG", bg: "#e0f2fe", color: "#0284c7" };
  if (["doc", "docx"].includes(ext)) return { label: "DOC", bg: "#e0e7ff", color: "#4f46e5" };
  return { label: ext.slice(0, 4).toUpperCase() || "FILE", bg: "#f1f5f9", color: "#475569" };
};

// numbers 0 se target tak chadhte hain
export function useCountUp(target = 0, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      start ??= t;
      const p = Math.min((t - start) / ms, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}