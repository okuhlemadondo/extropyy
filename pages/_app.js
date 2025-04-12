import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import CanvasBackground from '../components/CanvasBackground';
import LoadingScreen from '../components/LoadingScreen';
import '../app/globals.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import '../styles/katex.css';
import '../styles/code-blocks.css';
import '../styles/mdx.css';

function MyApp({ Component, pageProps }) {
    const [darkMode, setDarkMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const headerRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        document.body.classList.add(darkMode ? 'dark-mode' : 'light-mode');
        document.body.classList.remove(darkMode ? 'light-mode' : 'dark-mode');
    }, [darkMode]);

    // Effect to measure header height and update on resize
    useEffect(() => {
        if (!headerRef.current) return;

        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        // Initial measurement
        updateHeaderHeight();

        // Update on resize
        window.addEventListener('resize', updateHeaderHeight);

        return () => window.removeEventListener('resize', updateHeaderHeight);
    }, []);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const handleSearch = (term) => {
        if (term.trim()) {
            // Navigate to the articles page with the search term as a query parameter
            router.push({
                pathname: '/articles',
                query: { search: term.trim() }
            });
        }
    };

    return (
        <>
            <Cursor />
            <LoadingScreen isLoading={isLoading} />
            <CanvasBackground />
            <Header
                ref={headerRef}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                onSearch={handleSearch}
            />
            <main
                id="page-content"
                className="container mx-auto px-6 py-12"
                style={{ paddingTop: `calc(${headerHeight}px + 3rem)` }}
            >
                <Component {...pageProps} setIsLoading={setIsLoading} />
            </main>
            <Footer />
        </>
    );
}

export default MyApp;