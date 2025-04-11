import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Get the directory path
const postsDirectory = path.join(process.cwd(), 'posts');

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

export async function GET(request, { params }) {
    try {
        const slug = params.slug;
        const allFiles = fs.readdirSync(postsDirectory);

        // Look for both .md and .mdx files
        let fileName = null;

        // First check if we have an exact match with the file name (mdx first priority)
        const mdxMatch = `${slug}.mdx`;
        const mdMatch = `${slug}.md`;

        if (allFiles.includes(mdxMatch)) {
            fileName = mdxMatch;
        } else if (allFiles.includes(mdMatch)) {
            fileName = mdMatch;
        }

        // If we can't find a file that matches the slug directly, try to match based on title
        if (!fileName) {
            for (const file of allFiles) {
                if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

                const fullPath = path.join(postsDirectory, file);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const { data } = matter(fileContents);
                const titleSlug = data.title
                    ? data.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
                    : '';

                if (titleSlug === slug) {
                    fileName = file;
                    break;
                }
            }
        }

        if (!fileName) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const mdxSource = await getMdxSource(content);

        return NextResponse.json({
            slug,
            frontMatter: data,
            mdxSource,
            extension: path.extname(fileName)
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
} 