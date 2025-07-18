import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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

    // Call filterAndSortPosts when category, sortOrder, or searchTerm changes
    useEffect(() => {
        filterAndSortPosts();
    }, [category, sortOrder, searchTerm]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);

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
            console.log('Available categories:', [...new Set(posts.map(p => p.frontMatter?.category ? p.frontMatter.category.trim() : ''))].filter(Boolean));
            console.log('Filtered posts count:', filteredPosts.length);
            console.log('Filtered posts:', filteredPosts.map(p => ({ slug: p.slug, title: p.frontMatter?.title, category: p.frontMatter?.category })));
        }, 500);
    }, [setIsLoading, category, sortOrder, searchTerm, filteredPosts.length, posts]);

    const filterAndSortPosts = () => {
        let result = [...posts];

        if (category !== 'all') {
            // Normalize category comparison to handle case sensitivity and whitespace
            result = result.filter((p) => {
                // Normalize both the post category and the selected category
                const postCategory = p.frontMatter?.category ? p.frontMatter.category.trim().toLowerCase() : '';
                const selectedCategory = category.trim().toLowerCase();

                // Debug category comparison
                console.log(`Comparing post "${p.frontMatter?.title}" category "${postCategory}" with selected category "${selectedCategory}"`);

                return postCategory === selectedCategory;
            });
        }
        if (searchTerm) {
            result = result.filter((p) =>
                p.frontMatter?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.frontMatter?.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        result.sort((a, b) =>
            sortOrder === 'desc'
                ? new Date(b.frontMatter?.date) - new Date(a.frontMatter?.date)
                : new Date(a.frontMatter?.date) - new Date(b.frontMatter?.date)
        );
        setFilteredPosts(result);
    };

    const handleCategoryClick = (category) => {
        // Ensure category is a string and trim any whitespace
        const normalizedCategory = typeof category === 'string' ? category.trim() : 'all';
        console.log('Setting category to:', normalizedCategory);
        setCategory(normalizedCategory);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
    };


    return (
        <section className="mb-20">
            <div className="text-center mb-16 fade-in">
                <h1 className="heading-font text-5xl font-bold mb-4">Articles</h1>
                <p className="text-xl max-w-3xl mx-auto opacity-70">Ideas captured mid-flight, arranged for deeper reflection.</p>
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
                        {[...new Set(posts.map(p => p.frontMatter?.category ? p.frontMatter.category.trim() : ''))].filter(Boolean).map((cat) => (
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
                            <ArticleCard key={post.slug} article={post} dataDelay={index * 100} />
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
    try {
        // In Node.js environment, we need to use the fs module directly
        // Import fs and path dynamically to keep them server-side only
        const fs = await import('fs');
        const path = await import('path');
        const matter = await import('gray-matter');

        const postsDirectory = path.default.join(process.cwd(), 'posts');
        const filenames = fs.default.readdirSync(postsDirectory);

        const posts = filenames
            .filter(filename => filename.endsWith('.md'))
            .map(filename => {
                const slug = filename.replace(/\.md$/, '');
                const fullPath = path.default.join(postsDirectory, filename);
                const fileContents = fs.default.readFileSync(fullPath, 'utf8');
                const { data } = matter.default(fileContents);

                return {
                    slug,
                    frontMatter: data,
                };
            });

        return {
            props: { posts },
            // Revalidate every hour
            revalidate: 3600
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            props: { posts: [] },
            revalidate: 60 // Try again sooner if there was an error
        };
    }
}