/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'sage': '#9AB593',
                'terra': '#E07A5F',
                'bone': '#F7F5F0',
                'forest': '#1A3A2A',
                'forest-hover': '#11281D'
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            backgroundImage: {
                'organic-pattern': "radial-gradient(circle at 10% 20%, rgba(154, 181, 147, 0.15), transparent 30%), radial-gradient(circle at 90% 80%, rgba(224, 122, 95, 0.1), transparent 30%)"
            }
        },
    },
    plugins: [],
}
