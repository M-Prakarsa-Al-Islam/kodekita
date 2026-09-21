import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3F5F5",
        ink: "#171B24",
        "ink-soft": "#4A5568",
        sun: "#F2A93B",
        "sun-dark": "#D6900F",
        code: "#0F8A6B",
        "code-bg": "#E4F5EF",
        line: "#E1E4E8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
