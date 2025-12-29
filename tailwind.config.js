/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A90E2",
          hover: "#357ABD",
        },
        secondary: {
          DEFAULT: "#7B68EE",
        },
        danger: {
          DEFAULT: "#E74C3C",
          hover: "#C0392B",
        },
        warning: {
          DEFAULT: "#F39C12",
        },
        "bg-light": "#e9eef4",
        "bg-dark": "#000000",
        "card-light": "#ffffff",
        "card-dark": "#151515",
      },
    },
  },
  plugins: [],
};
