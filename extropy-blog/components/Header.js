import { useState } from 'react';
import Link from 'next/link';

export default function Header({ onSearch, darkMode, toggleDarkMode }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchTerm);
        }
    };

    return (
        <header className="py-6 px-6 md:px-12 border-b border-gray-800 dark:border-gray-200 sticky top-0 bg-opacity-80 backdrop-filter backdrop-blur-lg z-10">
            <div className="nav-container flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center w-full md:w-auto justify-between">
                    <Link href="/" className="logo-container">
                        <h1 className="heading-font text-3xl font-bold tracking-tighter">EXTROPY</h1>
                    </Link>
                    <div className="md:hidden">
                        <label className="toggle-switch">
                            <input type="checkbox" id="mobile-dark-mode-toggle" checked={darkMode} onChange={toggleDarkMode} />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <nav className="w-full md:w-auto mt-4 md:mt-0">
                    <ul className="flex space-x-8 justify-center">
                        <li><Link href="/" className="nav-link text-lg">Home</Link></li>
                        <li><Link href="/articles" className="nav-link text-lg">Articles</Link></li>
                        <li><Link href="/about" className="nav-link text-lg">About</Link></li>
                    </ul>
                </nav>

                <div className="search-container mt-4 md:mt-0 w-full md:w-64">
                    <div className="relative">
                        <input
                            type="text"
                            id="search-input"
                            placeholder="Search articles..."
                            className="search-input w-full py-2 px-4 rounded-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleSearch}
                        />
                        <div className="absolute right-3 top-2.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block ml-6">
                    <label className="toggle-switch">
                        <input type="checkbox" id="dark-mode-toggle" checked={darkMode} onChange={toggleDarkMode} />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </header>
    );
}