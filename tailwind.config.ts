import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Deep Navy (slate-900)
                surface: "#1e293b",    // Lighter Navy (slate-800)
                primary: "#38bdf8",    // Sky blue for accents
                secondary: "#94a3b8",  // Slate 400 for secondary text
                text: "#f8fafc",       // Slate 50 for main text
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            backgroundImage: {
                'none': 'none',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
