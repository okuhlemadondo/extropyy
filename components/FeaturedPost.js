import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FeaturedPost({ post }) {
    if (!post) return null;

    const [isLargeScreen, setIsLargeScreen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Default image for posts with missing images
    const defaultImage = '/images/default-featured.jpg';

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

    // Handle both old and new post formats
    const postData = post.frontMatter || post;

    return (
        <div className="featured-post rounded-3xl overflow-hidden mb-16" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="relative">
                <img
                    src={imageError ? defaultImage : postData.image || defaultImage}
                    alt={postData.title || 'Featured article'}
                    className="w-full object-cover"
                    onError={() => setImageError(true)}
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
                    <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium relative">
                        {postData.category || 'Uncategorized'}
                    </span>

                    <h2 className="featured-title heading-font text-2xl md:text-5xl font-bold mt-4 relative">
                        {postData.title || 'Untitled Article'}
                    </h2>

                    <p className="featured-excerpt mt-4 text-lg opacity-90 max-w-3xl relative">
                        {postData.excerpt || 'No excerpt available'}
                    </p>

                    <Link
                        href={`/articles/${post.slug}`}
                        className="inline-block mt-4 md:mt-6 px-6 py-2 md:py-3 bg-white text-black rounded-full font-medium transition hover:bg-gray-200 relative"
                    >
                        Read Article
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .featured-title,
                .featured-excerpt {
                    color: #000; /* Black text by default on mobile in light mode */
                }
                
                :global(.dark-mode) .featured-title,
                :global(.dark-mode) .featured-excerpt {
                    color: #fff; /* White text in dark mode */
                }
                
                @media (min-width: 1024px) {
                    .featured-title, 
                    .featured-excerpt {
                        color: #fff !important; /* Always white on large screens due to gradient */
                    }
                }
            `}</style>
        </div>
    );
}