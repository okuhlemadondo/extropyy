import Link from 'next/link';
import { formatDate } from '../lib/date';

export default function ArticleCard({ article }) {
    return (
        <div className="article-card stagger-item rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--card-bg)' }}>
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