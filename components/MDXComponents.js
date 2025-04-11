import { useEffect } from 'react';
import Image from 'next/image';
import 'katex/dist/katex.min.css';

const Youtube = ({ id }) => {
    return (
        <div className="my-8 relative aspect-w-16 aspect-h-9">
            <iframe
                src={`https://www.youtube.com/embed/${id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-lg"
            />
        </div>
    );
};

const Tweet = ({ id }) => {
    useEffect(() => {
        // Load Twitter widget script
        if (window.twttr) {
            window.twttr.widgets.load();
        } else {
            const script = document.createElement('script');
            script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
            script.setAttribute('async', 'true');
            document.head.appendChild(script);
        }
    }, [id]);

    return (
        <div className="my-8 mx-auto max-w-xl">
            <blockquote className="twitter-tweet" data-dnt="true">
                <a href={`https://twitter.com/x/status/${id}`}></a>
            </blockquote>
        </div>
    );
};

const CodeBlock = ({ children, className }) => {
    const language = className ? className.replace(/language-/, '') : '';

    return (
        <div className="relative my-6">
            <div className="absolute right-2 top-2 text-xs font-mono text-gray-500">
                {language}
            </div>
            <pre className={`${className} p-4 rounded-lg overflow-x-auto`}>
                <code>{children}</code>
            </pre>
        </div>
    );
};

// Custom paragraph component that properly preserves line breaks
const Paragraph = (props) => {
    return (
        <p className="my-4 leading-relaxed whitespace-pre-wrap" {...props} />
    );
};

const MDXComponents = {
    img: (props) => (
        <div className="my-8">
            <Image
                {...props}
                width={800}
                height={450}
                className="rounded-lg mx-auto"
                alt={props.alt || 'Image'}
            />
        </div>
    ),
    Youtube,
    Tweet,
    code: CodeBlock,
    pre: (props) => <div {...props} />,
    p: Paragraph,
    // Add specific styling for other markdown elements
    h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-2xl font-bold mt-8 mb-3" {...props} />,
    h3: (props) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
    ul: (props) => <ul className="list-disc pl-6 my-4" {...props} />,
    ol: (props) => <ol className="list-decimal pl-6 my-4" {...props} />,
    li: (props) => <li className="mb-1" {...props} />,
    blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
    a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
};

export default MDXComponents; 