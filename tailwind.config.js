/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}", // This line is ESSENTIAL
        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./styles/**/*.{css,js,ts,jsx,tsx,mdx}",
        "./styles/**/*.css",
        "./pages/articles/**/*.{css,js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
};