import { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function SimpleMarkdownRenderer({ content }) {
    useEffect(() => {
        // Function to render math expressions
        const renderMath = (tex, displayMode) => {
            try {
                return katex.renderToString(tex, {
                    displayMode: displayMode,
                    throwOnError: false
                });
            } catch (e) {
                console.error('Katex error:', e);
                return tex;
            }
        };

        // Process display math ($$...$$)
        let processedContent = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
            return renderMath(tex, true);
        });

        // Process inline math ($...$)
        processedContent = processedContent.replace(/\$([^\$]+)\$/g, (match, tex) => {
            return renderMath(tex, false);
        });

        // Process headings separately
        processedContent = processedContent.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
            const level = hashes.length;
            const sizes = {
                1: 'text-3xl',
                2: 'text-2xl',
                3: 'text-xl',
                4: 'text-lg',
                5: 'text-base',
                6: 'text-sm'
            };
            return `<h${level} class="${sizes[level]} font-bold mt-6 mb-4">${text}</h${level}>`;
        });

        // Process line breaks - convert single line breaks to <br> tags
        processedContent = processedContent.replace(/([^\n])\n([^\n])/g, '$1<br>$2');

        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: true,
            xhtml: false
        });

        // Convert markdown to HTML after processing math and headings
        const html = marked(processedContent);

        // Set the processed HTML content
        const contentElement = document.getElementById('markdown-content');
        if (contentElement) {
            contentElement.innerHTML = html;
        }
    }, [content]);

    return (
        <div
            id="markdown-content"
            className="prose dark:prose-invert max-w-none prose-p:my-4 prose-li:my-1 prose-pre:bg-gray-800 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-md prose-pre:overflow-x-auto prose-img:rounded-lg prose-img:my-6 prose-hr:my-8 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic whitespace-pre-line"
        />
    );
} 