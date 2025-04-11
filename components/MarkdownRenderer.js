import { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';

export default function MarkdownRenderer({ content }) {
    useEffect(() => {
        const markdownContent = document.getElementById('markdown-content');
        if (!markdownContent) return;

        // Configure marked to handle code blocks properly
        marked.setOptions({
            highlight: function (code, lang) {
                return code;
            },
            breaks: true,
            gfm: true
        });

        // Create a custom renderer to handle LaTeX math
        const renderer = new marked.Renderer();

        // Override the paragraph renderer to handle inline math
        const originalParagraph = renderer.paragraph.bind(renderer);
        renderer.paragraph = function (text) {
            // Process inline math expressions
            let processedText = text;

            // Check if text is a string before using regex
            if (typeof text === 'string') {
                const inlineMathRegex = /\$([^\$]+)\$/g;

                if (inlineMathRegex.test(text)) {
                    processedText = text.replace(inlineMathRegex, (match, tex) => {
                        try {
                            return katex.renderToString(tex, { displayMode: false });
                        } catch (error) {
                            console.error('KaTeX rendering error:', error);
                            return match;
                        }
                    });
                }
            }

            return originalParagraph(processedText);
        };

        // Override the code renderer to handle display math
        const originalCode = renderer.code.bind(renderer);
        renderer.code = function (code, language) {
            // Check if code is a string before using startsWith
            if (typeof code === 'string' && code.startsWith('$$') && code.endsWith('$$')) {
                const tex = code.slice(2, -2);
                try {
                    return katex.renderToString(tex, { displayMode: true });
                } catch (error) {
                    console.error('KaTeX rendering error:', error);
                    return originalCode(code, language);
                }
            }

            return originalCode(code, language);
        };

        // Set the custom renderer
        marked.setOptions({ renderer });

        // Process the content to handle LaTeX math before passing to marked
        let processedContent = content;

        // Check if content is a string before processing
        if (typeof content === 'string') {
            // Handle display math blocks ($$...$$)
            const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
            processedContent = processedContent.replace(displayMathRegex, (match, tex) => {
                try {
                    return `\n\`\`\`\n$$${tex}$$\n\`\`\`\n\n`;
                } catch (error) {
                    console.error('KaTeX display math error:', error);
                    return match;
                }
            });

            // Handle inline math ($...$)
            const inlineMathRegex = /\$([^\$]+)\$/g;
            processedContent = processedContent.replace(inlineMathRegex, (match, tex) => {
                try {
                    return `\`\`\`\n$${tex}$\n\`\`\`\n`;
                } catch (error) {
                    console.error('KaTeX inline math error:', error);
                    return match;
                }
            });
        }

        const htmlContent = marked.parse(processedContent);
        markdownContent.innerHTML = htmlContent;

        // Process any remaining KaTeX equations that might have been missed
        document.querySelectorAll('code').forEach((block) => {
            // Check if block.textContent is a string before using startsWith
            if (typeof block.textContent === 'string') {
                if (block.textContent.startsWith('$$') && block.textContent.endsWith('$$')) {
                    const tex = block.textContent.slice(2, -2);
                    const div = document.createElement('div');
                    div.className = 'latex-equation';
                    try {
                        katex.render(tex, div, { displayMode: true });
                        block.parentNode.replaceChild(div, block);
                    } catch (error) {
                        console.error('KaTeX rendering error:', error);
                    }
                } else if (block.textContent.startsWith('$') && block.textContent.endsWith('$')) {
                    const tex = block.textContent.slice(1, -1);
                    const span = document.createElement('span');
                    try {
                        katex.render(tex, span, { displayMode: false });
                        block.parentNode.replaceChild(span, block);
                    } catch (error) {
                        console.error('KaTeX rendering error:', error);
                    }
                }
            }
        });
    }, [content]);

    return <div id="markdown-content" className="prose prose-lg max-w-none dark:prose-invert" />;
}