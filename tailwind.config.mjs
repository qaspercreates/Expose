/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'SF Pro Text', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        bg: "#0b0b0f",
        card: "#12121a",
        soft: "#1a1a24",
        accent: "#7c3aed"
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.35)"
      }
    }
  },
  plugins: []
};
