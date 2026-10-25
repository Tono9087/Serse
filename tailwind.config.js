/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-950": "#240046",
        "brand-900": "#3C096C",
        "brand-800": "#4D1D96",
        "brand-700": "#6D28D9",
        "brand-500": "#9D4EDD",
        lavender: "#F4F1FF",
        mist: "#F3F3F3",
        line: "#C9D1D9",
        ink: "#1B1F23",
        muted: "#5B6773",
        whatsapp: "#25D366",
        success: "#2E7D32",
        danger: "#C62828",
        white: "#FFFFFF",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
