const { getAllPosts } = require('./lib/articles');

const nextConfig = {
  /* config options here */
  async redirects() {
    // Get all posts to create redirects from ID-based URLs to slug-based URLs
    const posts = getAllPosts();

    return posts.map(post => ({
      source: `/articles/${post.id}`,
      destination: `/articles/${post.slug}`,
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
