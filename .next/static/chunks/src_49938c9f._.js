(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full overflow-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/src/components/ui/table.tsx",
            lineNumber: 11,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 10,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c7 = TableFooter;
TableFooter.displayName = "TableFooter";
const TableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-b transition-colors data-[state=selected]:bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 59,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c9 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c11 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-4 align-middle [&:has([role=checkbox])]:pr-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 89,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c13 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c14 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/table.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c15 = TableCaption;
TableCaption.displayName = "TableCaption";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableFooter$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableFooter");
__turbopack_context__.k.register(_c8, "TableRow$React.forwardRef");
__turbopack_context__.k.register(_c9, "TableRow");
__turbopack_context__.k.register(_c10, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c11, "TableHead");
__turbopack_context__.k.register(_c12, "TableCell$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCell");
__turbopack_context__.k.register(_c14, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c15, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Input = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, type, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/input.tsx",
        lineNumber: 8,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Input;
Input.displayName = "Input";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Input$React.forwardRef");
__turbopack_context__.k.register(_c1, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/data-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-table/build/lib/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/table-core/build/lib/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/currency-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
function DataTable(param) {
    let { columns, data } = param;
    var _table_getColumn, _table_getColumn1, _table_getRowModel_rows;
    _s();
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [columnFilters, setColumnFilters] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const { formatCurrency } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrency"])();
    const table = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"])({
        data,
        columns,
        getCoreRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCoreRowModel"])(),
        getPaginationRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPaginationRowModel"])(),
        onSortingChange: setSorting,
        getSortedRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSortedRowModel"])(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$table$2d$core$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFilteredRowModel"])(),
        state: {
            sorting,
            columnFilters
        }
    });
    const handleExportPDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        const tableData = table.getFilteredRowModel().rows.map((row)=>row.original);
        doc.text("Asset Register Report", 14, 16);
        doc.autoTable({
            head: [
                [
                    'Code',
                    'Name',
                    'Type',
                    'Purchase Date',
                    'Cost',
                    'Current Value'
                ]
            ],
            body: tableData.map((asset)=>[
                    asset.assetCode,
                    asset.assetName,
                    asset.assetType,
                    asset.purchaseDate,
                    formatCurrency(asset.purchaseCost),
                    formatCurrency(asset.currentValue || 0)
                ]),
            startY: 20
        });
        doc.save('asset-report.pdf');
    };
    const handleExportExcel = ()=>{
        const dataToExport = table.getFilteredRowModel().rows.map((row)=>{
            const asset = row.original;
            return {
                'Asset Code': asset.assetCode,
                'Asset Name': asset.assetName,
                'Type': asset.assetType,
                'Purchase Date': asset.purchaseDate,
                'Purchase Cost': asset.purchaseCost,
                'Current Value': asset.currentValue || 0
            };
        });
        const ws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].json_to_sheet(dataToExport);
        const wb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_new();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["utils"].book_append_sheet(wb, ws, "Assets");
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["writeFile"](wb, "asset-report.xlsx");
    };
    const handlePrint = ()=>{
        window.print();
    };
    var _ref, _ref1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "f86cb1b02a0d828a",
                children: "@media print{body *{visibility:hidden}#printable-area,#printable-area *{visibility:visible}#printable-area{width:100%;position:absolute;top:0;left:0}.no-print{display:none}}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-f86cb1b02a0d828a" + " " + "rounded-md border p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f86cb1b02a0d828a" + " " + "flex items-center py-4 gap-4 no-print",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Filter by asset name...",
                                value: (_ref = (_table_getColumn = table.getColumn('assetName')) === null || _table_getColumn === void 0 ? void 0 : _table_getColumn.getFilterValue()) !== null && _ref !== void 0 ? _ref : '',
                                onChange: (event)=>{
                                    var _table_getColumn;
                                    return (_table_getColumn = table.getColumn('assetName')) === null || _table_getColumn === void 0 ? void 0 : _table_getColumn.setFilterValue(event.target.value);
                                },
                                className: "max-w-sm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/data-table.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                placeholder: "Filter by asset code...",
                                value: (_ref1 = (_table_getColumn1 = table.getColumn('assetCode')) === null || _table_getColumn1 === void 0 ? void 0 : _table_getColumn1.getFilterValue()) !== null && _ref1 !== void 0 ? _ref1 : '',
                                onChange: (event)=>{
                                    var _table_getColumn;
                                    return (_table_getColumn = table.getColumn('assetCode')) === null || _table_getColumn === void 0 ? void 0 : _table_getColumn.setFilterValue(event.target.value);
                                },
                                className: "max-w-sm"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/data-table.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-f86cb1b02a0d828a" + " " + "ml-auto flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handlePrint,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/assets/data-table.tsx",
                                                lineNumber: 154,
                                                columnNumber: 19
                                            }, this),
                                            " Print Report"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/assets/data-table.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handleExportPDF,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/assets/data-table.tsx",
                                                lineNumber: 157,
                                                columnNumber: 19
                                            }, this),
                                            " Export PDF"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/assets/data-table.tsx",
                                        lineNumber: 156,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: handleExportExcel,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/assets/data-table.tsx",
                                                lineNumber: 160,
                                                columnNumber: 19
                                            }, this),
                                            " Export Excel"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/assets/data-table.tsx",
                                        lineNumber: 159,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/data-table.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/data-table.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f86cb1b02a0d828a" + " " + "rounded-md border",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                    children: table.getHeaderGroups().map((headerGroup)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                            children: headerGroup.headers.map((header)=>{
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                    children: header.isPlaceholder ? null : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(header.column.columnDef.header, header.getContext())
                                                }, header.id, false, {
                                                    fileName: "[project]/src/app/assets/data-table.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 23
                                                }, this);
                                            })
                                        }, headerGroup.id, false, {
                                            fileName: "[project]/src/app/assets/data-table.tsx",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/data-table.tsx",
                                    lineNumber: 166,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                    children: ((_table_getRowModel_rows = table.getRowModel().rows) === null || _table_getRowModel_rows === void 0 ? void 0 : _table_getRowModel_rows.length) ? table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                            "data-state": row.getIsSelected() && 'selected',
                                            children: row.getVisibleCells().map((cell)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["flexRender"])(cell.column.columnDef.cell, cell.getContext())
                                                }, cell.id, false, {
                                                    fileName: "[project]/src/app/assets/data-table.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 23
                                                }, this))
                                        }, row.id, false, {
                                            fileName: "[project]/src/app/assets/data-table.tsx",
                                            lineNumber: 187,
                                            columnNumber: 19
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            colSpan: columns.length,
                                            className: "h-24 text-center",
                                            children: "No assets found."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/data-table.tsx",
                                            lineNumber: 203,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/data-table.tsx",
                                        lineNumber: 202,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/data-table.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/data-table.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/assets/data-table.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-f86cb1b02a0d828a" + " " + "flex items-center justify-end space-x-2 py-4 no-print",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                onClick: ()=>table.previousPage(),
                                disabled: !table.getCanPreviousPage(),
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/data-table.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                onClick: ()=>table.nextPage(),
                                disabled: !table.getCanNextPage(),
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/data-table.tsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/data-table.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/assets/data-table.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(DataTable, "VwS8nVzafO1H5BNPoAZ7mKQD1Fs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrency"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$table$2f$build$2f$lib$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useReactTable"]
    ];
});
_c = DataTable;
var _c;
__turbopack_context__.k.register(_c, "DataTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = (param, ref)=>{
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 37,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 48,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/dialog.tsx",
                                lineNumber: 49,
                                columnNumber: 9
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/dialog.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/dialog.tsx",
                lineNumber: 38,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 60,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 74,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 88,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c6 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c8 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DialogOverlay");
__turbopack_context__.k.register(_c1, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "DialogContent");
__turbopack_context__.k.register(_c3, "DialogHeader");
__turbopack_context__.k.register(_c4, "DialogFooter");
__turbopack_context__.k.register(_c5, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "DialogTitle");
__turbopack_context__.k.register(_c7, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/label.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/schema.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assetHistorySchema",
    ()=>assetHistorySchema,
    "assetSchema",
    ()=>assetSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
;
const assetHistorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    assignedTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const assetSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    assetCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Asset code is required.'),
    assetName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Asset name is required.'),
    assetType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Tangible',
        'Intangible'
    ]),
    purchaseDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Purchase date is required.'),
    purchaseCost: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Purchase cost must be a positive number.'),
    depreciationMethod: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Straight-Line',
        'Declining Balance'
    ]),
    usefulLife: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Useful life (in years) must be a positive number.'),
    salvageValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Salvage value must be a positive number.'),
    currentValue: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'In Stock',
        'Assigned',
        'Damaged',
        'Out for Repair',
        'Retired'
    ]).default('In Stock'),
    assignedTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    history: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(assetHistorySchema).optional()
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/data:660738 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"789c3326d885368bb146afedfd91be1b6030378f26":"saveAsset"},"src/app/assets/actions.ts",""] */ __turbopack_context__.s([
    "saveAsset",
    ()=>saveAsset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var saveAsset = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("789c3326d885368bb146afedfd91be1b6030378f26", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "saveAsset"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCB7IGFzc2V0U2NoZW1hLCB0eXBlIEFzc2V0LCB0eXBlIEFzc2V0SGlzdG9yeSB9IGZyb20gJy4vc2NoZW1hJztcblxuY29uc3QgYXNzZXRzRmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hcHAvYXNzZXRzL2Fzc2V0cy1kYXRhLmpzb24nKTtcblxuXG5hc3luYyBmdW5jdGlvbiByZWFkQXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGZzLmFjY2Vzcyhhc3NldHNGaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZShhc3NldHNGaWxlUGF0aCwgJ3V0Zi04Jyk7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICgoZXJyb3IgYXMgTm9kZUpTLkVycm5vRXhjZXB0aW9uKS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGVBc3NldHMoW10pO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVBc3NldHMoZGF0YTogQXNzZXRbXSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShhc3NldHNGaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMiksICd1dGYtOCcpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIGNvbnN0IGFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAvLyBDYWxjdWxhdGUgY3VycmVudCB2YWx1ZSBmb3IgZWFjaCBhc3NldFxuICAgIHJldHVybiBhc3NldHMubWFwKGFzc2V0ID0+IHtcbiAgICAgICAgY29uc3QgZGVwcmVjaWF0aW9uID0gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmFzc2V0LFxuICAgICAgICAgICAgY3VycmVudFZhbHVlOiBhc3NldC5wdXJjaGFzZUNvc3QgLSBkZXByZWNpYXRpb24sXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmNvbnN0IGFkZEFzc2V0Rm9ybVNjaGVtYSA9IGFzc2V0U2NoZW1hLm9taXQoeyBpZDogdHJ1ZSwgY3VycmVudFZhbHVlOiB0cnVlLCBoaXN0b3J5OiB0cnVlIH0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXROZXh0QXNzZXRDb2RlKCkge1xuICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICBsZXQgbWF4TnVtID0gMDtcbiAgICBhbGxBc3NldHMuZm9yRWFjaChhc3NldCA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gYXNzZXQuYXNzZXRDb2RlLm1hdGNoKC9eQVNTRVQtKFxcZCspJC8pO1xuICAgICAgICBpZihtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICAgICAgICAgIGlmIChudW0gPiBtYXhOdW0pIHtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSBudW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYEFTU0VULSR7KG1heE51bSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgJzAnKX1gO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUFzc2V0KGRhdGE6IHouaW5mZXI8dHlwZW9mIGFkZEFzc2V0Rm9ybVNjaGVtYT4sIGlzTmV3UmVjb3JkOiBib29sZWFuLCBpc0F1dG9Db2RlOiBib29sZWFuLCBpZD86IHN0cmluZykge1xuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBhZGRBc3NldEZvcm1TY2hlbWEuc2FmZVBhcnNlKGRhdGEpO1xuICAgIGlmICghdmFsaWRhdGlvbi5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgZGF0YSBmb3JtYXQuJyB9O1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgbGV0IGFzc2V0RGF0YSA9IHZhbGlkYXRpb24uZGF0YTtcblxuICAgICAgICBpZiAoaXNOZXdSZWNvcmQpIHsgLy8gQ3JlYXRlIG5ld1xuICAgICAgICAgICAgaWYgKGlzQXV0b0NvZGUpIHtcbiAgICAgICAgICAgICAgICBhc3NldERhdGEuYXNzZXRDb2RlID0gYXdhaXQgZ2V0TmV4dEFzc2V0Q29kZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldEV4aXN0cyA9IGFsbEFzc2V0cy5zb21lKGEgPT4gYS5hc3NldENvZGUgPT09IGFzc2V0RGF0YS5hc3NldENvZGUpO1xuICAgICAgICAgICAgICAgIGlmKGFzc2V0RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBBc3NldCB3aXRoIGNvZGUgXCIke2Fzc2V0RGF0YS5hc3NldENvZGV9XCIgYWxyZWFkeSBleGlzdHMuYCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld0Fzc2V0OiBBc3NldCA9IHtcbiAgICAgICAgICAgICAgICAuLi5hc3NldERhdGEsXG4gICAgICAgICAgICAgICAgaWQ6IGBBU1NFVC0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ0luIFN0b2NrJyxcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduZWRUbzogJycsXG4gICAgICAgICAgICAgICAgICAgIG5vdGVzOiAnQXNzZXQgY3JlYXRlZC4nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhbGxBc3NldHMucHVzaChuZXdBc3NldCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFVwZGF0ZSBleGlzdGluZ1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhbGxBc3NldHMuZmluZEluZGV4KGEgPT4gYS5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggPT09IC0xKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJ307XG4gICAgICAgICAgICBhbGxBc3NldHNbaW5kZXhdID0geyAuLi5hbGxBc3NldHNbaW5kZXhdLCAuLi5hc3NldERhdGEgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHdyaXRlQXNzZXRzKGFsbEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGFzc2V0RGF0YSB9O1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfHwgJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQuJyB9O1xuICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXNzZXQoYXNzZXRJZDogc3RyaW5nKSB7XG4gICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFzc2V0cyA9IGFsbEFzc2V0cy5maWx0ZXIoYXNzZXQgPT4gYXNzZXQuaWQgIT09IGFzc2V0SWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGFsbEFzc2V0cy5sZW5ndGggPT09IHVwZGF0ZWRBc3NldHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgd3JpdGVBc3NldHModXBkYXRlZEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIHx8ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLicgfTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0OiBBc3NldCk6IG51bWJlciB7XG4gICAgY29uc3QgcHVyY2hhc2VEYXRlID0gbmV3IERhdGUoYXNzZXQucHVyY2hhc2VEYXRlKTtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGFnZUluWWVhcnMgPSAobm93LmdldFRpbWUoKSAtIHB1cmNoYXNlRGF0ZS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQgKiAzNjUuMjUpO1xuXG4gICAgaWYgKGFnZUluWWVhcnMgPD0gMCB8fCBhc3NldC51c2VmdWxMaWZlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgZWZmZWN0aXZlQWdlID0gTWF0aC5taW4oYWdlSW5ZZWFycywgYXNzZXQudXNlZnVsTGlmZSk7XG4gICAgY29uc3QgZGVwcmVjaWFibGVWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdCAtIGFzc2V0LnNhbHZhZ2VWYWx1ZTtcblxuICAgIGlmIChkZXByZWNpYWJsZVZhbHVlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsRGVwcmVjaWF0aW9uID0gMDtcblxuICAgIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdTdHJhaWdodC1MaW5lJykge1xuICAgICAgICBjb25zdCBhbm51YWxEZXByZWNpYXRpb24gPSBkZXByZWNpYWJsZVZhbHVlIC8gYXNzZXQudXNlZnVsTGlmZTtcbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhbm51YWxEZXByZWNpYXRpb24gKiBlZmZlY3RpdmVBZ2U7XG4gICAgfSBlbHNlIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdEZWNsaW5pbmcgQmFsYW5jZScpIHtcbiAgICAgICAgY29uc3QgcmF0ZSA9ICgxIC8gYXNzZXQudXNlZnVsTGlmZSkgKiAyOyAvLyBEb3VibGUtZGVjbGluaW5nIGJhbGFuY2VcbiAgICAgICAgbGV0IGJvb2tWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKGVmZmVjdGl2ZUFnZSk7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW5udWFsRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZTtcbiAgICAgICAgICAgIGJvb2tWYWx1ZSAtPSBhbm51YWxEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJvcmF0ZSBmb3IgdGhlIHBhcnRpYWwgeWVhclxuICAgICAgICBpZiAoZWZmZWN0aXZlQWdlICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgIGNvbnN0IHBhcnRpYWxZZWFyRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZSAqIChlZmZlY3RpdmVBZ2UgJSAxKTtcbiAgICAgICAgICAgICBib29rVmFsdWUgLT0gcGFydGlhbFllYXJEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhc3NldC5wdXJjaGFzZUNvc3QgLSBib29rVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWluKHRvdGFsRGVwcmVjaWF0aW9uLCBkZXByZWNpYWJsZVZhbHVlKTtcbn1cblxuY29uc3QgdXBkYXRlU3RhdHVzU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIGlkOiB6LnN0cmluZygpLFxuICAgIHN0YXR1czogei5lbnVtKFsnSW4gU3RvY2snLCAnQXNzaWduZWQnLCAnRGFtYWdlZCcsICdPdXQgZm9yIFJlcGFpcicsICdSZXRpcmVkJ10pLFxuICAgIGFzc2lnbmVkVG86IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBub3Rlczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVBc3NldFN0YXR1cyhkYXRhOiB6LmluZmVyPHR5cGVvZiB1cGRhdGVTdGF0dXNTY2hlbWE+KSB7XG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IHVwZGF0ZVN0YXR1c1NjaGVtYS5zYWZlUGFyc2UoZGF0YSk7XG4gICAgaWYgKCF2YWxpZGF0aW9uLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBkYXRhIGZvcm1hdC4nIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYWxsQXNzZXRzID0gYXdhaXQgcmVhZEFzc2V0cygpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGFsbEFzc2V0cy5maW5kSW5kZXgoYSA9PiBhLmlkID09PSBkYXRhLmlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXNzZXQgbm90IGZvdW5kLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0hpc3RvcnlFbnRyeTogQXNzZXRIaXN0b3J5ID0ge1xuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIG5vdGVzOiBkYXRhLm5vdGVzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGFsbEFzc2V0c1tpbmRleF0gPSB7XG4gICAgICAgICAgICAuLi5hbGxBc3NldHNbaW5kZXhdLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIGhpc3Rvcnk6IFsuLi4oYWxsQXNzZXRzW2luZGV4XS5oaXN0b3J5IHx8IFtdKSwgbmV3SGlzdG9yeUVudHJ5XSxcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCB3cml0ZUFzc2V0cyhhbGxBc3NldHMpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL2Fzc2V0cycpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhbGxBc3NldHNbaW5kZXhdIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5cbiAgICAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjRSQTJEc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Textarea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/textarea.tsx",
        lineNumber: 11,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Textarea;
Textarea.displayName = 'Textarea';
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Textarea$React.forwardRef");
__turbopack_context__.k.register(_c1, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/switch.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Switch",
    ()=>Switch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-switch/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Switch = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
        ...props,
        ref: ref,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Thumb"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0")
        }, void 0, false, {
            fileName: "[project]/src/components/ui/switch.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/switch.tsx",
        lineNumber: 12,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Switch;
Switch.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$switch$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Switch$React.forwardRef");
__turbopack_context__.k.register(_c1, "Switch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/add-asset-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AddAssetDialog",
    ()=>AddAssetDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/schema.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$660738__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/assets/data:660738 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/switch.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
;
;
;
const formSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$schema$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["assetSchema"].omit({
    id: true,
    currentValue: true,
    history: true
});
function AddAssetDialog(param) {
    let { asset, onAssetAdded, children, isOpen: externalOpen, setIsOpen: setExternalOpen } = param;
    _s();
    const [internalOpen, setInternalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isOpen = externalOpen !== null && externalOpen !== void 0 ? externalOpen : internalOpen;
    const setIsOpen = setExternalOpen !== null && setExternalOpen !== void 0 ? setExternalOpen : setInternalOpen;
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAutoCode, setIsAutoCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { register, handleSubmit, control, reset, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(formSchema)
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddAssetDialog.useEffect": ()=>{
            if (isOpen) {
                if (asset) {
                    reset(asset);
                    setIsAutoCode(false);
                } else {
                    reset({
                        assetCode: '',
                        assetName: '',
                        assetType: 'Tangible',
                        purchaseDate: new Date().toISOString().split('T')[0],
                        purchaseCost: 0,
                        depreciationMethod: 'Straight-Line',
                        usefulLife: 5,
                        salvageValue: 0,
                        status: 'In Stock',
                        assignedTo: '',
                        notes: ''
                    });
                    setIsAutoCode(true);
                }
            }
        }
    }["AddAssetDialog.useEffect"], [
        isOpen,
        asset,
        reset
    ]);
    const onSubmit = async (data)=>{
        setIsSaving(true);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$660738__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["saveAsset"])(data, !asset, isAutoCode, asset === null || asset === void 0 ? void 0 : asset.id);
        if (result.success) {
            toast({
                title: asset ? 'Asset Updated' : 'Asset Added',
                description: "Successfully ".concat(asset ? 'updated' : 'added', ' asset "').concat(data.assetName, '".')
            });
            setIsOpen(false);
            onAssetAdded();
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error
            });
        }
        setIsSaving(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: setIsOpen,
        children: [
            children ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                lineNumber: 108,
                columnNumber: 13
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                            lineNumber: 112,
                            columnNumber: 17
                        }, this),
                        " Add New Asset"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                    lineNumber: 111,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "sm:max-w-2xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit(onSubmit),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: asset ? 'Edit Asset' : 'Add New Asset'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 119,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: "Fill in the details below to record a new company asset."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 120,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "assetCode",
                                                    children: "Asset Code"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "assetCode",
                                                    ...register('assetCode'),
                                                    disabled: isAutoCode
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 25
                                                }, this),
                                                errors.assetCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-destructive text-xs mt-1",
                                                    children: errors.assetCode.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 126,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-end space-x-2 pb-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"], {
                                                    id: "auto-code-switch",
                                                    checked: isAutoCode,
                                                    onCheckedChange: setIsAutoCode,
                                                    disabled: !!asset
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "auto-code-switch",
                                                    children: "Auto-generate Code"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 131,
                                            columnNumber: 22
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "assetName",
                                                    children: "Asset Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "assetName",
                                                    ...register('assetName')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 25
                                                }, this),
                                                errors.assetName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-destructive text-xs mt-1",
                                                    children: errors.assetName.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 46
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 140,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 125,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "assetType",
                                            children: "Asset Type"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 147,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controller"], {
                                            name: "assetType",
                                            control: control,
                                            render: (param)=>{
                                                let { field } = param;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                    onValueChange: field.onChange,
                                                    value: field.value,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                lineNumber: 153,
                                                                columnNumber: 48
                                                            }, void 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 33
                                                        }, void 0),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "Tangible",
                                                                    children: "Tangible"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                    lineNumber: 155,
                                                                    columnNumber: 37
                                                                }, void 0),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: "Intangible",
                                                                    children: "Intangible"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                    lineNumber: 156,
                                                                    columnNumber: 37
                                                                }, void 0)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 154,
                                                            columnNumber: 33
                                                        }, void 0)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 152,
                                                    columnNumber: 29
                                                }, void 0);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 148,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 146,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "purchaseDate",
                                                    children: "Purchase Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "purchaseDate",
                                                    type: "date",
                                                    ...register('purchaseDate')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 164,
                                                    columnNumber: 25
                                                }, this),
                                                errors.purchaseDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-destructive text-xs mt-1",
                                                    children: errors.purchaseDate.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 162,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "purchaseCost",
                                                    children: "Purchase Cost"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "purchaseCost",
                                                    type: "number",
                                                    ...register('purchaseCost', {
                                                        valueAsNumber: true
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 169,
                                                    columnNumber: 25
                                                }, this),
                                                errors.purchaseCost && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-destructive text-xs mt-1",
                                                    children: errors.purchaseCost.message
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 49
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 167,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 161,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Depreciation Details"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 174,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "depreciationMethod",
                                                            children: "Method"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controller"], {
                                                            name: "depreciationMethod",
                                                            control: control,
                                                            render: (param)=>{
                                                                let { field } = param;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                                    onValueChange: field.onChange,
                                                                    value: field.value,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                                                fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                                lineNumber: 183,
                                                                                columnNumber: 56
                                                                            }, void 0)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                            lineNumber: 183,
                                                                            columnNumber: 41
                                                                        }, void 0),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                    value: "Straight-Line",
                                                                                    children: "Straight-Line"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                                    lineNumber: 185,
                                                                                    columnNumber: 45
                                                                                }, void 0),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                                    value: "Declining Balance",
                                                                                    children: "Declining Balance"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                                    lineNumber: 186,
                                                                                    columnNumber: 45
                                                                                }, void 0)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                            lineNumber: 184,
                                                                            columnNumber: 41
                                                                        }, void 0)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                                    lineNumber: 182,
                                                                    columnNumber: 37
                                                                }, void 0);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 178,
                                                            columnNumber: 30
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "usefulLife",
                                                            children: "Useful Life (Years)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "usefulLife",
                                                            type: "number",
                                                            ...register('usefulLife', {
                                                                valueAsNumber: true
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 29
                                                        }, this),
                                                        errors.usefulLife && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-destructive text-xs mt-1",
                                                            children: errors.usefulLife.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 195,
                                                            columnNumber: 51
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                            htmlFor: "salvageValue",
                                                            children: "Salvage Value"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                            id: "salvageValue",
                                                            type: "number",
                                                            ...register('salvageValue', {
                                                                valueAsNumber: true
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 199,
                                                            columnNumber: 29
                                                        }, this),
                                                        errors.salvageValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-destructive text-xs mt-1",
                                                            children: errors.salvageValue.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                            lineNumber: 200,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                                    lineNumber: 197,
                                                    columnNumber: 26
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 175,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 173,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                            htmlFor: "notes",
                                            children: "Initial Notes"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 205,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                            id: "notes",
                                            ...register('notes'),
                                            placeholder: "e.g., Warranty information, initial condition..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 206,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 204,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogClose"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "outline",
                                        onClick: ()=>reset(),
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                        lineNumber: 211,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 210,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "submit",
                                    disabled: isSaving,
                                    children: [
                                        isSaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "mr-2 h-4 w-4 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                            lineNumber: 214,
                                            columnNumber: 34
                                        }, this),
                                        asset ? 'Save Changes' : 'Add Asset'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                                    lineNumber: 213,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                            lineNumber: 209,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                    lineNumber: 117,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/assets/add-asset-dialog.tsx",
        lineNumber: 106,
        columnNumber: 5
    }, this);
}
_s(AddAssetDialog, "Su99kIM+UhfK3EvAatrWebedoyE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = AddAssetDialog;
var _c;
__turbopack_context__.k.register(_c, "AddAssetDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const AlertDialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const AlertDialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c = AlertDialogOverlay;
AlertDialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const AlertDialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 35,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/alert-dialog.tsx",
                lineNumber: 36,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 34,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = AlertDialogContent;
AlertDialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const AlertDialogHeader = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 52,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = AlertDialogHeader;
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = (param)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 66,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c4 = AlertDialogFooter;
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 80,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c6 = AlertDialogTitle;
AlertDialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const AlertDialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 92,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c8 = AlertDialogDescription;
AlertDialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
const AlertDialogAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 105,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c10 = AlertDialogAction;
AlertDialogAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const AlertDialogCancel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c11 = (param, ref)=>{
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), "mt-2 sm:mt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/alert-dialog.tsx",
        lineNumber: 117,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c12 = AlertDialogCancel;
AlertDialogCancel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "AlertDialogOverlay");
__turbopack_context__.k.register(_c1, "AlertDialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "AlertDialogContent");
__turbopack_context__.k.register(_c3, "AlertDialogHeader");
__turbopack_context__.k.register(_c4, "AlertDialogFooter");
__turbopack_context__.k.register(_c5, "AlertDialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "AlertDialogTitle");
__turbopack_context__.k.register(_c7, "AlertDialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "AlertDialogDescription");
__turbopack_context__.k.register(_c9, "AlertDialogAction$React.forwardRef");
__turbopack_context__.k.register(_c10, "AlertDialogAction");
__turbopack_context__.k.register(_c11, "AlertDialogCancel$React.forwardRef");
__turbopack_context__.k.register(_c12, "AlertDialogCancel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/data:d8ab10 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40c6404c624d7417afb3034dcb5a42c8ecb2ce81bf":"deleteAsset"},"src/app/assets/actions.ts",""] */ __turbopack_context__.s([
    "deleteAsset",
    ()=>deleteAsset
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var deleteAsset = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40c6404c624d7417afb3034dcb5a42c8ecb2ce81bf", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteAsset"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCB7IGFzc2V0U2NoZW1hLCB0eXBlIEFzc2V0LCB0eXBlIEFzc2V0SGlzdG9yeSB9IGZyb20gJy4vc2NoZW1hJztcblxuY29uc3QgYXNzZXRzRmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hcHAvYXNzZXRzL2Fzc2V0cy1kYXRhLmpzb24nKTtcblxuXG5hc3luYyBmdW5jdGlvbiByZWFkQXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGZzLmFjY2Vzcyhhc3NldHNGaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZShhc3NldHNGaWxlUGF0aCwgJ3V0Zi04Jyk7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICgoZXJyb3IgYXMgTm9kZUpTLkVycm5vRXhjZXB0aW9uKS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGVBc3NldHMoW10pO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVBc3NldHMoZGF0YTogQXNzZXRbXSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShhc3NldHNGaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMiksICd1dGYtOCcpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIGNvbnN0IGFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAvLyBDYWxjdWxhdGUgY3VycmVudCB2YWx1ZSBmb3IgZWFjaCBhc3NldFxuICAgIHJldHVybiBhc3NldHMubWFwKGFzc2V0ID0+IHtcbiAgICAgICAgY29uc3QgZGVwcmVjaWF0aW9uID0gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmFzc2V0LFxuICAgICAgICAgICAgY3VycmVudFZhbHVlOiBhc3NldC5wdXJjaGFzZUNvc3QgLSBkZXByZWNpYXRpb24sXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmNvbnN0IGFkZEFzc2V0Rm9ybVNjaGVtYSA9IGFzc2V0U2NoZW1hLm9taXQoeyBpZDogdHJ1ZSwgY3VycmVudFZhbHVlOiB0cnVlLCBoaXN0b3J5OiB0cnVlIH0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXROZXh0QXNzZXRDb2RlKCkge1xuICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICBsZXQgbWF4TnVtID0gMDtcbiAgICBhbGxBc3NldHMuZm9yRWFjaChhc3NldCA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gYXNzZXQuYXNzZXRDb2RlLm1hdGNoKC9eQVNTRVQtKFxcZCspJC8pO1xuICAgICAgICBpZihtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICAgICAgICAgIGlmIChudW0gPiBtYXhOdW0pIHtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSBudW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYEFTU0VULSR7KG1heE51bSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgJzAnKX1gO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUFzc2V0KGRhdGE6IHouaW5mZXI8dHlwZW9mIGFkZEFzc2V0Rm9ybVNjaGVtYT4sIGlzTmV3UmVjb3JkOiBib29sZWFuLCBpc0F1dG9Db2RlOiBib29sZWFuLCBpZD86IHN0cmluZykge1xuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBhZGRBc3NldEZvcm1TY2hlbWEuc2FmZVBhcnNlKGRhdGEpO1xuICAgIGlmICghdmFsaWRhdGlvbi5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgZGF0YSBmb3JtYXQuJyB9O1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgbGV0IGFzc2V0RGF0YSA9IHZhbGlkYXRpb24uZGF0YTtcblxuICAgICAgICBpZiAoaXNOZXdSZWNvcmQpIHsgLy8gQ3JlYXRlIG5ld1xuICAgICAgICAgICAgaWYgKGlzQXV0b0NvZGUpIHtcbiAgICAgICAgICAgICAgICBhc3NldERhdGEuYXNzZXRDb2RlID0gYXdhaXQgZ2V0TmV4dEFzc2V0Q29kZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldEV4aXN0cyA9IGFsbEFzc2V0cy5zb21lKGEgPT4gYS5hc3NldENvZGUgPT09IGFzc2V0RGF0YS5hc3NldENvZGUpO1xuICAgICAgICAgICAgICAgIGlmKGFzc2V0RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBBc3NldCB3aXRoIGNvZGUgXCIke2Fzc2V0RGF0YS5hc3NldENvZGV9XCIgYWxyZWFkeSBleGlzdHMuYCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld0Fzc2V0OiBBc3NldCA9IHtcbiAgICAgICAgICAgICAgICAuLi5hc3NldERhdGEsXG4gICAgICAgICAgICAgICAgaWQ6IGBBU1NFVC0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ0luIFN0b2NrJyxcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduZWRUbzogJycsXG4gICAgICAgICAgICAgICAgICAgIG5vdGVzOiAnQXNzZXQgY3JlYXRlZC4nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhbGxBc3NldHMucHVzaChuZXdBc3NldCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFVwZGF0ZSBleGlzdGluZ1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhbGxBc3NldHMuZmluZEluZGV4KGEgPT4gYS5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggPT09IC0xKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJ307XG4gICAgICAgICAgICBhbGxBc3NldHNbaW5kZXhdID0geyAuLi5hbGxBc3NldHNbaW5kZXhdLCAuLi5hc3NldERhdGEgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHdyaXRlQXNzZXRzKGFsbEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGFzc2V0RGF0YSB9O1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfHwgJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQuJyB9O1xuICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXNzZXQoYXNzZXRJZDogc3RyaW5nKSB7XG4gICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFzc2V0cyA9IGFsbEFzc2V0cy5maWx0ZXIoYXNzZXQgPT4gYXNzZXQuaWQgIT09IGFzc2V0SWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGFsbEFzc2V0cy5sZW5ndGggPT09IHVwZGF0ZWRBc3NldHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgd3JpdGVBc3NldHModXBkYXRlZEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIHx8ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLicgfTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0OiBBc3NldCk6IG51bWJlciB7XG4gICAgY29uc3QgcHVyY2hhc2VEYXRlID0gbmV3IERhdGUoYXNzZXQucHVyY2hhc2VEYXRlKTtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGFnZUluWWVhcnMgPSAobm93LmdldFRpbWUoKSAtIHB1cmNoYXNlRGF0ZS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQgKiAzNjUuMjUpO1xuXG4gICAgaWYgKGFnZUluWWVhcnMgPD0gMCB8fCBhc3NldC51c2VmdWxMaWZlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgZWZmZWN0aXZlQWdlID0gTWF0aC5taW4oYWdlSW5ZZWFycywgYXNzZXQudXNlZnVsTGlmZSk7XG4gICAgY29uc3QgZGVwcmVjaWFibGVWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdCAtIGFzc2V0LnNhbHZhZ2VWYWx1ZTtcblxuICAgIGlmIChkZXByZWNpYWJsZVZhbHVlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsRGVwcmVjaWF0aW9uID0gMDtcblxuICAgIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdTdHJhaWdodC1MaW5lJykge1xuICAgICAgICBjb25zdCBhbm51YWxEZXByZWNpYXRpb24gPSBkZXByZWNpYWJsZVZhbHVlIC8gYXNzZXQudXNlZnVsTGlmZTtcbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhbm51YWxEZXByZWNpYXRpb24gKiBlZmZlY3RpdmVBZ2U7XG4gICAgfSBlbHNlIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdEZWNsaW5pbmcgQmFsYW5jZScpIHtcbiAgICAgICAgY29uc3QgcmF0ZSA9ICgxIC8gYXNzZXQudXNlZnVsTGlmZSkgKiAyOyAvLyBEb3VibGUtZGVjbGluaW5nIGJhbGFuY2VcbiAgICAgICAgbGV0IGJvb2tWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKGVmZmVjdGl2ZUFnZSk7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW5udWFsRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZTtcbiAgICAgICAgICAgIGJvb2tWYWx1ZSAtPSBhbm51YWxEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJvcmF0ZSBmb3IgdGhlIHBhcnRpYWwgeWVhclxuICAgICAgICBpZiAoZWZmZWN0aXZlQWdlICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgIGNvbnN0IHBhcnRpYWxZZWFyRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZSAqIChlZmZlY3RpdmVBZ2UgJSAxKTtcbiAgICAgICAgICAgICBib29rVmFsdWUgLT0gcGFydGlhbFllYXJEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhc3NldC5wdXJjaGFzZUNvc3QgLSBib29rVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWluKHRvdGFsRGVwcmVjaWF0aW9uLCBkZXByZWNpYWJsZVZhbHVlKTtcbn1cblxuY29uc3QgdXBkYXRlU3RhdHVzU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIGlkOiB6LnN0cmluZygpLFxuICAgIHN0YXR1czogei5lbnVtKFsnSW4gU3RvY2snLCAnQXNzaWduZWQnLCAnRGFtYWdlZCcsICdPdXQgZm9yIFJlcGFpcicsICdSZXRpcmVkJ10pLFxuICAgIGFzc2lnbmVkVG86IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBub3Rlczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVBc3NldFN0YXR1cyhkYXRhOiB6LmluZmVyPHR5cGVvZiB1cGRhdGVTdGF0dXNTY2hlbWE+KSB7XG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IHVwZGF0ZVN0YXR1c1NjaGVtYS5zYWZlUGFyc2UoZGF0YSk7XG4gICAgaWYgKCF2YWxpZGF0aW9uLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBkYXRhIGZvcm1hdC4nIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYWxsQXNzZXRzID0gYXdhaXQgcmVhZEFzc2V0cygpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGFsbEFzc2V0cy5maW5kSW5kZXgoYSA9PiBhLmlkID09PSBkYXRhLmlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXNzZXQgbm90IGZvdW5kLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0hpc3RvcnlFbnRyeTogQXNzZXRIaXN0b3J5ID0ge1xuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIG5vdGVzOiBkYXRhLm5vdGVzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGFsbEFzc2V0c1tpbmRleF0gPSB7XG4gICAgICAgICAgICAuLi5hbGxBc3NldHNbaW5kZXhdLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIGhpc3Rvcnk6IFsuLi4oYWxsQXNzZXRzW2luZGV4XS5oaXN0b3J5IHx8IFtdKSwgbmV3SGlzdG9yeUVudHJ5XSxcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCB3cml0ZUFzc2V0cyhhbGxBc3NldHMpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL2Fzc2V0cycpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhbGxBc3NldHNbaW5kZXhdIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5cbiAgICAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjhSQXlHc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary text-primary-foreground",
            secondary: "border-transparent bg-secondary text-secondary-foreground",
            destructive: "border-transparent bg-destructive text-destructive-foreground",
            outline: "text-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
function Badge(param) {
    let { className, variant, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/badge.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/data:bdc0e4 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40f328228b962aafeb7b0f1c0b97aa58bd57093218":"updateAssetStatus"},"src/app/assets/actions.ts",""] */ __turbopack_context__.s([
    "updateAssetStatus",
    ()=>updateAssetStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updateAssetStatus = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40f328228b962aafeb7b0f1c0b97aa58bd57093218", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateAssetStatus"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCB7IGFzc2V0U2NoZW1hLCB0eXBlIEFzc2V0LCB0eXBlIEFzc2V0SGlzdG9yeSB9IGZyb20gJy4vc2NoZW1hJztcblxuY29uc3QgYXNzZXRzRmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hcHAvYXNzZXRzL2Fzc2V0cy1kYXRhLmpzb24nKTtcblxuXG5hc3luYyBmdW5jdGlvbiByZWFkQXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGZzLmFjY2Vzcyhhc3NldHNGaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZShhc3NldHNGaWxlUGF0aCwgJ3V0Zi04Jyk7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICgoZXJyb3IgYXMgTm9kZUpTLkVycm5vRXhjZXB0aW9uKS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGVBc3NldHMoW10pO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVBc3NldHMoZGF0YTogQXNzZXRbXSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShhc3NldHNGaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMiksICd1dGYtOCcpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIGNvbnN0IGFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAvLyBDYWxjdWxhdGUgY3VycmVudCB2YWx1ZSBmb3IgZWFjaCBhc3NldFxuICAgIHJldHVybiBhc3NldHMubWFwKGFzc2V0ID0+IHtcbiAgICAgICAgY29uc3QgZGVwcmVjaWF0aW9uID0gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmFzc2V0LFxuICAgICAgICAgICAgY3VycmVudFZhbHVlOiBhc3NldC5wdXJjaGFzZUNvc3QgLSBkZXByZWNpYXRpb24sXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmNvbnN0IGFkZEFzc2V0Rm9ybVNjaGVtYSA9IGFzc2V0U2NoZW1hLm9taXQoeyBpZDogdHJ1ZSwgY3VycmVudFZhbHVlOiB0cnVlLCBoaXN0b3J5OiB0cnVlIH0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXROZXh0QXNzZXRDb2RlKCkge1xuICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICBsZXQgbWF4TnVtID0gMDtcbiAgICBhbGxBc3NldHMuZm9yRWFjaChhc3NldCA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gYXNzZXQuYXNzZXRDb2RlLm1hdGNoKC9eQVNTRVQtKFxcZCspJC8pO1xuICAgICAgICBpZihtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICAgICAgICAgIGlmIChudW0gPiBtYXhOdW0pIHtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSBudW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYEFTU0VULSR7KG1heE51bSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgJzAnKX1gO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUFzc2V0KGRhdGE6IHouaW5mZXI8dHlwZW9mIGFkZEFzc2V0Rm9ybVNjaGVtYT4sIGlzTmV3UmVjb3JkOiBib29sZWFuLCBpc0F1dG9Db2RlOiBib29sZWFuLCBpZD86IHN0cmluZykge1xuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBhZGRBc3NldEZvcm1TY2hlbWEuc2FmZVBhcnNlKGRhdGEpO1xuICAgIGlmICghdmFsaWRhdGlvbi5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgZGF0YSBmb3JtYXQuJyB9O1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgbGV0IGFzc2V0RGF0YSA9IHZhbGlkYXRpb24uZGF0YTtcblxuICAgICAgICBpZiAoaXNOZXdSZWNvcmQpIHsgLy8gQ3JlYXRlIG5ld1xuICAgICAgICAgICAgaWYgKGlzQXV0b0NvZGUpIHtcbiAgICAgICAgICAgICAgICBhc3NldERhdGEuYXNzZXRDb2RlID0gYXdhaXQgZ2V0TmV4dEFzc2V0Q29kZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldEV4aXN0cyA9IGFsbEFzc2V0cy5zb21lKGEgPT4gYS5hc3NldENvZGUgPT09IGFzc2V0RGF0YS5hc3NldENvZGUpO1xuICAgICAgICAgICAgICAgIGlmKGFzc2V0RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBBc3NldCB3aXRoIGNvZGUgXCIke2Fzc2V0RGF0YS5hc3NldENvZGV9XCIgYWxyZWFkeSBleGlzdHMuYCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld0Fzc2V0OiBBc3NldCA9IHtcbiAgICAgICAgICAgICAgICAuLi5hc3NldERhdGEsXG4gICAgICAgICAgICAgICAgaWQ6IGBBU1NFVC0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ0luIFN0b2NrJyxcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduZWRUbzogJycsXG4gICAgICAgICAgICAgICAgICAgIG5vdGVzOiAnQXNzZXQgY3JlYXRlZC4nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhbGxBc3NldHMucHVzaChuZXdBc3NldCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFVwZGF0ZSBleGlzdGluZ1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhbGxBc3NldHMuZmluZEluZGV4KGEgPT4gYS5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggPT09IC0xKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJ307XG4gICAgICAgICAgICBhbGxBc3NldHNbaW5kZXhdID0geyAuLi5hbGxBc3NldHNbaW5kZXhdLCAuLi5hc3NldERhdGEgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHdyaXRlQXNzZXRzKGFsbEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGFzc2V0RGF0YSB9O1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfHwgJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQuJyB9O1xuICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXNzZXQoYXNzZXRJZDogc3RyaW5nKSB7XG4gICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFzc2V0cyA9IGFsbEFzc2V0cy5maWx0ZXIoYXNzZXQgPT4gYXNzZXQuaWQgIT09IGFzc2V0SWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGFsbEFzc2V0cy5sZW5ndGggPT09IHVwZGF0ZWRBc3NldHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgd3JpdGVBc3NldHModXBkYXRlZEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIHx8ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLicgfTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0OiBBc3NldCk6IG51bWJlciB7XG4gICAgY29uc3QgcHVyY2hhc2VEYXRlID0gbmV3IERhdGUoYXNzZXQucHVyY2hhc2VEYXRlKTtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGFnZUluWWVhcnMgPSAobm93LmdldFRpbWUoKSAtIHB1cmNoYXNlRGF0ZS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQgKiAzNjUuMjUpO1xuXG4gICAgaWYgKGFnZUluWWVhcnMgPD0gMCB8fCBhc3NldC51c2VmdWxMaWZlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgZWZmZWN0aXZlQWdlID0gTWF0aC5taW4oYWdlSW5ZZWFycywgYXNzZXQudXNlZnVsTGlmZSk7XG4gICAgY29uc3QgZGVwcmVjaWFibGVWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdCAtIGFzc2V0LnNhbHZhZ2VWYWx1ZTtcblxuICAgIGlmIChkZXByZWNpYWJsZVZhbHVlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsRGVwcmVjaWF0aW9uID0gMDtcblxuICAgIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdTdHJhaWdodC1MaW5lJykge1xuICAgICAgICBjb25zdCBhbm51YWxEZXByZWNpYXRpb24gPSBkZXByZWNpYWJsZVZhbHVlIC8gYXNzZXQudXNlZnVsTGlmZTtcbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhbm51YWxEZXByZWNpYXRpb24gKiBlZmZlY3RpdmVBZ2U7XG4gICAgfSBlbHNlIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdEZWNsaW5pbmcgQmFsYW5jZScpIHtcbiAgICAgICAgY29uc3QgcmF0ZSA9ICgxIC8gYXNzZXQudXNlZnVsTGlmZSkgKiAyOyAvLyBEb3VibGUtZGVjbGluaW5nIGJhbGFuY2VcbiAgICAgICAgbGV0IGJvb2tWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKGVmZmVjdGl2ZUFnZSk7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW5udWFsRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZTtcbiAgICAgICAgICAgIGJvb2tWYWx1ZSAtPSBhbm51YWxEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJvcmF0ZSBmb3IgdGhlIHBhcnRpYWwgeWVhclxuICAgICAgICBpZiAoZWZmZWN0aXZlQWdlICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgIGNvbnN0IHBhcnRpYWxZZWFyRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZSAqIChlZmZlY3RpdmVBZ2UgJSAxKTtcbiAgICAgICAgICAgICBib29rVmFsdWUgLT0gcGFydGlhbFllYXJEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhc3NldC5wdXJjaGFzZUNvc3QgLSBib29rVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWluKHRvdGFsRGVwcmVjaWF0aW9uLCBkZXByZWNpYWJsZVZhbHVlKTtcbn1cblxuY29uc3QgdXBkYXRlU3RhdHVzU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIGlkOiB6LnN0cmluZygpLFxuICAgIHN0YXR1czogei5lbnVtKFsnSW4gU3RvY2snLCAnQXNzaWduZWQnLCAnRGFtYWdlZCcsICdPdXQgZm9yIFJlcGFpcicsICdSZXRpcmVkJ10pLFxuICAgIGFzc2lnbmVkVG86IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBub3Rlczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVBc3NldFN0YXR1cyhkYXRhOiB6LmluZmVyPHR5cGVvZiB1cGRhdGVTdGF0dXNTY2hlbWE+KSB7XG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IHVwZGF0ZVN0YXR1c1NjaGVtYS5zYWZlUGFyc2UoZGF0YSk7XG4gICAgaWYgKCF2YWxpZGF0aW9uLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBkYXRhIGZvcm1hdC4nIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYWxsQXNzZXRzID0gYXdhaXQgcmVhZEFzc2V0cygpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGFsbEFzc2V0cy5maW5kSW5kZXgoYSA9PiBhLmlkID09PSBkYXRhLmlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXNzZXQgbm90IGZvdW5kLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0hpc3RvcnlFbnRyeTogQXNzZXRIaXN0b3J5ID0ge1xuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIG5vdGVzOiBkYXRhLm5vdGVzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGFsbEFzc2V0c1tpbmRleF0gPSB7XG4gICAgICAgICAgICAuLi5hbGxBc3NldHNbaW5kZXhdLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIGhpc3Rvcnk6IFsuLi4oYWxsQXNzZXRzW2luZGV4XS5oaXN0b3J5IHx8IFtdKSwgbmV3SGlzdG9yeUVudHJ5XSxcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCB3cml0ZUFzc2V0cyhhbGxBc3NldHMpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL2Fzc2V0cycpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhbGxBc3NldHNbaW5kZXhdIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5cbiAgICAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Im9TQTBLc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/update-status-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UpdateStatusDialog",
    ()=>UpdateStatusDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$bdc0e4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/assets/data:bdc0e4 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/select.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
;
;
const updateStatusSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'In Stock',
        'Assigned',
        'Damaged',
        'Out for Repair',
        'Retired'
    ]),
    assignedTo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
function UpdateStatusDialog(param) {
    let { asset, isOpen, setIsOpen, onSuccess } = param;
    _s();
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { register, handleSubmit, control, reset, formState: { errors } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(updateStatusSchema),
        defaultValues: {
            id: asset.id,
            status: asset.status || 'In Stock',
            assignedTo: asset.assignedTo || '',
            notes: ''
        }
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UpdateStatusDialog.useEffect": ()=>{
            if (isOpen) {
                reset({
                    id: asset.id,
                    status: asset.status || 'In Stock',
                    assignedTo: asset.assignedTo || '',
                    notes: ''
                });
            }
        }
    }["UpdateStatusDialog.useEffect"], [
        isOpen,
        asset,
        reset
    ]);
    const onSubmit = async (data)=>{
        setIsSaving(true);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$bdc0e4__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateAssetStatus"])(data);
        if (result.success) {
            toast({
                title: 'Asset Status Updated',
                description: 'Successfully updated asset "'.concat(asset.assetName, '".')
            });
            setIsOpen(false);
            onSuccess();
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error
            });
        }
        setIsSaving(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: setIsOpen,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit(onSubmit),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: [
                                    "Update Status for ",
                                    asset.assetName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                children: "Log a new event in the asset's history."
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "status",
                                        children: "New Status"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 108,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Controller"], {
                                        name: "status",
                                        control: control,
                                        render: (param)=>{
                                            let { field } = param;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                onValueChange: field.onChange,
                                                value: field.value,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                            fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                            lineNumber: 114,
                                                            columnNumber: 44
                                                        }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 29
                                                    }, void 0),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "In Stock",
                                                                children: "In Stock"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                                lineNumber: 116,
                                                                columnNumber: 33
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Assigned",
                                                                children: "Assigned"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                                lineNumber: 117,
                                                                columnNumber: 33
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Damaged",
                                                                children: "Damaged"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                                lineNumber: 118,
                                                                columnNumber: 33
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Out for Repair",
                                                                children: "Out for Repair"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                                lineNumber: 119,
                                                                columnNumber: 33
                                                            }, void 0),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                value: "Retired",
                                                                children: "Retired"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                                lineNumber: 120,
                                                                columnNumber: 33
                                                            }, void 0)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                        lineNumber: 115,
                                                        columnNumber: 29
                                                    }, void 0)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                                lineNumber: 113,
                                                columnNumber: 25
                                            }, void 0);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 109,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 107,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "assignedTo",
                                        children: "Assigned To"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 127,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "assignedTo",
                                        ...register('assignedTo'),
                                        placeholder: "Employee Name / ID"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 128,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 126,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "notes",
                                        children: "Notes / Remarks"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 131,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                        id: "notes",
                                        ...register('notes'),
                                        placeholder: "e.g., Exchanged with Mr. B, screen cracked, sent for repair."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogClose"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "submit",
                                disabled: isSaving,
                                children: [
                                    isSaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                        className: "mr-2 h-4 w-4 animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                        lineNumber: 140,
                                        columnNumber: 28
                                    }, this),
                                    "Save Update"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                        lineNumber: 135,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/assets/update-status-dialog.tsx",
                lineNumber: 99,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/assets/update-status-dialog.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/assets/update-status-dialog.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(UpdateStatusDialog, "RYNXJvxkkYLQJ11DcIJ558A4mG4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c = UpdateStatusDialog;
var _c;
__turbopack_context__.k.register(_c, "UpdateStatusDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollArea",
    ()=>ScrollArea,
    "ScrollBar",
    ()=>ScrollBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-scroll-area/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const ScrollArea = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = (param, ref)=>{
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative overflow-hidden", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                className: "h-full w-full rounded-[inherit]",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 18,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {}, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 21,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBar, {
                orientation: "horizontal"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 22,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Corner"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/scroll-area.tsx",
                lineNumber: 23,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/scroll-area.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = ScrollArea;
ScrollArea.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ScrollBar = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"]((param, ref)=>{
    let { className, orientation = "vertical", ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"], {
        ref: ref,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaThumb"], {
            className: "relative flex-1 rounded-full bg-border"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/scroll-area.tsx",
            lineNumber: 45,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/scroll-area.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
});
_c2 = ScrollBar;
ScrollBar.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$scroll$2d$area$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollAreaScrollbar"].displayName;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ScrollArea$React.forwardRef");
__turbopack_context__.k.register(_c1, "ScrollArea");
__turbopack_context__.k.register(_c2, "ScrollBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/asset-history-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetHistoryDialog",
    ()=>AssetHistoryDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function AssetHistoryDialog(param) {
    let { asset, isOpen, setIsOpen } = param;
    _s();
    const history = asset.history || [];
    const printRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handlePrint = ()=>{
        var _printRef_current;
        const printContent = (_printRef_current = printRef.current) === null || _printRef_current === void 0 ? void 0 : _printRef_current.innerHTML;
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Asset History</title>');
                printWindow.document.write('<style>body { font-family: sans-serif; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } .no-print { display: none; } </style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write("<h1>History for: ".concat(asset.assetName, " (").concat(asset.assetCode, ")</h1>"));
                printWindow.document.write(printContent);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: isOpen,
        onOpenChange: setIsOpen,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            children: [
                                "History for: ",
                                asset.assetName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: "A complete audit trail of all changes and assignments for this asset."
                        }, void 0, false, {
                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                    className: "max-h-[60vh] p-1",
                    ref: printRef,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative pl-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-6 top-0 bottom-0 w-0.5 bg-border"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                lineNumber: 60,
                                columnNumber: 17
                            }, this),
                            history.slice().reverse().map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative mb-8 pl-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute left-0 top-1.5 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-background no-print",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-background",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                    className: "h-3 w-3 text-primary-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                    lineNumber: 66,
                                                    columnNumber: 33
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                lineNumber: 65,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                            lineNumber: 64,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-lg border bg-card p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold",
                                                    children: entry.status
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                    lineNumber: 70,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseISO"])(entry.date), "PPP 'at' p")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                    lineNumber: 71,
                                                    columnNumber: 29
                                                }, this),
                                                entry.assignedTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-medium",
                                                            children: "Assigned to:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                            lineNumber: 76,
                                                            columnNumber: 37
                                                        }, this),
                                                        " ",
                                                        entry.assignedTo
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                    lineNumber: 75,
                                                    columnNumber: 33
                                                }, this),
                                                entry.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-2 text-sm text-muted-foreground italic",
                                                    children: [
                                                        '"',
                                                        entry.notes,
                                                        '"'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                                    lineNumber: 80,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                            lineNumber: 69,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                    lineNumber: 63,
                                    columnNumber: 21
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                        lineNumber: 58,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: handlePrint,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, this),
                                " Print"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogClose"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                                lineNumber: 94,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
            lineNumber: 50,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/assets/asset-history-dialog.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(AssetHistoryDialog, "GFo43F1pcInHi7YRxOjX7f0n4kQ=");
_c = AssetHistoryDialog;
var _c;
__turbopack_context__.k.register(_c, "AssetHistoryDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/columns.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "columns",
    ()=>columns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-client] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.js [app-client] (ecmascript) <export default as RotateCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$add$2d$asset$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/add-asset-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$d8ab10__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/assets/data:d8ab10 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/currency-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$update$2d$status$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/update-status-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$asset$2d$history$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/asset-history-dialog.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
'use client';
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
;
;
const statusConfig = {
    'In Stock': {
        variant: 'default',
        className: 'bg-green-100 text-green-800'
    },
    'Assigned': {
        variant: 'secondary',
        className: 'bg-blue-100 text-blue-800'
    },
    'Damaged': {
        variant: 'destructive',
        className: ''
    },
    'Out for Repair': {
        variant: 'secondary',
        className: 'bg-yellow-100 text-yellow-800'
    },
    'Retired': {
        variant: 'secondary',
        className: 'bg-gray-100 text-gray-800'
    }
};
const ActionsCell = (param)=>{
    let { row, onAssetUpdate } = param;
    _s();
    const asset = row.original;
    const [isEditDialogOpen, setIsEditDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const handleDelete = async ()=>{
        setIsDeleting(true);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$d8ab10__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteAsset"])(asset.id);
        if (result.success) {
            toast({
                title: 'Success',
                description: 'Asset has been deleted.'
            });
            onAssetUpdate();
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: result.error
            });
        }
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$add$2d$asset$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddAssetDialog"], {
                asset: asset,
                isOpen: isEditDialogOpen,
                setIsOpen: setIsEditDialogOpen,
                onAssetAdded: onAssetUpdate,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-full"
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 74,
                    columnNumber: 18
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/assets/columns.tsx",
                lineNumber: 68,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$update$2d$status$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UpdateStatusDialog"], {
                asset: asset,
                isOpen: isStatusDialogOpen,
                setIsOpen: setIsStatusDialogOpen,
                onSuccess: onAssetUpdate
            }, void 0, false, {
                fileName: "[project]/src/app/assets/columns.tsx",
                lineNumber: 76,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$asset$2d$history$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetHistoryDialog"], {
                asset: asset,
                isOpen: isHistoryDialogOpen,
                setIsOpen: setIsHistoryDialogOpen
            }, void 0, false, {
                fileName: "[project]/src/app/assets/columns.tsx",
                lineNumber: 82,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isDeleteDialogOpen,
                onOpenChange: setIsDeleteDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Are you absolutely sure?"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/columns.tsx",
                                    lineNumber: 90,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: [
                                        'This action cannot be undone. This will permanently delete the asset "',
                                        asset.assetName,
                                        '".'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/assets/columns.tsx",
                                    lineNumber: 91,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/columns.tsx",
                            lineNumber: 89,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/columns.tsx",
                                    lineNumber: 94,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    onClick: handleDelete,
                                    disabled: isDeleting,
                                    children: isDeleting ? 'Deleting...' : 'Delete'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/columns.tsx",
                                    lineNumber: 95,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/columns.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 88,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/assets/columns.tsx",
                lineNumber: 87,
                columnNumber: 14
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            className: "h-8 w-8 p-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: "Open menu"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/columns.tsx",
                                    lineNumber: 104,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/assets/columns.tsx",
                                    lineNumber: 105,
                                    columnNumber: 21
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/assets/columns.tsx",
                            lineNumber: 103,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/assets/columns.tsx",
                        lineNumber: 102,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                        align: "end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuLabel"], {
                                children: "Actions"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/columns.tsx",
                                lineNumber: 109,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                onSelect: ()=>setIsStatusDialogOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/columns.tsx",
                                        lineNumber: 111,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Update Status"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/columns.tsx",
                                lineNumber: 110,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                onSelect: ()=>setIsHistoryDialogOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/columns.tsx",
                                        lineNumber: 114,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " View History"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/columns.tsx",
                                lineNumber: 113,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                fileName: "[project]/src/app/assets/columns.tsx",
                                lineNumber: 116,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                onSelect: ()=>setIsEditDialogOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/columns.tsx",
                                        lineNumber: 118,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Edit Details"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/columns.tsx",
                                lineNumber: 117,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                className: "text-destructive",
                                onSelect: ()=>setIsDeleteDialogOpen(true),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                        className: "mr-2 h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/assets/columns.tsx",
                                        lineNumber: 121,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    " Delete"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/assets/columns.tsx",
                                lineNumber: 120,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/columns.tsx",
                        lineNumber: 108,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/assets/columns.tsx",
                lineNumber: 101,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(ActionsCell, "SsXAtgFZLdZRODUT90UMRVx1k7g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = ActionsCell;
const columns = (param)=>{
    let { onAssetUpdate } = param;
    return [
        {
            accessorKey: 'assetCode',
            header: 'Asset Code'
        },
        {
            accessorKey: 'assetName',
            header: 'Asset Name'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: function Cell(param) {
                let { row } = param;
                const status = row.original.status || 'In Stock';
                const config = statusConfig[status] || statusConfig['In Stock'];
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: config.variant,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(config.className, 'border-transparent'),
                    children: status
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 145,
                    columnNumber: 16
                }, this);
            }
        },
        {
            accessorKey: 'assignedTo',
            header: 'Assigned To',
            cell: (param)=>{
                let { row } = param;
                return row.original.assignedTo || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: "N/A"
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 151,
                    columnNumber: 53
                }, ("TURBOPACK compile-time value", void 0));
            }
        },
        {
            accessorKey: 'purchaseDate',
            header: 'Purchase Date'
        },
        {
            accessorKey: 'purchaseCost',
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right",
                    children: "Cost"
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 159,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
            cell: _s1(function Cell(param) {
                let { row } = param;
                _s1();
                const { formatCurrency } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrency"])();
                const amount = parseFloat(String(row.getValue('purchaseCost')));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right font-medium",
                    children: formatCurrency(amount)
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 163,
                    columnNumber: 16
                }, this);
            }, "6IdIWuJBSE1FZogV2DAEU1oup74=", false, function() {
                return [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrency"]
                ];
            })
        },
        {
            accessorKey: 'currentValue',
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right",
                    children: "Current Value"
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 168,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
            cell: _s2(function Cell(param) {
                let { row } = param;
                _s2();
                const { formatCurrency } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrency"])();
                const amount = parseFloat(String(row.getValue('currentValue')));
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-right font-medium",
                    children: formatCurrency(amount)
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 172,
                    columnNumber: 16
                }, this);
            }, "6IdIWuJBSE1FZogV2DAEU1oup74=", false, function() {
                return [
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$currency$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCurrency"]
                ];
            })
        },
        {
            id: 'actions',
            cell: (param)=>{
                let { row } = param;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionsCell, {
                    row: row,
                    onAssetUpdate: onAssetUpdate
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/columns.tsx",
                    lineNumber: 177,
                    columnNumber: 26
                }, ("TURBOPACK compile-time value", void 0));
            }
        }
    ];
};
var _c;
__turbopack_context__.k.register(_c, "ActionsCell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/asset-list.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetList",
    ()=>AssetList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/columns.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AssetList(param) {
    let { initialAssets, onAssetUpdate } = param;
    _s();
    const [assets, setAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialAssets);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AssetList.useEffect": ()=>{
            setAssets(initialAssets);
        }
    }["AssetList.useEffect"], [
        initialAssets
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTable"], {
        columns: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["columns"])({
            onAssetUpdate
        }),
        data: assets
    }, void 0, false, {
        fileName: "[project]/src/app/assets/asset-list.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
_s(AssetList, "UPGfRV61y6HFWdxxXaXp1eJuq+o=");
_c = AssetList;
var _c;
__turbopack_context__.k.register(_c, "AssetList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/data:88dddd [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0072866f5eb6da76adc2a5782877886bc8efcf2c9e":"getAssets"},"src/app/assets/actions.ts",""] */ __turbopack_context__.s([
    "getAssets",
    ()=>getAssets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getAssets = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("0072866f5eb6da76adc2a5782877886bc8efcf2c9e", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getAssets"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCB7IGFzc2V0U2NoZW1hLCB0eXBlIEFzc2V0LCB0eXBlIEFzc2V0SGlzdG9yeSB9IGZyb20gJy4vc2NoZW1hJztcblxuY29uc3QgYXNzZXRzRmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy9hcHAvYXNzZXRzL2Fzc2V0cy1kYXRhLmpzb24nKTtcblxuXG5hc3luYyBmdW5jdGlvbiByZWFkQXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGZzLmFjY2Vzcyhhc3NldHNGaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBmcy5yZWFkRmlsZShhc3NldHNGaWxlUGF0aCwgJ3V0Zi04Jyk7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGlmICgoZXJyb3IgYXMgTm9kZUpTLkVycm5vRXhjZXB0aW9uKS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICAgICAgYXdhaXQgd3JpdGVBc3NldHMoW10pO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gd3JpdGVBc3NldHMoZGF0YTogQXNzZXRbXSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShhc3NldHNGaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoZGF0YSwgbnVsbCwgMiksICd1dGYtOCcpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QXNzZXRzKCk6IFByb21pc2U8QXNzZXRbXT4ge1xuICAgIGNvbnN0IGFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAvLyBDYWxjdWxhdGUgY3VycmVudCB2YWx1ZSBmb3IgZWFjaCBhc3NldFxuICAgIHJldHVybiBhc3NldHMubWFwKGFzc2V0ID0+IHtcbiAgICAgICAgY29uc3QgZGVwcmVjaWF0aW9uID0gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmFzc2V0LFxuICAgICAgICAgICAgY3VycmVudFZhbHVlOiBhc3NldC5wdXJjaGFzZUNvc3QgLSBkZXByZWNpYXRpb24sXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5cbmNvbnN0IGFkZEFzc2V0Rm9ybVNjaGVtYSA9IGFzc2V0U2NoZW1hLm9taXQoeyBpZDogdHJ1ZSwgY3VycmVudFZhbHVlOiB0cnVlLCBoaXN0b3J5OiB0cnVlIH0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXROZXh0QXNzZXRDb2RlKCkge1xuICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICBsZXQgbWF4TnVtID0gMDtcbiAgICBhbGxBc3NldHMuZm9yRWFjaChhc3NldCA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gYXNzZXQuYXNzZXRDb2RlLm1hdGNoKC9eQVNTRVQtKFxcZCspJC8pO1xuICAgICAgICBpZihtYXRjaCkge1xuICAgICAgICAgICAgY29uc3QgbnVtID0gcGFyc2VJbnQobWF0Y2hbMV0sIDEwKTtcbiAgICAgICAgICAgIGlmIChudW0gPiBtYXhOdW0pIHtcbiAgICAgICAgICAgICAgICBtYXhOdW0gPSBudW07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gYEFTU0VULSR7KG1heE51bSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoNCwgJzAnKX1gO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2F2ZUFzc2V0KGRhdGE6IHouaW5mZXI8dHlwZW9mIGFkZEFzc2V0Rm9ybVNjaGVtYT4sIGlzTmV3UmVjb3JkOiBib29sZWFuLCBpc0F1dG9Db2RlOiBib29sZWFuLCBpZD86IHN0cmluZykge1xuICAgIGNvbnN0IHZhbGlkYXRpb24gPSBhZGRBc3NldEZvcm1TY2hlbWEuc2FmZVBhcnNlKGRhdGEpO1xuICAgIGlmICghdmFsaWRhdGlvbi5zdWNjZXNzKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0ludmFsaWQgZGF0YSBmb3JtYXQuJyB9O1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgbGV0IGFzc2V0RGF0YSA9IHZhbGlkYXRpb24uZGF0YTtcblxuICAgICAgICBpZiAoaXNOZXdSZWNvcmQpIHsgLy8gQ3JlYXRlIG5ld1xuICAgICAgICAgICAgaWYgKGlzQXV0b0NvZGUpIHtcbiAgICAgICAgICAgICAgICBhc3NldERhdGEuYXNzZXRDb2RlID0gYXdhaXQgZ2V0TmV4dEFzc2V0Q29kZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhc3NldEV4aXN0cyA9IGFsbEFzc2V0cy5zb21lKGEgPT4gYS5hc3NldENvZGUgPT09IGFzc2V0RGF0YS5hc3NldENvZGUpO1xuICAgICAgICAgICAgICAgIGlmKGFzc2V0RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGBBc3NldCB3aXRoIGNvZGUgXCIke2Fzc2V0RGF0YS5hc3NldENvZGV9XCIgYWxyZWFkeSBleGlzdHMuYCB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG5ld0Fzc2V0OiBBc3NldCA9IHtcbiAgICAgICAgICAgICAgICAuLi5hc3NldERhdGEsXG4gICAgICAgICAgICAgICAgaWQ6IGBBU1NFVC0ke0RhdGUubm93KCl9YCxcbiAgICAgICAgICAgICAgICBoaXN0b3J5OiBbe1xuICAgICAgICAgICAgICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogJ0luIFN0b2NrJyxcbiAgICAgICAgICAgICAgICAgICAgYXNzaWduZWRUbzogJycsXG4gICAgICAgICAgICAgICAgICAgIG5vdGVzOiAnQXNzZXQgY3JlYXRlZC4nXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBhbGxBc3NldHMucHVzaChuZXdBc3NldCk7XG4gICAgICAgIH0gZWxzZSB7IC8vIFVwZGF0ZSBleGlzdGluZ1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhbGxBc3NldHMuZmluZEluZGV4KGEgPT4gYS5pZCA9PT0gaWQpO1xuICAgICAgICAgICAgaWYoaW5kZXggPT09IC0xKSByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJ307XG4gICAgICAgICAgICBhbGxBc3NldHNbaW5kZXhdID0geyAuLi5hbGxBc3NldHNbaW5kZXhdLCAuLi5hc3NldERhdGEgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHdyaXRlQXNzZXRzKGFsbEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IGFzc2V0RGF0YSB9O1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfHwgJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQuJyB9O1xuICAgIH1cbn1cblxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXNzZXQoYXNzZXRJZDogc3RyaW5nKSB7XG4gICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGFsbEFzc2V0cyA9IGF3YWl0IHJlYWRBc3NldHMoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZEFzc2V0cyA9IGFsbEFzc2V0cy5maWx0ZXIoYXNzZXQgPT4gYXNzZXQuaWQgIT09IGFzc2V0SWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGFsbEFzc2V0cy5sZW5ndGggPT09IHVwZGF0ZWRBc3NldHMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdBc3NldCBub3QgZm91bmQuJyB9O1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgd3JpdGVBc3NldHModXBkYXRlZEFzc2V0cyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYXNzZXRzJyk7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIHx8ICdBbiB1bmtub3duIGVycm9yIG9jY3VycmVkLicgfTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gY2FsY3VsYXRlRGVwcmVjaWF0aW9uKGFzc2V0OiBBc3NldCk6IG51bWJlciB7XG4gICAgY29uc3QgcHVyY2hhc2VEYXRlID0gbmV3IERhdGUoYXNzZXQucHVyY2hhc2VEYXRlKTtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IGFnZUluWWVhcnMgPSAobm93LmdldFRpbWUoKSAtIHB1cmNoYXNlRGF0ZS5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQgKiAzNjUuMjUpO1xuXG4gICAgaWYgKGFnZUluWWVhcnMgPD0gMCB8fCBhc3NldC51c2VmdWxMaWZlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgZWZmZWN0aXZlQWdlID0gTWF0aC5taW4oYWdlSW5ZZWFycywgYXNzZXQudXNlZnVsTGlmZSk7XG4gICAgY29uc3QgZGVwcmVjaWFibGVWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdCAtIGFzc2V0LnNhbHZhZ2VWYWx1ZTtcblxuICAgIGlmIChkZXByZWNpYWJsZVZhbHVlIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgbGV0IHRvdGFsRGVwcmVjaWF0aW9uID0gMDtcblxuICAgIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdTdHJhaWdodC1MaW5lJykge1xuICAgICAgICBjb25zdCBhbm51YWxEZXByZWNpYXRpb24gPSBkZXByZWNpYWJsZVZhbHVlIC8gYXNzZXQudXNlZnVsTGlmZTtcbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhbm51YWxEZXByZWNpYXRpb24gKiBlZmZlY3RpdmVBZ2U7XG4gICAgfSBlbHNlIGlmIChhc3NldC5kZXByZWNpYXRpb25NZXRob2QgPT09ICdEZWNsaW5pbmcgQmFsYW5jZScpIHtcbiAgICAgICAgY29uc3QgcmF0ZSA9ICgxIC8gYXNzZXQudXNlZnVsTGlmZSkgKiAyOyAvLyBEb3VibGUtZGVjbGluaW5nIGJhbGFuY2VcbiAgICAgICAgbGV0IGJvb2tWYWx1ZSA9IGFzc2V0LnB1cmNoYXNlQ29zdDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKGVmZmVjdGl2ZUFnZSk7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW5udWFsRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZTtcbiAgICAgICAgICAgIGJvb2tWYWx1ZSAtPSBhbm51YWxEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHJvcmF0ZSBmb3IgdGhlIHBhcnRpYWwgeWVhclxuICAgICAgICBpZiAoZWZmZWN0aXZlQWdlICUgMSAhPT0gMCkge1xuICAgICAgICAgICAgIGNvbnN0IHBhcnRpYWxZZWFyRGVwcmVjaWF0aW9uID0gYm9va1ZhbHVlICogcmF0ZSAqIChlZmZlY3RpdmVBZ2UgJSAxKTtcbiAgICAgICAgICAgICBib29rVmFsdWUgLT0gcGFydGlhbFllYXJEZXByZWNpYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgdG90YWxEZXByZWNpYXRpb24gPSBhc3NldC5wdXJjaGFzZUNvc3QgLSBib29rVmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWluKHRvdGFsRGVwcmVjaWF0aW9uLCBkZXByZWNpYWJsZVZhbHVlKTtcbn1cblxuY29uc3QgdXBkYXRlU3RhdHVzU2NoZW1hID0gei5vYmplY3Qoe1xuICAgIGlkOiB6LnN0cmluZygpLFxuICAgIHN0YXR1czogei5lbnVtKFsnSW4gU3RvY2snLCAnQXNzaWduZWQnLCAnRGFtYWdlZCcsICdPdXQgZm9yIFJlcGFpcicsICdSZXRpcmVkJ10pLFxuICAgIGFzc2lnbmVkVG86IHouc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBub3Rlczogei5zdHJpbmcoKS5vcHRpb25hbCgpLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVBc3NldFN0YXR1cyhkYXRhOiB6LmluZmVyPHR5cGVvZiB1cGRhdGVTdGF0dXNTY2hlbWE+KSB7XG4gICAgY29uc3QgdmFsaWRhdGlvbiA9IHVwZGF0ZVN0YXR1c1NjaGVtYS5zYWZlUGFyc2UoZGF0YSk7XG4gICAgaWYgKCF2YWxpZGF0aW9uLnN1Y2Nlc3MpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnSW52YWxpZCBkYXRhIGZvcm1hdC4nIH07XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYWxsQXNzZXRzID0gYXdhaXQgcmVhZEFzc2V0cygpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGFsbEFzc2V0cy5maW5kSW5kZXgoYSA9PiBhLmlkID09PSBkYXRhLmlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnQXNzZXQgbm90IGZvdW5kLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld0hpc3RvcnlFbnRyeTogQXNzZXRIaXN0b3J5ID0ge1xuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIG5vdGVzOiBkYXRhLm5vdGVzLFxuICAgICAgICB9O1xuXG4gICAgICAgIGFsbEFzc2V0c1tpbmRleF0gPSB7XG4gICAgICAgICAgICAuLi5hbGxBc3NldHNbaW5kZXhdLFxuICAgICAgICAgICAgc3RhdHVzOiBkYXRhLnN0YXR1cyxcbiAgICAgICAgICAgIGFzc2lnbmVkVG86IGRhdGEuYXNzaWduZWRUbyxcbiAgICAgICAgICAgIGhpc3Rvcnk6IFsuLi4oYWxsQXNzZXRzW2luZGV4XS5oaXN0b3J5IHx8IFtdKSwgbmV3SGlzdG9yeUVudHJ5XSxcbiAgICAgICAgfTtcblxuICAgICAgICBhd2FpdCB3cml0ZUFzc2V0cyhhbGxBc3NldHMpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL2Fzc2V0cycpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBhbGxBc3NldHNbaW5kZXhdIH07XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfTtcbiAgICB9XG59XG5cbiAgICAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjRSQThCc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/assets/assets-client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssetsClient",
    ()=>AssetsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$asset$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/asset-list.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$add$2d$asset$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/assets/add-asset-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$88dddd__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/assets/data:88dddd [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function AssetsClient(param) {
    let { initialAssets } = param;
    _s();
    const [assets, setAssets] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialAssets);
    const refreshAssets = async ()=>{
        const updatedAssets = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$data$3a$88dddd__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getAssets"])();
        setAssets(updatedAssets);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AssetsClient.useEffect": ()=>{
            setAssets(initialAssets);
        }
    }["AssetsClient.useEffect"], [
        initialAssets
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end mb-4 no-print",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$add$2d$asset$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddAssetDialog"], {
                    onAssetAdded: refreshAssets,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                className: "mr-2 h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/assets/assets-client.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, this),
                            " Add New Asset"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/assets/assets-client.tsx",
                        lineNumber: 28,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/assets-client.tsx",
                    lineNumber: 27,
                    columnNumber: 14
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/assets/assets-client.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "printable-area",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$assets$2f$asset$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssetList"], {
                    initialAssets: assets,
                    onAssetUpdate: refreshAssets
                }, void 0, false, {
                    fileName: "[project]/src/app/assets/assets-client.tsx",
                    lineNumber: 34,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/assets/assets-client.tsx",
                lineNumber: 33,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/assets/assets-client.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_s(AssetsClient, "UPGfRV61y6HFWdxxXaXp1eJuq+o=");
_c = AssetsClient;
var _c;
__turbopack_context__.k.register(_c, "AssetsClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_49938c9f._.js.map