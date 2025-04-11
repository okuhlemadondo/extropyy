import { MDXRemote } from 'next-mdx-remote';
import MDXComponents from './MDXComponents';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect } from 'react';

export default function MDXRenderer({ content }) {
    // This effect will run any scripts (like Twitter embeds) after render
    useEffect(() => {
        // Find all divs that were replaced with interactive elements and load any scripts
        const scripts = document.querySelectorAll('.twitter-tweet');
        if (scripts.length > 0 && window.twttr) {
            window.twttr.widgets.load();
        }
    }, [content]);

    return (
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:whitespace-pre-wrap prose-a:text-blue-600 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-li:mb-1 prose-img:rounded-lg">
            <MDXRemote {...content} components={MDXComponents} />
        </article>
    );
} 