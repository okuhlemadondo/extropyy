import { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';

export default function MarkdownRenderer({ content }) {
    useEffect(() => {
        const markdownContent = document.getElementById('markdown-content');
        if (!markdownContent) return;

        const htmlContent = marked.parse(content);
        markdownContent.innerHTML = htmlContent;

        document.querySelectorAll('code').forEach((block) => {
            if (block.textContent.startsWith('$$') && block.textContent.endsWith('$$')) {
                const tex = block.textContent.slice(2, -2);
                const div = document.createElement('div');
                div.className = 'latex-equation';
                katex.render(tex, div, { displayMode: true });
                block.parentNode.replaceChild(div, block);
            } else if (block.textContent.startsWith('$') && block.textContent.endsWith('$')) {
                const tex = block.textContent.slice(1, -1);
                const span = document.createElement('span');
                katex.render(tex, span, { displayMode: false });
                block.parentNode.replaceChild(span, block);
            }
        });
    }, [content]);

    return <div id="markdown-content" className="prose prose-lg max-w-none" />;
}