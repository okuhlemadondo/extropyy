import Link from 'next/link';

export default function FeaturedPost({ post }) {
    if (!post) return null;

    return (
        <div className="featured-post rounded-3xl overflow-hidden mb-16" style={{ backgroundColor: 'var(--card-bg)' }}>
            <div className="relative">
                <img src={post.image} alt={post.title} className="w-full h-[60vh] object-cover" />
                <div className="featured-content absolute bottom-0 left-0 p-8 w-full">
                    <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-medium">{post.category}</span>
                    <h2 className="heading-font text-3xl md:text-5xl font-bold mt-4 text-white">{post.title}</h2>
                    <p className="mt-4 text-white text-lg opacity-90 max-w-3xl">{post.excerpt}</p>
                    <Link href={`/articles/${post.id}`} className="inline-block mt-6 px-6 py-3 bg-white text-black rounded-full font-medium transition hover:bg-gray-200">
                        Read Article
                    </Link>
                </div>
            </div>
        </div>
    );
}