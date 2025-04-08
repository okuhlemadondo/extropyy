import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/*  You can add meta tags, links to fonts, and other head elements here.  For Example:  */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

                {/* Add other head elements as necessary, such as SEO tags */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}