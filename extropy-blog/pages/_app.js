import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import CanvasBackground from '../components/CanvasBackground';
import LoadingScreen from '../components/LoadingScreen';
import '../app/globals.css';
import '../styles/katex.css';

function MyApp({ Component, pageProps }) {
    const [darkMode, setDarkMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        document.body.classList.add(darkMode ? 'dark-mode' : 'light-mode');
        document.body.classList.remove(darkMode ? 'light-mode' : 'dark-mode');
    }, [darkMode]);

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
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onSearch={handleSearch} />
            <main id="page-content" className="container mx-auto px-6 py-12">
                <Component {...pageProps} setIsLoading={setIsLoading} />
            </main>
            <Footer />
        </>
    );
}

export default MyApp;