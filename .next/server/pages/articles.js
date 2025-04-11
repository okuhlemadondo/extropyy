const CHUNK_PUBLIC_PATH = "server/pages/articles.js";
const runtime = require("../chunks/ssr/[turbopack]_runtime.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__362a9f5b._.js");
runtime.loadChunk("server/chunks/ssr/node_modules_1f9e293b._.js");
runtime.loadChunk("server/chunks/ssr/[root of the server]__36a11f36._.js");
runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/pages/articles/index.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/pages/_document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/pages/_app.js [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH);
module.exports = runtime.getOrInstantiateRuntimeModule("[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/pages/articles/index.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/pages/_document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/pages/_app.js [ssr] (ecmascript)\" } [ssr] (ecmascript)", CHUNK_PUBLIC_PATH).exports;
