import { useEffect } from 'react';
import katex from 'katex';

export default function MathRenderer({ content }) {
    useEffect(() => {
        // Find all inline math expressions ($...$)
        const inlineMathElements = document.querySelectorAll('.inline-math');
        inlineMathElements.forEach(element => {
            try {
                const tex = element.textContent;
                katex.render(tex, element, { displayMode: false });
            } catch (error) {
                console.error('KaTeX inline math error:', error);
            }
        });

        // Find all display math expressions ($$...$$)
        const displayMathElements = document.querySelectorAll('.display-math');
        displayMathElements.forEach(element => {
            try {
                const tex = element.textContent;
                katex.render(tex, element, { displayMode: true });
            } catch (error) {
                console.error('KaTeX display math error:', error);
            }
        });
    }, [content]);

    return null;
} 