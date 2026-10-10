import localFont from "next/font/local";

export const display = localFont({
  src: [{ path: "./fonts/fredoka-latin-600-normal.woff2", weight: "600", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial Rounded MT Bold", "Arial", "sans-serif"],
});
