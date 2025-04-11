// Using server-only features
const fs = require('fs');
const path = require('path');
const { serialize } = require('next-mdx-remote/serialize');
const remarkGfm = require('remark-gfm');
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');
const rehypeHighlight = require('rehype-highlight');
const rehypeSlug = require('rehype-slug');
const rehypeAutolinkHeadings = require('rehype-autolink-headings');
const matter = require('gray-matter');

async function getMdxSource(source) {
    const mdxSource = await serialize(source, {
        mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings],
        },
        parseFrontmatter: false,
        // Preserve whitespace and line breaks
        development: process.env.NODE_ENV === 'development',
    });

    return mdxSource;
}

async function getPostBySlug(slug) {
    const postsDirectory = path.join(process.cwd(), 'posts');

    // Try with .mdx extension first
    let fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
        // Fall back to .md if .mdx doesn't exist
        fullPath = path.join(postsDirectory, `${slug}.md`);
        if (!fs.existsSync(fullPath)) {
            return null;
        }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const { data, content } = matter(fileContents);
    const mdxSource = await getMdxSource(content);

    return {
        slug,
        frontMatter: data,
        mdxSource
    };
}

async function getAllPosts() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const filenames = fs.readdirSync(postsDirectory);

    const posts = filenames
        .filter(filename => filename.endsWith('.md') || filename.endsWith('.mdx'))
        .map(filename => {
            const slug = filename.replace(/\.(md|mdx)$/, '');
            const fullPath = path.join(postsDirectory, filename);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                frontMatter: data,
                extension: path.extname(filename)
            };
        });

    return posts;
}

module.exports = {
    getMdxSource,
    getPostBySlug,
    getAllPosts
}; 