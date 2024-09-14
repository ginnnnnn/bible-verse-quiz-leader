import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "desktop-bg": `url(/bg/desktop.jpg)`,
        "mobile-bg": `url(/bg/mobile.jpg)`,
      },
    },
  },
  plugins: [],
};
export default config;
