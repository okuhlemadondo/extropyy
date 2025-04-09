import Link from 'next/link';
import { formatDate } from '../lib/date';

export default function ArticleCard({ article, dataDelay }) {
    return (
        <div
            className="article-card stagger-item rounded-3xl overflow-hidden"
            style={{
                backgroundColor: 'var(--card-bg)',
                opacity: 0,
                transform: 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
                transitionDelay: `${dataDelay || 0}ms`
            }}
        >
            <div className="relative h-48">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
                <span className="text-sm font-medium opacity-70">{article.category}</span>
                <h3 className="heading-font text-xl font-bold mt-2">{article.title}</h3>
                <p className="mt-3 text-sm opacity-70">{formatDate(article.date)}</p>
                <p className="mt-3">{article.excerpt}</p>
                <Link href={`/articles/${article.id}`} className="block mt-4 text-sm font-medium">Read More →</Link>
            </div>
        </div>
    );
}