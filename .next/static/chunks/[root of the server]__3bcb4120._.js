(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/[root of the server]__3bcb4120._.js", {

"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s({
    "connect": (()=>connect),
    "setHooks": (()=>setHooks),
    "subscribeToUpdate": (()=>subscribeToUpdate)
});
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case "turbopack-connected":
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn("[Fast Refresh] performing full reload\n\n" + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + "You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n" + "Consider migrating the non-React component export to a separate file and importing it into both files.\n\n" + "It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n" + "Fast Refresh requires at least one parent function component in your React tree.");
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error("A separate HMR handler was already registered");
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: "turbopack-subscribe",
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: "turbopack-unsubscribe",
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: "ChunkListUpdate",
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted" || updateA.type === "deleted" && updateB.type === "added") {
        return undefined;
    }
    if (updateA.type === "partial") {
        invariant(updateA.instruction, "Partial updates are unsupported");
    }
    if (updateB.type === "partial") {
        invariant(updateB.instruction, "Partial updates are unsupported");
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: "EcmascriptMergedUpdate",
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === "added" && updateB.type === "deleted") {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === "deleted" && updateB.type === "added") {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: "partial",
            added,
            deleted
        };
    }
    if (updateA.type === "partial" && updateB.type === "partial") {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: "partial",
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === "added" && updateB.type === "partial") {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: "added",
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === "partial" && updateB.type === "deleted") {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: "deleted",
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    "bug",
    "error",
    "fatal"
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    "bug",
    "fatal",
    "error",
    "warning",
    "info",
    "log"
];
const CATEGORY_ORDER = [
    "parse",
    "resolve",
    "code generation",
    "rendering",
    "typescript",
    "other"
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case "issues":
            break;
        case "partial":
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === "notFound") {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}}),
"[project]/components/SimpleMarkdownRenderer.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>SimpleMarkdownRenderer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/marked/lib/marked.esm.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'katex'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'katex/dist/katex.min.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'highlight.js'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'highlight.js/styles/atom-one-dark.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
function SimpleMarkdownRenderer({ content }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SimpleMarkdownRenderer.useEffect": ()=>{
            if (!content) return;
            // Function to render math expressions
            const renderMath = {
                "SimpleMarkdownRenderer.useEffect.renderMath": (tex, displayMode)=>{
                    try {
                        return katex.renderToString(tex, {
                            displayMode: displayMode,
                            throwOnError: false
                        });
                    } catch (e) {
                        console.error('Katex error:', e);
                        return tex;
                    }
                }
            }["SimpleMarkdownRenderer.useEffect.renderMath"];
            // Fix code block regex to handle various backtick patterns and whitespace
            const codeBlockRegex = /```([\w-]*)\s*\n([\s\S]*?)```/g;
            const codeBlocks = [];
            let contentWithPlaceholders = content;
            // Extract code blocks and replace with placeholders
            let match;
            while((match = codeBlockRegex.exec(content)) !== null){
                const placeholder = `CODE_BLOCK_${codeBlocks.length}`;
                const language = match[1].trim() || 'plaintext';
                // Preserve code content exactly as it is
                const code = match[2];
                codeBlocks.push({
                    language,
                    code
                });
                contentWithPlaceholders = contentWithPlaceholders.replace(match[0], placeholder);
            }
            // Process display math ($$...$$)
            let processedContent = contentWithPlaceholders.replace(/\$\$([\s\S]*?)\$\$/g, {
                "SimpleMarkdownRenderer.useEffect.processedContent": (match, tex)=>{
                    return renderMath(tex, true);
                }
            }["SimpleMarkdownRenderer.useEffect.processedContent"]);
            // Process inline math ($...$)
            processedContent = processedContent.replace(/\$([^\$]+)\$/g, {
                "SimpleMarkdownRenderer.useEffect": (match, tex)=>{
                    return renderMath(tex, false);
                }
            }["SimpleMarkdownRenderer.useEffect"]);
            // Process headings separately
            processedContent = processedContent.replace(/^(#{1,6})\s+(.+)$/gm, {
                "SimpleMarkdownRenderer.useEffect": (match, hashes, text)=>{
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
                }
            }["SimpleMarkdownRenderer.useEffect"]);
            // Process line breaks - convert single line breaks to <br> tags
            processedContent = processedContent.replace(/([^\n])\n([^\n])/g, '$1<br>$2');
            // Configure marked options
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["marked"].setOptions({
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
            // Convert markdown to HTML after processing math and headings
            let html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$marked$2f$lib$2f$marked$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["marked"])(processedContent);
            // Replace code block placeholders with highlighted code
            codeBlocks.forEach({
                "SimpleMarkdownRenderer.useEffect": (block, index)=>{
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
                }
            }["SimpleMarkdownRenderer.useEffect"]);
            // Set the processed HTML content
            const contentElement = document.getElementById('markdown-content');
            if (contentElement) {
                contentElement.innerHTML = html;
                // Add clipboard functionality
                if (!window.copyCodeToClipboard) {
                    window.copyCodeToClipboard = ({
                        "SimpleMarkdownRenderer.useEffect": function(blockId) {
                            const codeBlock = document.getElementById(blockId);
                            if (!codeBlock) return;
                            // Get the code text
                            const code = codeBlock.textContent;
                            // Copy to clipboard
                            navigator.clipboard.writeText(code).then({
                                "SimpleMarkdownRenderer.useEffect": ()=>{
                                    // Find the button and provide feedback
                                    const button = codeBlock.parentElement.querySelector('.copy-button');
                                    if (!button) return;
                                    const originalText = button.textContent;
                                    button.textContent = 'Copied!';
                                    // Reset button text after delay
                                    setTimeout({
                                        "SimpleMarkdownRenderer.useEffect": ()=>{
                                            button.textContent = originalText;
                                        }
                                    }["SimpleMarkdownRenderer.useEffect"], 2000);
                                }
                            }["SimpleMarkdownRenderer.useEffect"]).catch({
                                "SimpleMarkdownRenderer.useEffect": (err)=>{
                                    console.error('Failed to copy code: ', err);
                                }
                            }["SimpleMarkdownRenderer.useEffect"]);
                        }
                    })["SimpleMarkdownRenderer.useEffect"];
                }
            }
        }
    }["SimpleMarkdownRenderer.useEffect"], [
        content
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "markdown-content",
        className: "prose dark:prose-invert max-w-none prose-p:my-4 prose-li:my-1 prose-img:rounded-lg prose-img:my-6 prose-hr:my-8 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic whitespace-pre-line"
    }, void 0, false, {
        fileName: "[project]/components/SimpleMarkdownRenderer.js",
        lineNumber: 166,
        columnNumber: 9
    }, this);
}
_s(SimpleMarkdownRenderer, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = SimpleMarkdownRenderer;
var _c;
__turbopack_context__.k.register(_c, "SimpleMarkdownRenderer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/date.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "formatDate": (()=>formatDate)
});
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ArticleCard.js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ArticleCard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function ArticleCard({ article, dataDelay }) {
    _s();
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Ensure visibility with useEffect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ArticleCard.useEffect": ()=>{
            // Initial render delay to ensure animation works
            const timer = setTimeout({
                "ArticleCard.useEffect.timer": ()=>{
                    setIsVisible(true);
                }
            }["ArticleCard.useEffect.timer"], 500 + (dataDelay || 0));
            return ({
                "ArticleCard.useEffect": ()=>clearTimeout(timer)
            })["ArticleCard.useEffect"];
        }
    }["ArticleCard.useEffect"], [
        dataDelay
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: cardRef,
        className: "article-card rounded-3xl overflow-hidden flex flex-col h-full",
        style: {
            backgroundColor: 'var(--card-bg)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            transitionDelay: `${dataDelay || 0}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative h-48",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/articles/${article.slug}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: article.image,
                        alt: article.title,
                        className: "w-full h-full object-cover"
                    }, void 0, false, {
                        fileName: "[project]/components/ArticleCard.js",
                        lineNumber: 33,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ArticleCard.js",
                    lineNumber: 32,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ArticleCard.js",
                lineNumber: 31,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 flex flex-col flex-grow",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium opacity-70",
                        children: article.category
                    }, void 0, false, {
                        fileName: "[project]/components/ArticleCard.js",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        href: `/articles/${article.slug}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "heading-font text-xl font-bold mt-2 hover:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300",
                            children: article.title
                        }, void 0, false, {
                            fileName: "[project]/components/ArticleCard.js",
                            lineNumber: 39,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ArticleCard.js",
                        lineNumber: 38,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm opacity-70",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2e$js__$5b$client$5d$__$28$ecmascript$29$__["formatDate"])(article.date)
                    }, void 0, false, {
                        fileName: "[project]/components/ArticleCard.js",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 flex-grow",
                        children: article.excerpt
                    }, void 0, false, {
                        fileName: "[project]/components/ArticleCard.js",
                        lineNumber: 42,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/articles/${article.slug}`,
                            className: "inline-flex items-center text-sm font-medium hover:text-gray-200 dark:hover:text-gray-500 transition-colors duration-300",
                            children: [
                                "Read More ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-1",
                                    children: "→"
                                }, void 0, false, {
                                    fileName: "[project]/components/ArticleCard.js",
                                    lineNumber: 45,
                                    columnNumber: 35
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ArticleCard.js",
                            lineNumber: 44,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ArticleCard.js",
                        lineNumber: 43,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ArticleCard.js",
                lineNumber: 36,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ArticleCard.js",
        lineNumber: 20,
        columnNumber: 9
    }, this);
}
_s(ArticleCard, "nYgjwsKtvLdmjP2mHShow/lH2zA=");
_c = ArticleCard;
var _c;
__turbopack_context__.k.register(_c, "ArticleCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/pages/articles/[slug].js [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "__N_SSG": (()=>__N_SSG),
    "default": (()=>Article)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SimpleMarkdownRenderer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SimpleMarkdownRenderer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ArticleCard$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ArticleCard.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
var __N_SSG = true;
function Article({ post, relatedPosts, setIsLoading }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Article.useEffect": ()=>{
            setIsLoading(true);
            const timeoutId = setTimeout({
                "Article.useEffect.timeoutId": ()=>{
                    setIsLoading(false);
                    // Add visible class to fade-in elements
                    const fadeElements = document.querySelectorAll('.fade-in');
                    fadeElements.forEach({
                        "Article.useEffect.timeoutId": (element)=>{
                            setTimeout({
                                "Article.useEffect.timeoutId": ()=>{
                                    element.classList.add('visible');
                                }
                            }["Article.useEffect.timeoutId"], 100);
                        }
                    }["Article.useEffect.timeoutId"]);
                // We no longer need to handle stagger-item animations here
                // as they're handled directly in the ArticleCard component
                }
            }["Article.useEffect.timeoutId"], 500);
            return ({
                "Article.useEffect": ()=>clearTimeout(timeoutId)
            })["Article.useEffect"]; // Cleanup on unmount
        }
    }["Article.useEffect"], [
        setIsLoading
    ]);
    if (!post) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Article not found"
        }, void 0, false, {
            fileName: "[project]/pages/articles/[slug].js",
            lineNumber: 29,
            columnNumber: 16
        }, this); // Handle the case where the article doesn't exist
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "max-w-4xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium opacity-70",
                        children: post.category
                    }, void 0, false, {
                        fileName: "[project]/pages/articles/[slug].js",
                        lineNumber: 35,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "heading-font text-4xl md:text-5xl font-bold mt-2",
                        children: post.title
                    }, void 0, false, {
                        fileName: "[project]/pages/articles/[slug].js",
                        lineNumber: 36,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center mt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: post.headshot,
                                alt: post.author,
                                className: "w-12 h-12 rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/pages/articles/[slug].js",
                                lineNumber: 38,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "ml-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium",
                                        children: post.author
                                    }, void 0, false, {
                                        fileName: "[project]/pages/articles/[slug].js",
                                        lineNumber: 40,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm opacity-70",
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2e$js__$5b$client$5d$__$28$ecmascript$29$__["formatDate"])(post.date)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/articles/[slug].js",
                                        lineNumber: 41,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/articles/[slug].js",
                                lineNumber: 39,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/articles/[slug].js",
                        lineNumber: 37,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/articles/[slug].js",
                lineNumber: 34,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12 fade-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: post.image,
                    alt: post.title,
                    className: "w-full h-[40vh] object-cover rounded-3xl"
                }, void 0, false, {
                    fileName: "[project]/pages/articles/[slug].js",
                    lineNumber: 46,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/articles/[slug].js",
                lineNumber: 45,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SimpleMarkdownRenderer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                content: post.content
            }, void 0, false, {
                fileName: "[project]/pages/articles/[slug].js",
                lineNumber: 48,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-16 pt-8 border-t border-gray-800 dark:border-gray-200 fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "heading-font text-xl font-bold mb-6",
                        children: "Continue Reading"
                    }, void 0, false, {
                        fileName: "[project]/pages/articles/[slug].js",
                        lineNumber: 50,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                        children: relatedPosts.map((related, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ArticleCard$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                article: related,
                                dataDelay: index * 150
                            }, related.id, false, {
                                fileName: "[project]/pages/articles/[slug].js",
                                lineNumber: 53,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/articles/[slug].js",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/articles/[slug].js",
                lineNumber: 49,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/articles/[slug].js",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
_s(Article, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = Article;
var _c;
__turbopack_context__.k.register(_c, "Article");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/pages/articles/[slug].js [client] (ecmascript)\" } [client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const PAGE_PATH = "/articles/[slug]";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/pages/articles/[slug].js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}}),
"[project]/pages/articles/[slug].js (hmr-entry)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, m: module } = __turbopack_context__;
{
__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/pages/articles/[slug].js [client] (ecmascript)\" } [client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__3bcb4120._.js.map