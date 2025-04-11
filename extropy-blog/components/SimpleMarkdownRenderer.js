import { useEffect } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // Choose a style that fits your theme

export default function SimpleMarkdownRenderer({ content }) {
    useEffect(() => {
        if (!content) return;

        // First, extract and save all code blocks to prevent processing them
        const codeBlockRegex = /```([\w-]*)\n([\s\S]*?)```/g;
        const codeBlocks = [];
        let codeMatch;
        let contentWithPlaceholders = content;

        // Extract code blocks and replace them with placeholders
        while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
            const language = codeMatch[1] || 'plaintext';
            const codeContent = codeMatch[2];
            const placeholder = `CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}`;

            codeBlocks.push({ language, code: codeContent });
            contentWithPlaceholders = contentWithPlaceholders.replace(codeMatch[0], placeholder);
        }

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
        let processedContent = contentWithPlaceholders.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
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
        marked.use({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false,
            pedantic: false,
            smartLists: true,
            smartypants: true
        });

        try {
            // Convert markdown to HTML
            let html = marked.parse(processedContent);

            // Now restore code blocks with proper formatting
            codeBlocks.forEach((block, index) => {
                const placeholder = `CODE_BLOCK_PLACEHOLDER_${index}`;
                const highlightedCode = hljs.highlight(block.code, {
                    language: hljs.getLanguage(block.language) ? block.language : 'plaintext'
                }).value;

                // Generate a unique ID for this code block
                const blockId = `code-block-${Math.random().toString(36).substr(2, 9)}`;

                // Create HTML for the custom code block
                const codeBlockHtml = `
                    <div class="code-block my-4">
                        <div class="code-header flex justify-between items-center bg-gray-900 text-white px-4 py-2 rounded-t-lg">
                            <span class="text-xs font-mono">${block.language || 'plaintext'}</span>
                            <button 
                                class="copy-button text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                                onclick="copyCodeToClipboard('${blockId}')"
                            >
                                Copy
                            </button>
                        </div>
                        <pre id="${blockId}" class="bg-gray-800 p-4 rounded-b-lg overflow-x-auto"><code class="language-${block.language}">${highlightedCode}</code></pre>
                    </div>
                `;

                // Replace the placeholder with the formatted code block
                html = html.replace(`<p>${placeholder}</p>`, codeBlockHtml);
            });

            // Handle inline code separately
            const contentElement = document.getElementById('markdown-content');
            if (contentElement) {
                contentElement.innerHTML = html;

                // Add the clipboard functionality script
                if (!window.copyCodeToClipboard) {
                    window.copyCodeToClipboard = function (blockId) {
                        const codeBlock = document.getElementById(blockId);
                        const code = codeBlock.querySelector('code').innerText;

                        navigator.clipboard.writeText(code).then(() => {
                            // Find the button for this block
                            const button = codeBlock.parentElement.querySelector('.copy-button');
                            const originalText = button.textContent;

                            // Change button text to indicate success
                            button.textContent = 'Copied!';

                            // Revert back after a short delay
                            setTimeout(() => {
                                button.textContent = originalText;
                            }, 2000);
                        }).catch(err => {
                            console.error('Failed to copy code: ', err);
                        });
                    };
                }

                // Style inline code elements
                const inlineCode = contentElement.querySelectorAll('p code, li code');
                inlineCode.forEach((code) => {
                    code.className = 'bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm';
                });
            }
        } catch (error) {
            console.error('Error rendering markdown:', error);
            const contentElement = document.getElementById('markdown-content');
            if (contentElement) {
                contentElement.innerHTML = `<p>Error rendering content: ${error.message}</p>`;
            }
        }
    }, [content]);

    return (
        <div
            id="markdown-content"
            className="prose dark:prose-invert max-w-none prose-p:my-4 prose-li:my-1 prose-img:rounded-lg prose-img:my-6 prose-hr:my-8 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic"
        />
    );
} 