module.exports = {

"[externals]/server-only [external] (server-only, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("server-only", () => require("server-only"));

module.exports = mod;
}}),
"[externals]/next-mdx-remote/serialize [external] (next-mdx-remote/serialize, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("next-mdx-remote/serialize");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/remark-gfm [external] (remark-gfm, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("remark-gfm");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/remark-math [external] (remark-math, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("remark-math");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/rehype-katex [external] (rehype-katex, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("rehype-katex");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/rehype-highlight [external] (rehype-highlight, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("rehype-highlight");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/rehype-slug [external] (rehype-slug, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("rehype-slug");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/rehype-autolink-headings [external] (rehype-autolink-headings, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("rehype-autolink-headings");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/gray-matter [external] (gray-matter, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("gray-matter", () => require("gray-matter"));

module.exports = mod;
}}),
"[project]/lib/mdx.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "getAllPosts": (()=>getAllPosts),
    "getMdxSource": (()=>getMdxSource),
    "getPostBySlug": (()=>getPostBySlug)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$server$2d$only__$5b$external$5d$__$28$server$2d$only$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/server-only [external] (server-only, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$serialize__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$serialize$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/next-mdx-remote/serialize [external] (next-mdx-remote/serialize, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$gfm__$5b$external$5d$__$28$remark$2d$gfm$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/remark-gfm [external] (remark-gfm, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$math__$5b$external$5d$__$28$remark$2d$math$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/remark-math [external] (remark-math, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$katex__$5b$external$5d$__$28$rehype$2d$katex$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/rehype-katex [external] (rehype-katex, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$highlight__$5b$external$5d$__$28$rehype$2d$highlight$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/rehype-highlight [external] (rehype-highlight, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$slug__$5b$external$5d$__$28$rehype$2d$slug$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/rehype-slug [external] (rehype-slug, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$autolink$2d$headings__$5b$external$5d$__$28$rehype$2d$autolink$2d$headings$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/rehype-autolink-headings [external] (rehype-autolink-headings, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/gray-matter [external] (gray-matter, cjs)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$serialize__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$serialize$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$gfm__$5b$external$5d$__$28$remark$2d$gfm$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$math__$5b$external$5d$__$28$remark$2d$math$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$katex__$5b$external$5d$__$28$rehype$2d$katex$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$highlight__$5b$external$5d$__$28$rehype$2d$highlight$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$slug__$5b$external$5d$__$28$rehype$2d$slug$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$autolink$2d$headings__$5b$external$5d$__$28$rehype$2d$autolink$2d$headings$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$serialize__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$serialize$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$gfm__$5b$external$5d$__$28$remark$2d$gfm$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$math__$5b$external$5d$__$28$remark$2d$math$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$katex__$5b$external$5d$__$28$rehype$2d$katex$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$highlight__$5b$external$5d$__$28$rehype$2d$highlight$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$slug__$5b$external$5d$__$28$rehype$2d$slug$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$autolink$2d$headings__$5b$external$5d$__$28$rehype$2d$autolink$2d$headings$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
;
;
;
;
;
async function getMdxSource(source) {
    const mdxSource = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$next$2d$mdx$2d$remote$2f$serialize__$5b$external$5d$__$28$next$2d$mdx$2d$remote$2f$serialize$2c$__esm_import$29$__["serialize"])(source, {
        mdxOptions: {
            remarkPlugins: [
                __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$gfm__$5b$external$5d$__$28$remark$2d$gfm$2c$__esm_import$29$__["default"],
                __TURBOPACK__imported__module__$5b$externals$5d2f$remark$2d$math__$5b$external$5d$__$28$remark$2d$math$2c$__esm_import$29$__["default"]
            ],
            rehypePlugins: [
                __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$katex__$5b$external$5d$__$28$rehype$2d$katex$2c$__esm_import$29$__["default"],
                __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$highlight__$5b$external$5d$__$28$rehype$2d$highlight$2c$__esm_import$29$__["default"],
                __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$slug__$5b$external$5d$__$28$rehype$2d$slug$2c$__esm_import$29$__["default"],
                __TURBOPACK__imported__module__$5b$externals$5d2f$rehype$2d$autolink$2d$headings__$5b$external$5d$__$28$rehype$2d$autolink$2d$headings$2c$__esm_import$29$__["default"]
            ]
        },
        parseFrontmatter: false
    });
    return mdxSource;
}
async function getPostBySlug(slug) {
    const postsDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'posts');
    const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(postsDirectory, `${slug}.md`);
    const fileContents = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath, 'utf8');
    const { data, content } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__["default"])(fileContents);
    const mdxSource = await getMdxSource(content);
    return {
        slug,
        frontMatter: data,
        mdxSource
    };
}
async function getAllPosts() {
    const postsDirectory = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'posts');
    const filenames = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readdirSync(postsDirectory);
    const posts = filenames.filter((filename)=>filename.endsWith('.md')).map((filename)=>{
        const slug = filename.replace(/\.md$/, '');
        const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(postsDirectory, filename);
        const fileContents = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(fullPath, 'utf8');
        const { data } = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$gray$2d$matter__$5b$external$5d$__$28$gray$2d$matter$2c$__cjs$29$__["default"])(fileContents);
        return {
            slug,
            frontMatter: data
        };
    });
    return posts;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__b92cb4ce._.js.map