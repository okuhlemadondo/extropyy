// Client-side API utilities for fetching posts
// Safe to import in client components

/**
 * Fetches all posts from the API
 */
async function getAllPosts() {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    return posts;
}

/**
 * Fetches a single post by slug
 */
async function getPostBySlug(slug) {
    const res = await fetch(`/api/posts/${slug}`);
    if (!res.ok) {
        return null;
    }
    return res.json();
}

/**
 * Generates a slug from a string (title)
 */
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Remove whitespace from ends
}

module.exports = {
    getAllPosts,
    getPostBySlug,
    generateSlug
}; 