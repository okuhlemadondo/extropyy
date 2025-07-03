import Link from 'next/link';
import { formatDate } from '../lib/date';
import { useEffect, useRef, useState } from 'react';

export default function ArticleCard({ article, dataDelay }) {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Ensure visibility with useEffect
    useEffect(() => {
        // Initial render delay to ensure animation works
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500 + (dataDelay || 0));

        return () => clearTimeout(timer);
    }, [dataDelay]);

    // Handle both old and new post formats
    const postData = article.frontMatter || article;

    // Default image for posts with missing images
    const defaultImage = '/images/default-article.jpg';

    function formatDate(dateString) {
  const date = new Date(dateString);
  // Always use a fixed locale and options for SSR/CSR consistency
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

    return (
        <div
            ref={cardRef}
            className="article-card rounded-3xl overflow-hidden flex flex-col h-full"
            style={{
                backgroundColor: 'var(--card-bg)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${dataDelay || 0}ms`
            }}
        >
            <div className="relative h-48">
                <Link href={`/articles/${article.slug}`}>
                    <img
                        src={imageError ? defaultImage : postData.image || defaultImage}
                        alt={postData.title || 'Article image'}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                </Link>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm font-medium opacity-70">{postData.category || 'Uncategorized'}</span>
                <Link href={`/articles/${article.slug}`}>
                    <h3 className="heading-font text-xl font-bold mt-2 hover:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300">{postData.title || 'Untitled Article'}</h3>
                </Link>
                <p className="mt-3 text-sm opacity-70">{formatDate(postData.date)}</p>
                <p className="mt-3 flex-grow">{postData.excerpt || 'No excerpt available'}</p>
                <div className="mt-auto pt-4">
                    <Link href={`/articles/${article.slug}`} className="inline-flex items-center text-sm font-medium hover:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300">
                        Read More <span className="ml-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}