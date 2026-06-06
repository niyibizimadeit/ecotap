import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "emerald-deep":   "#064E3B",
        "emerald-mid":    "#065F46",
        "emerald-bright": "#059669",
        "emerald-light":  "#D1FAE5",
        "emerald-pale":   "#ECFDF5",
        ivory:            "#FEFCE8",
        cream:            "#FEF9EF",
        "cream-dark":     "#F5EDD8",
        gold:             "#92400E",
        "gold-light":     "#D97706",
        "gold-pale":      "#FEF3C7",
        ink:              "#1C1917",
        "ink-mid":        "#44403C",
        "ink-light":      "#78716C",
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:  ["'DM Sans'", "system-ui", "sans-serif"],
        mono:  ["'DM Mono'", "monospace"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",   { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-xl":  ["3.75rem",  { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg":  ["3rem",     { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "display-md":  ["2.25rem",  { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm":  ["1.875rem", { lineHeight: "1.2",  letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        "card":    "0 1px 3px rgba(6,78,59,0.06), 0 4px 16px rgba(6,78,59,0.08)",
        "card-lg": "0 4px 8px rgba(6,78,59,0.06), 0 12px 40px rgba(6,78,59,0.12)",
        "card-xl": "0 8px 16px rgba(6,78,59,0.08), 0 24px 64px rgba(6,78,59,0.14)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-up":  "fadeUp 0.5s ease forwards",
        "fade-in":  "fadeIn 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
        "shimmer":  "shimmer 1.8s ease-in-out infinite",
        "spin":     "spin 1s linear infinite",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: "0", transform: "translateY(16px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        scaleIn: { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};

export default config;
