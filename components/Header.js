import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header({ onSearch, darkMode, toggleDarkMode }) {
    const [searchTerm, setSearchTerm] = useState('');
    // Variable for the left margin of navigation links - 2rem = 32px
    const navLeftMargin = '15vw';
    const [isLargeScreen, setIsLargeScreen] = useState(false);

    // Effect to detect screen size
    useEffect(() => {
        // Check initial screen size
        setIsLargeScreen(window.innerWidth > 1023);

        // Update on resize
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth > 1023);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchTerm);
        }
    };

    const handleSearchClick = () => {
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <header className="py-6 px-6 md:px-12 border-b border-gray-800 dark:border-gray-200 sticky top-0 bg-opacity-80 backdrop-filter backdrop-blur-lg z-15">
            <div className="flex flex-col w-full">
                {/* Main row with logo, nav, and dark mode toggle */}
                <div className="flex items-center justify-between w-full">
                    {/* Left section: Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="logo-container">
                            <h1 className="heading-font text-3xl font-bold tracking-tighter">EXTROPY</h1>
                        </Link>
                    </div>

                    {/* Center section: Navigation - centered with mx-auto */}
                    <nav className="hidden md:block mx-auto">
                        <ul className="flex space-x-8" style={isLargeScreen ? { marginLeft: navLeftMargin } : {}}>
                            <li><Link href="/" className="nav-link text-lg">Home</Link></li>
                            <li><Link href="/articles" className="nav-link text-lg">Articles</Link></li>
                            <li><Link href="/about" className="nav-link text-lg">About</Link></li>
                        </ul>
                    </nav>

                    {/* Right section: Dark mode toggle and Search (swapped) */}
                    <div className="flex items-center space-x-4">
                        {/* Dark mode toggle moved left - visible on all non-mobile screens */}
                        <label className="toggle-switch hidden md:block">
                            <input type="checkbox" id="dark-mode-toggle" checked={darkMode} onChange={toggleDarkMode} />
                            <span className="toggle-slider"></span>
                        </label>

                        {/* Search bar - visible above 1024px, hidden below */}
                        <div className="hidden lg:block w-64">
                            <div className="relative flex">
                                <input
                                    type="text"
                                    id="search-input"
                                    placeholder="Search articles..."
                                    className="search-input w-full py-2 px-4 rounded-l-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={handleSearch}
                                />
                                <button
                                    className={`px-4 py-2 rounded-r-full transition-colors ${darkMode
                                        ? 'bg-white text-black hover:bg-gray-100'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                    onClick={handleSearchClick}
                                    aria-label="Search"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Centered search bar for screens at 1024px and below, but still hide for mobile */}
                <div className="hidden md:block lg:hidden mt-4 mx-auto w-full max-w-md">
                    <div className="relative flex">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="search-input w-full py-2 px-4 rounded-l-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearch}
                        />
                        <button
                            className={`px-4 py-2 rounded-r-full transition-colors ${darkMode
                                ? 'bg-white text-black hover:bg-gray-100'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            onClick={handleSearchClick}
                            aria-label="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden w-full mt-4">
                    <nav className="mb-4">
                        <ul className="flex space-x-8 justify-center">
                            <li><Link href="/" className="nav-link text-lg">Home</Link></li>
                            <li><Link href="/articles" className="nav-link text-lg">Articles</Link></li>
                            <li><Link href="/about" className="nav-link text-lg">About</Link></li>
                        </ul>
                    </nav>
                    <div className="relative flex">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="search-input w-full py-2 px-4 rounded-l-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearch}
                        />
                        <button
                            className={`px-4 py-2 rounded-r-full transition-colors ${darkMode
                                ? 'bg-white text-black hover:bg-gray-100'
                                : 'bg-black text-white hover:bg-gray-800'
                                }`}
                            onClick={handleSearchClick}
                            aria-label="Search"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                        </button>
                    </div>
                    {/* Single dark mode toggle for mobile 
                    <div className="flex justify-center mt-4">
                        <label className="toggle-switch">
                            <input type="checkbox" id="dark-mode-toggle-mobile" checked={darkMode} onChange={toggleDarkMode} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div> */}
                </div>
            </div>
        </header>
    );
}