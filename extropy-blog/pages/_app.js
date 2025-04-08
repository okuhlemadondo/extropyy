import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cursor from '../components/Cursor';
import CanvasBackground from '../components/CanvasBackground';
import LoadingScreen from '../components/LoadingScreen';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    const [darkMode, setDarkMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.body.classList.add(darkMode ? 'dark-mode' : 'light-mode');
        document.body.classList.remove(darkMode ? 'light-mode' : 'dark-mode');
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const handleSearch = (term) => {
        // Handle search logic (e.g., redirect to articles with query)
        console.log('Search:', term);
        // Here you could use useRouter to push the search term to the articles page with a query parameter
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