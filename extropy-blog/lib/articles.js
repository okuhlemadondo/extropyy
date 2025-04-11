const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');

// Generate slug from string (title or filename)
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Remove whitespace from ends
}

function getAllPosts() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
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
            ...normalizedData,
            content,
        };
    });

    return allPosts;
}

function getPostById(id) {
    const posts = getAllPosts();
    return posts.find((post) => post.id === id);
}

function getPostBySlug(slug) {
    const posts = getAllPosts();
    return posts.find((post) => post.slug === slug);
}

function getSortedPosts() {
    const posts = getAllPosts();
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

module.exports = {
    getAllPosts,
    getPostById,
    getPostBySlug,
    getSortedPosts,
    generateSlug
};