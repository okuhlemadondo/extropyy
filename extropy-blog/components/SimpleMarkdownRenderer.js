import { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Configure marked options
marked.setOptions({
    breaks: true,
    gfm: true,
});

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

        // Convert markdown to HTML after processing math
        const html = marked(processedContent);

        // Set the processed HTML content
        const contentElement = document.getElementById('markdown-content');
        if (contentElement) {
            contentElement.innerHTML = html;
        }
    }, [content]);

    return <div id="markdown-content" className="prose dark:prose-invert max-w-none" />;
} 