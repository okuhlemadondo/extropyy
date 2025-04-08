import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPosts = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            id: id,
            ...data,
            content,
        };
    });

    return allPosts;
}

export function getPostById(id) {
    const posts = getAllPosts();
    return posts.find((post) => post.id === id);
}

export function getSortedPosts() {
    const posts = getAllPosts();
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}