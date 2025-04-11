import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FeaturedPost({ post }) {
    if (!post) return null;
    const [isLargeScreen, setIsLargeScreen] = useState(false);
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

    return (
        <div className="featured-post rounded-3xl overflow-hidden mb-16" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="relative">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full object-cover"
                    style={{
                        height: isLargeScreen ? '60vh' : '35vh'
                    }}
                />

                <div
                    className={`
                        ${isLargeScreen ? 'absolute bottom-0 left-0' : 'relative'} 
                        p-6 md:p-8 w-full
                        ${isLargeScreen ? 'bg-gradient-to-t from-black/80 to-transparent' : ''}
                    `}
                    style={{ zIndex: 10 }}
                >
                    <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium relative">{post.category}</span>
                    <h2 className={`heading-font text-2xl md:text-5xl font-bold mt-4 ${isLargeScreen ? 'text-white' : 'text-black dark:text-white'} relative`}>{post.title}</h2>
                    <p className={`mt-4 text-lg opacity-90 max-w-3xl ${isLargeScreen ? 'text-white' : 'text-black dark:text-white'} relative`}>{post.excerpt}</p>
                    <Link
                        href={`/articles/${post.id}`}
                        className="inline-block mt-4 md:mt-6 px-6 py-2 md:py-3 bg-white text-black rounded-full font-medium transition hover:bg-gray-200 relative"
                    >
                        Read Article
                    </Link>
                </div>
            </div>
        </div>
    );
}