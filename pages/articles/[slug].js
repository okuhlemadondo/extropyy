import { useEffect } from 'react';
import MDXRenderer from '../../components/MDXRenderer';
import ArticleCard from '../../components/ArticleCard';
import { formatDate } from '../../lib/date';

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
                <span className="text-sm font-medium opacity-70">{post.frontMatter.category}</span>
                <h1 className="heading-font text-4xl md:text-5xl font-bold mt-2">{post.frontMatter.title}</h1>
                <div className="flex items-center mt-8">
                    <img src={post.frontMatter.headshot} alt={post.frontMatter.author} className="w-12 h-12 rounded-full" />
                    <div className="ml-4">
                        <p className="font-medium">{post.frontMatter.author}</p>
                        <p className="text-sm opacity-70">{formatDate(post.frontMatter.date)}</p>
                    </div>
                </div>
            </div>
            <div className="mb-12 fade-in">
                <img src={post.frontMatter.image} alt={post.frontMatter.title} className="w-full h-[40vh] object-cover rounded-3xl" />
            </div>
            <MDXRenderer content={post.mdxSource} />
            <div className="mt-16 pt-8 border-t border-gray-800 dark:border-gray-200 fade-in">
                <h3 className="heading-font text-xl font-bold mb-6">Continue Reading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {relatedPosts.map((related, index) => (
                        <ArticleCard
                            key={related.slug}
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
    try {
        // Import fs and path dynamically to keep them server-side only
        const fs = await import('fs');
        const path = await import('path');
        const matter = await import('gray-matter');

        const postsDirectory = path.default.join(process.cwd(), 'posts');
        const filenames = fs.default.readdirSync(postsDirectory);

        // Helper function to generate a slug from title
        function generateSlug(text) {
            if (!text) return '';
            return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')     // Replace spaces with hyphens
                .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
                .trim();                  // Remove whitespace from ends
        }

        const paths = [];

        filenames
            .filter(filename => filename.endsWith('.md'))
            .forEach(filename => {
                // Add path for filename-based slug
                const filenameSlug = filename.replace(/\.md$/, '');
                paths.push({ params: { slug: filenameSlug } });

                // Also add path for title-based slug if it's different
                try {
                    const fullPath = path.default.join(postsDirectory, filename);
                    const fileContents = fs.default.readFileSync(fullPath, 'utf8');
                    const { data } = matter.default(fileContents);

                    if (data.title) {
                        const titleSlug = generateSlug(data.title);
                        // Only add if different from filename slug and not already in paths
                        if (titleSlug !== filenameSlug && !paths.some(p => p.params.slug === titleSlug)) {
                            paths.push({ params: { slug: titleSlug } });
                        }
                    }
                } catch (error) {
                    console.error(`Error processing file ${filename}:`, error);
                }
            });

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return { paths: [], fallback: 'blocking' };
    }
}

export async function getStaticProps({ params }) {
    try {
        // Import server-side modules dynamically
        const fs = await import('fs');
        const path = await import('path');
        const matter = await import('gray-matter');
        const { serialize } = await import('next-mdx-remote/serialize');
        const remarkGfm = (await import('remark-gfm')).default;
        const remarkMath = (await import('remark-math')).default;
        const rehypeKatex = (await import('rehype-katex')).default;
        const rehypeHighlight = (await import('rehype-highlight')).default;
        const rehypeSlug = (await import('rehype-slug')).default;
        const rehypeAutolinkHeadings = (await import('rehype-autolink-headings')).default;

        const postsDirectory = path.default.join(process.cwd(), 'posts');
        const requestedSlug = params.slug;

        // Helper function to generate slug from title
        function generateSlug(text) {
            if (!text) return '';
            return text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')     // Replace spaces with hyphens
                .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
                .trim();                  // Remove whitespace from ends
        }

        // First try to find a file that matches the slug directly
        let fullPath = path.default.join(postsDirectory, `${requestedSlug}.md`);

        // If direct match file doesn't exist, try to find by title-based slug
        if (!fs.default.existsSync(fullPath)) {
            // Check all md files and match by title-based slug
            const filenames = fs.default.readdirSync(postsDirectory);
            let matchingFile = null;

            for (const filename of filenames.filter(f => f.endsWith('.md'))) {
                const filePath = path.default.join(postsDirectory, filename);
                const fileContents = fs.default.readFileSync(filePath, 'utf8');
                const { data } = matter.default(fileContents);

                if (data.title && generateSlug(data.title) === requestedSlug) {
                    matchingFile = filename;
                    break;
                }
            }

            if (matchingFile) {
                fullPath = path.default.join(postsDirectory, matchingFile);
            } else {
                return { notFound: true };
            }
        }

        // Read and parse the markdown file
        const fileContents = fs.default.readFileSync(fullPath, 'utf8');
        const { data, content } = matter.default(fileContents);

        // Process the MDX content
        const mdxSource = await serialize(content, {
            mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings],
            },
            parseFrontmatter: false,
        });

        // Get all posts for related content
        const filenames = fs.default.readdirSync(postsDirectory);
        const allPosts = filenames
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

        // Create the post object
        const post = {
            slug: params.slug,
            frontMatter: data,
            mdxSource
        };

        // Find related posts
        let sameCategoryPosts = allPosts
            .filter((p) => p.slug !== params.slug && p.frontMatter.category === post.frontMatter.category);

        let relatedPosts = [];

        // If we have enough posts in the same category, take 2
        if (sameCategoryPosts.length >= 2) {
            // Sort by date
            sameCategoryPosts = sameCategoryPosts.sort((a, b) =>
                new Date(b.frontMatter.date) - new Date(a.frontMatter.date)
            );

            relatedPosts = sameCategoryPosts.slice(0, 2);
        }
        // If we don't have enough posts in the same category
        else {
            // Add all the same category posts first
            relatedPosts = [...sameCategoryPosts];

            // Then fill the remaining slots with posts from other categories
            const otherPosts = allPosts
                .filter((p) => p.slug !== params.slug && p.frontMatter.category !== post.frontMatter.category)
                // Sort by date to get the most recent posts from other categories
                .sort((a, b) => new Date(b.frontMatter.date) - new Date(a.frontMatter.date));

            // Add enough other posts to make the total up to 2
            const neededCount = 2 - relatedPosts.length;
            relatedPosts = [...relatedPosts, ...otherPosts.slice(0, neededCount)];
        }

        return {
            props: {
                post,
                relatedPosts
            },
            revalidate: 3600
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true,
            revalidate: 60 // Try again sooner if there was an error
        };
    }
}