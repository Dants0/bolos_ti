import type { Config } from "tailwindcss";

export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Cobrir arquivos na pasta app
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // Cobrir arquivos na pasta pages (se usada)
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Cobrir componentes
  ],
  plugins: [],
} satisfies Config;