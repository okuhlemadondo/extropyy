import { getAllPosts, getPostBySlug } from '../../lib/articles';
import SimpleMarkdownRenderer from '../../components/SimpleMarkdownRenderer';
import ArticleCard from '../../components/ArticleCard';
import { formatDate } from '../../lib/date';
import { useEffect } from 'react';

export default function Article({ post, relatedPosts, setIsLoading }) {
    useEffect(() => {
        setIsLoading(true);
        const timeoutId = setTimeout(() => {
            setIsLoading(false);

            // Add visible class to fade-in elements
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(element => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, 100);
            });

            // We no longer need to handle stagger-item animations here
            // as they're handled directly in the ArticleCard component
        }, 500);

        return () => clearTimeout(timeoutId); // Cleanup on unmount
    }, [setIsLoading]);

    if (!post) {
        return <div>Article not found</div>; // Handle the case where the article doesn't exist
    }

    return (
        <article className="max-w-4xl mx-auto">
            <div className="mb-8 fade-in">
                <span className="text-sm font-medium opacity-70">{post.category}</span>
                <h1 className="heading-font text-4xl md:text-5xl font-bold mt-2">{post.title}</h1>
                <div className="flex items-center mt-8">
                    <img src={post.headshot} alt={post.author} className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                        <p className="font-medium">{post.author}</p>
                        <p className="text-sm opacity-70">{formatDate(post.date)}</p>
                    </div>
                </div>
            </div>
            <div className="mb-12 fade-in">
                <img src={post.image} alt={post.title} className="w-full h-[40vh] object-cover rounded-3xl" />
            </div>
            <SimpleMarkdownRenderer content={post.content} />
            <div className="mt-16 pt-8 border-t border-gray-800 dark:border-gray-200 fade-in">
                <h3 className="heading-font text-xl font-bold mb-6">Continue Reading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedPosts.map((related, index) => (
                        <ArticleCard
                            key={related.id}
                            article={related}
                            dataDelay={index * 150}
                        />
                    ))}
                </div>
            </div>
        </article>
    );
}

export async function getStaticPaths() {
    const posts = getAllPosts();

    const paths = posts.map((post) => ({ params: { slug: post.slug } }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const post = getPostBySlug(params.slug);

    if (!post) {
        return {
            notFound: true, // This is crucial for handling non-existent articles
        };
    }
    const allPosts = getAllPosts();

    // First try to get posts from the same category
    let sameCategoryPosts = allPosts
        .filter((p) => p.id !== post.id && p.category === post.category);

    let relatedPosts = [];

    // If we have enough posts in the same category, take 2
    if (sameCategoryPosts.length >= 2) {
        // Sort by a deterministic value that depends on the current post's ID
        // This ensures different recommendations for each post while being consistent
        const seed = parseInt(post.id, 10) || 0;
        sameCategoryPosts = sameCategoryPosts.sort((a, b) => {
            // Create a deterministic "score" for each post based on the current post ID
            const scoreA = (parseInt(a.id, 10) * seed) % 100;
            const scoreB = (parseInt(b.id, 10) * seed) % 100;
            return scoreA - scoreB;
        });

        relatedPosts = sameCategoryPosts.slice(0, 2);
    }
    // If we don't have enough posts in the same category
    else {
        // Add all the same category posts first
        relatedPosts = [...sameCategoryPosts];

        // Then fill the remaining slots with posts from other categories
        const otherPosts = allPosts
            .filter((p) => p.id !== post.id && p.category !== post.category)
            // Sort by date to get the most recent posts from other categories
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Add enough other posts to make the total up to 2
        const neededCount = 2 - relatedPosts.length;
        relatedPosts = [...relatedPosts, ...otherPosts.slice(0, neededCount)];
    }

    return { props: { post, relatedPosts } };
}