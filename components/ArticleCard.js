import Link from 'next/link';
import { formatDate } from '../lib/date';
import { useEffect, useRef, useState } from 'react';

export default function ArticleCard({ article, dataDelay }) {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Ensure visibility with useEffect
    useEffect(() => {
        // Initial render delay to ensure animation works
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500 + (dataDelay || 0));

        return () => clearTimeout(timer);
    }, [dataDelay]);

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
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </Link>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm font-medium opacity-70">{article.category}</span>
                <Link href={`/articles/${article.slug}`}>
                    <h3 className="heading-font text-xl font-bold mt-2 hover:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300">{article.title}</h3>
                </Link>
                <p className="mt-3 text-sm opacity-70">{formatDate(article.date)}</p>
                <p className="mt-3 flex-grow">{article.excerpt}</p>
                <div className="mt-auto pt-4">
                    <Link href={`/articles/${article.slug}`} className="inline-flex items-center text-sm font-medium hover:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300">
                        Read More <span className="ml-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}