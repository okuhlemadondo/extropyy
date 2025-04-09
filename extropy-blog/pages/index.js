// pages/index.js
import { useEffect } from 'react';
import { getSortedPosts } from '../lib/articles';
import FeaturedPost from '../components/FeaturedPost';
import ArticleCard from '../components/ArticleCard';
import { gsap } from 'gsap';

export async function getStaticProps() {
    const posts = getSortedPosts();
    return { props: { posts } };
}

export default function Home({ posts }) {
    const featuredPost = posts.find((p) => p.featured) || posts[0];
    const recentPosts = posts.filter((p) => p.id !== featuredPost.id).slice(0, 3);

    return (
        <section className="mb-20">
            <div className="text-center mb-16 fade-in">
                <h1 className="heading-font text-5xl md:text-7xl font-bold mb-4">EXTROPY</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-70">
                    Expanding the boundaries of thought through philosophy, science, technology, and personal reflection.
                </p>
            </div>
            <FeaturedPost post={featuredPost} />
            <div className="mb-12 fade-in">
                <h2 className="heading-font text-3xl font-bold mb-8">Recent Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recentPosts.map((post, index) => (
                        <ArticleCard key={post.id} article={post} data-delay={index * 150} />
                    ))}
                </div>
            </div>
        </section>
    );
}