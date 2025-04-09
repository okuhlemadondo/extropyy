import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllPosts } from '../../lib/articles';
import ArticleCard from '../../components/ArticleCard';

export default function Articles({ posts, setIsLoading }) {
    const router = useRouter();
    const { search } = router.query;

    const [filteredPosts, setFilteredPosts] = useState(posts);
    const [category, setCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');

    // Update searchTerm when the URL query parameter changes
    useEffect(() => {
        if (search) {
            setSearchTerm(search);
        }
    }, [search]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            filterAndSortPosts();

            // Add visible class to fade-in elements
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(element => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, 100);
            });

            // Add visible class to stagger-item elements
            const staggerItems = document.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Debug information
            console.log('Current category:', category);
            console.log('Available categories:', [...new Set(posts.map(p => p.category ? p.category.trim() : ''))].filter(Boolean));
            console.log('Filtered posts count:', filteredPosts.length);
            console.log('Filtered posts:', filteredPosts.map(p => ({ id: p.id, title: p.title, category: p.category })));
        }, 500);
    }, [category, sortOrder, searchTerm, setIsLoading, filteredPosts.length]);

    const filterAndSortPosts = () => {
        let result = [...posts];

        if (category !== 'all') {
            // Normalize category comparison to handle case sensitivity and whitespace
            result = result.filter((p) => {
                // Normalize both the post category and the selected category
                const postCategory = p.category ? p.category.trim().toLowerCase() : '';
                const selectedCategory = category.trim().toLowerCase();
                return postCategory === selectedCategory;
            });
        }
        if (searchTerm) {
            result = result.filter((p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.content && p.content.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        result.sort((a, b) =>
            sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
        );
        setFilteredPosts(result);
    };

    const handleCategoryClick = (category) => {
        // Ensure category is a string and trim any whitespace
        const normalizedCategory = typeof category === 'string' ? category.trim() : 'all';
        setCategory(normalizedCategory);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };


    return (
        <section className="mb-20">
            <div className="text-center mb-16 fade-in">
                <h1 className="heading-font text-5xl font-bold mb-4">Articles</h1>
                <p className="text-xl max-w-3xl mx-auto opacity-70">Explore the full collection of articles.</p>
                {searchTerm && (
                    <p className="mt-4 text-lg">
                        Showing results for: <span className="font-medium">{searchTerm}</span>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                router.push('/articles');
                            }}
                            className="ml-2 text-sm underline"
                        >
                            Clear search
                        </button>
                    </p>
                )}
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
                        {[...new Set(posts.map(p => p.category ? p.category.trim() : ''))].filter(Boolean).map((cat) => (
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
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <ArticleCard key={post.id} article={post} dataDelay={index * 100} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <p className="text-xl opacity-70">No articles found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export async function getStaticProps() {
    const posts = getAllPosts();
    return { props: { posts } };
}