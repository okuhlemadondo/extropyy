import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/*  You can add meta tags, links to fonts, and other head elements here.  For Example:  */}
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
                <link rel="icon" href="/favicon.png" type="image/png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

                {/* KaTeX CSS for math equations */}
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossOrigin="anonymous" />

                {/* Add other head elements as necessary, such as SEO tags */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}