import { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Choose a style that fits your theme

export default function SimpleMarkdownRenderer({ content }) {
    useEffect(() => {
        if (!content) return;

        // Function to render math expressions
        const renderMath = (tex, displayMode) => {
            try {
                return katex.renderToString(tex, {
                    displayMode: displayMode,
                    throwOnError: false,
                    output: 'html',
                    strict: false
                });
            } catch (e) {
                console.error('Katex error:', e);
                return tex;
            }
        };

        // Extract and save all math expressions first to prevent processing them
        const mathExpressions = [];
        let contentWithMathPlaceholders = content;

        // Process display math ($$...$$) - extract and replace with placeholders
        const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
        let displayMatch;
        while ((displayMatch = displayMathRegex.exec(content)) !== null) {
            const placeholder = `DISPLAY_MATH_PLACEHOLDER_${mathExpressions.length}`;
            mathExpressions.push({
                type: 'display',
                tex: displayMatch[1].trim()
            });
            contentWithMathPlaceholders = contentWithMathPlaceholders.replace(displayMatch[0], placeholder);
        }

        // Process inline math ($...$) - extract and replace with placeholders
        const inlineMathRegex = /\$([^\$]+)\$/g;
        let inlineMatch;
        while ((inlineMatch = inlineMathRegex.exec(contentWithMathPlaceholders)) !== null) {
            const placeholder = `INLINE_MATH_PLACEHOLDER_${mathExpressions.length}`;
            mathExpressions.push({
                type: 'inline',
                tex: inlineMatch[1].trim()
            });
            contentWithMathPlaceholders = contentWithMathPlaceholders.replace(inlineMatch[0], placeholder);
        }

        // Extract code blocks next
        const codeBlockRegex = /```([\w-]*)\s*\n([\s\S]*?)```/g;
        const codeBlocks = [];
        let contentWithAllPlaceholders = contentWithMathPlaceholders;

        // Extract code blocks and replace with placeholders
        let match;
        while ((match = codeBlockRegex.exec(contentWithMathPlaceholders)) !== null) {
            const placeholder = `CODE_BLOCK_${codeBlocks.length}`;
            const language = match[1].trim() || 'plaintext';
            // Preserve code content exactly as it is
            const code = match[2];

            codeBlocks.push({ language, code });
            contentWithAllPlaceholders = contentWithAllPlaceholders.replace(match[0], placeholder);
        }

        // Process headings separately
        let processedContent = contentWithAllPlaceholders.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
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

        // Convert markdown to HTML 
        let html = marked(processedContent);

        // Restore math expressions
        mathExpressions.forEach((math, index) => {
            const renderedMath = renderMath(math.tex, math.type === 'display');
            const placeholder = math.type === 'display'
                ? `DISPLAY_MATH_PLACEHOLDER_${index}`
                : `INLINE_MATH_PLACEHOLDER_${index}`;

            html = html.replace(placeholder, renderedMath);
            html = html.replace(`<p>${placeholder}</p>`, renderedMath);
        });

        // Replace code block placeholders with highlighted code
        codeBlocks.forEach((block, index) => {
            const placeholder = `CODE_BLOCK_${index}`;

            try {
                // Use the correct language or fallback to plaintext
                const validLanguage = hljs.getLanguage(block.language) ? block.language : 'plaintext';

                // Highlight code using highlight.js
                const highlightedCode = hljs.highlight(block.code, {
                    language: validLanguage
                }).value;

                // Create a unique ID for the code block
                const blockId = `code-block-${Math.random().toString(36).substr(2, 9)}`;

                // Create HTML for the code block with proper styling
                const codeBlockHtml = `
                    <div class="code-block">
                        <div class="code-header">
                            <span>${validLanguage}</span>
                            <button 
                                class="copy-button"
                                onclick="copyCodeToClipboard('${blockId}')"
                            >
                                Copy
                            </button>
                        </div>
                        <pre id="${blockId}"><code class="language-${validLanguage}">${highlightedCode}</code></pre>
                    </div>
                `;

                // Replace the placeholder in the HTML
                html = html.replace(`<p>${placeholder}</p>`, codeBlockHtml);
                // Also try without <p> tags in case of nested markdown
                html = html.replace(placeholder, codeBlockHtml);
            } catch (error) {
                console.error('Error highlighting code:', error);
                // Fallback to plain <pre><code> if highlighting fails
                const fallbackHtml = `<pre><code>${block.code}</code></pre>`;
                html = html.replace(`<p>${placeholder}</p>`, fallbackHtml);
                html = html.replace(placeholder, fallbackHtml);
            }
        });

        // Set the processed HTML content
        const contentElement = document.getElementById('markdown-content');
        if (contentElement) {
            contentElement.innerHTML = html;

            // Add clipboard functionality
            if (!window.copyCodeToClipboard) {
                window.copyCodeToClipboard = function (blockId) {
                    const codeBlock = document.getElementById(blockId);
                    if (!codeBlock) return;

                    // Get the code text
                    const code = codeBlock.textContent;

                    // Copy to clipboard
                    navigator.clipboard.writeText(code).then(() => {
                        // Find the button and provide feedback
                        const button = codeBlock.parentElement.querySelector('.copy-button');
                        if (!button) return;

                        const originalText = button.textContent;
                        button.textContent = 'Copied!';

                        // Reset button text after delay
                        setTimeout(() => {
                            button.textContent = originalText;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy code: ', err);
                    });
                };
            }
        }
    }, [content]);

    return (
        <div
            id="markdown-content"
            className="prose dark:prose-invert max-w-none prose-p:my-4 prose-li:my-1 prose-img:rounded-lg prose-img:my-6 prose-hr:my-8 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic whitespace-pre-line"
        />
    );
} 