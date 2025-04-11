import { useEffect } from 'react';
import { getSortedPosts } from '../lib/articles';
import FeaturedPost from '../components/FeaturedPost';
import ArticleCard from '../components/ArticleCard';
import { gsap } from 'gsap';

export default function Home({ posts, setIsLoading }) {
    // Handle both frontMatter format and direct properties
    const processedPosts = posts.map(post => {
        // If post has frontMatter, use it, otherwise use the post directly
        const postData = post.frontMatter || post;
        return {
            ...post,
            title: postData.title,
            date: postData.date,
            category: postData.category || 'Uncategorized',
            image: postData.image,
            excerpt: postData.excerpt,
            slug: post.slug || generateSlug(postData.title),
            featured: postData.featured
        };
    });

    const featuredPost = processedPosts.find((p) => p.featured) || processedPosts[0];
    const recentPosts = processedPosts
        .filter((p) => p.slug !== featuredPost.slug)
        .slice(0, 3);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            initAnimations();
        }, 500);
    }, [setIsLoading]);

    function initAnimations() {
        // Fade in animations
        const fadeElements = document.querySelectorAll('.fade-in');

        fadeElements.forEach(element => {
            setTimeout(() => {
                element.classList.add('visible');
            }, 100);
        });

        // Staggered animations with GSAP
        const staggerItems = document.querySelectorAll('.stagger-item');

        staggerItems.forEach(item => {
            gsap.fromTo(
                item,
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: (item.getAttribute('data-delay') || 0) / 1000,
                    ease: 'power2.out'
                }
            );
        });
    }

    // Helper function to generate a slug if needed
    function generateSlug(text) {
        if (!text) return '';
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim();                  // Remove whitespace from ends
    }

    return (
        <section className="mb-20">
            <div className="text-center mb-16 fade-in">
                <h1 className="heading-font text-5xl md:text-7xl font-bold mb-4">EXTROPY</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-70">
                    "Ideas are the only structures that outlive stone."
                </p>
            </div>
            <FeaturedPost post={featuredPost} />
            <div className="mb-12 fade-in">
                <h2 className="heading-font text-3xl font-bold mb-8">Recent Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                        <ArticleCard key={post.slug} article={post} dataDelay={index * 150} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export async function getStaticProps() {
    // Get posts from both the old and new systems
    const posts = getSortedPosts();

    // Debug if any posts are missing required fields
    posts.forEach(post => {
        const data = post.frontMatter || post;
        if (!data.image) {
            console.warn(`Post "${post.slug || post.id}" is missing an image`);
        }
        if (!data.date) {
            console.warn(`Post "${post.slug || post.id}" is missing a date`);
        }
    });

    return { props: { posts } };
}