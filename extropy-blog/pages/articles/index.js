import { useState, useEffect } from 'react';
import { getAllPosts } from '../../lib/articles';
import ArticleCard from '../../components/ArticleCard';

export default function Articles({ posts, setIsLoading }) {
    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [category, setCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            filterAndSortPosts();
        }, 500);
    }, [category, sortOrder, searchTerm, setIsLoading]);

    const filterAndSortPosts = () => {
        let result = [...posts];

        if (category !== 'all') {
            result = result.filter((p) => p.category === category);
        }
        if (searchTerm) {
            result = result.filter((p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        result.sort((a, b) =>
            sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
        );
        setFilteredPosts(result);
    };

    const handleCategoryClick = (category) => {
        setCategory(category);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };


    return (
        <section className="mb-20">
            <div className="text-center mb-16 fade-in">
                <h1 className="heading-font text-5xl font-bold mb-4">Articles</h1>
                <p className="text-xl max-w-3xl mx-auto opacity-70">Explore the full collection of articles.</p>
            </div>
            <div className="mb-12 fade-in">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            className={`category-filter px-4 py-2 rounded-full text-sm font-medium transition ${category === 'all' ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black' : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'}`}
                            data-category="all"
                            onClick={() => handleCategoryClick('all')}
                        >
                            All
                        </button>
                        {[...new Set(posts.map(p => p.category))].map((cat) => (
                            <button
                                key={cat}
                                className={`category-filter px-4 py-2 rounded-full text-sm font-medium transition ${category === cat ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-black' : 'bg-gray-200 text-black dark:bg-gray-800 dark:text-white'}`}
                                data-category={cat}
                                onClick={() => handleCategoryClick(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Sort by:</label>
                        <select
                            id="sort-order"
                            className="bg-transparent border border-current rounded px-3 py-2 text-sm"
                            value={sortOrder}
                            onChange={handleSortChange}
                        >
                            <option value="desc">Newest first</option>
                            <option value="asc">Oldest first</option>
                        </select>
                    </div>
                </div>
                {/* Removed the search bar as its handled in the header */}
                <div id="articles-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <ArticleCard key={post.id} article={post} data-delay={index * 100} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export async function getStaticProps() {
    const posts = getAllPosts();
    return { props: { posts } };
}