import { getAllPosts, getPostById } from '../../lib/articles';
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

            // Add visible class to stagger-item elements
            const staggerItems = document.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
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
                        <ArticleCard key={related.id} article={related} dataDelay={index * 150} />
                    ))}
                </div>
            </div>
        </article>
    );
}

export async function getStaticPaths() {
    const posts = getAllPosts();

    const paths = posts.map((post) => ({ params: { id: post.id.toString() } }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const post = getPostById(params.id);

    if (!post) {
        return {
            notFound: true, // This is crucial for handling non-existent articles
        };
    }
    const allPosts = getAllPosts();
    const relatedPosts = allPosts
        .filter((p) => p.id !== post.id && p.category === post.category)
        .slice(0, 2);

    return { props: { post, relatedPosts } };
}