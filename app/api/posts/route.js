import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Get the directory path
const postsDirectory = path.join(process.cwd(), 'posts');

function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Remove whitespace from ends
}

export async function GET() {
    try {
        const fileNames = fs.readdirSync(postsDirectory);
        const allPosts = fileNames
            .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.mdx'))
            .map((fileName) => {
                const id = fileName.replace(/\.(md|mdx)$/, '');
                const fullPath = path.join(postsDirectory, fileName);
                const fileContents = fs.readFileSync(fullPath, 'utf8');
                const { data, content } = matter(fileContents);

                // Normalize the category field
                const normalizedData = {
                    ...data,
                    category: data.category ? data.category.trim() : 'Uncategorized',
                };

                // Generate a slug from the title or use the filename without extension as fallback
                const slug = normalizedData.title ?
                    generateSlug(normalizedData.title) :
                    generateSlug(id);

                return {
                    id: id,
                    slug: slug,
                    frontMatter: normalizedData,
                    excerpt: normalizedData.excerpt || '',
                    extension: path.extname(fileName)
                };
            });

        return NextResponse.json(allPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
} 