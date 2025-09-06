module.exports = [
"[project]/src/lib/license.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"008a29e84bd260b304f797613c7c39c01029f96950":"checkLicenseStatus"},"",""] */ __turbopack_context__.s([
    "checkLicenseStatus",
    ()=>checkLicenseStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/differenceInDays.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addDays.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const licenseFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'license.json');
const TRIAL_PERIOD_DAYS = 30;
async function readLicenseFile() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(licenseFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(licenseFilePath, 'utf-8');
        // Basic validation in case the file is empty or corrupted
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        return null; // File doesn't exist or is unreadable
    }
}
async function createLicenseFile() {
    const trialStartDate = new Date().toISOString();
    const newLicense = {
        trialStartDate
    };
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(licenseFilePath, JSON.stringify(newLicense, null, 2), 'utf-8');
    return newLicense;
}
async function checkLicenseStatus() {
    let license = await readLicenseFile();
    if (!license) {
        license = await createLicenseFile();
    }
    const startDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseISO"])(license.trialStartDate);
    const now = new Date();
    const expiryDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addDays$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addDays"])(startDate, TRIAL_PERIOD_DAYS);
    const daysRemaining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$differenceInDays$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["differenceInDays"])(expiryDate, now);
    const isActive = daysRemaining >= 0;
    return {
        isActive,
        isTrial: true,
        daysRemaining: Math.max(0, daysRemaining),
        expiryDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(expiryDate, 'PPP')
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    checkLicenseStatus
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(checkLicenseStatus, "008a29e84bd260b304f797613c7c39c01029f96950", null);
}),
"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00bf02fbdbf2069a58be66f4c215b7083c555f2e0f":"getCurrencySettings","4071380f55a231cc3b56eac3569e2425db970e8f4e":"saveCurrencySettings"},"",""] */ __turbopack_context__.s([
    "getCurrencySettings",
    ()=>getCurrencySettings,
    "saveCurrencySettings",
    ()=>saveCurrencySettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const settingsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/currency/settings.json');
const defaultSettings = {
    currencyCode: 'AED'
};
async function getCurrencySettings() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(settingsFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(settingsFilePath, 'utf-8');
        return {
            ...defaultSettings,
            ...JSON.parse(data)
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return defaultSettings;
        }
        throw error;
    }
}
const currencySettingsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    currencyCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().length(3, "Currency code must be 3 characters long.").toUpperCase()
});
async function saveCurrencySettings(data) {
    const validation = currencySettingsSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: validation.error.errors[0].message
        };
    }
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(settingsFilePath, JSON.stringify(validation.data, null, 2), 'utf-8');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout'); // Revalidate all pages
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save currency settings:', error);
        return {
            success: false,
            error: 'Failed to save settings.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getCurrencySettings,
    saveCurrencySettings
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCurrencySettings, "00bf02fbdbf2069a58be66f4c215b7083c555f2e0f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveCurrencySettings, "4071380f55a231cc3b56eac3569e2425db970e8f4e", null);
}),
"[project]/src/app/admin/access-control/permissions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "featurePermissions",
    ()=>featurePermissions
]);
const featurePermissions = [
    {
        feature: 'Properties',
        description: 'Manage property listings, details, and associated units/rooms.',
        actions: [
            {
                action: 'view',
                description: 'View property list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager',
                    'Accountant',
                    'User'
                ]
            },
            {
                action: 'edit',
                description: 'Edit property information',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'delete',
                description: 'Delete a property',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Units',
        description: 'Manage individual units within a property.',
        actions: [
            {
                action: 'view',
                description: 'View unit list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager',
                    'Accountant',
                    'User'
                ]
            },
            {
                action: 'edit',
                description: 'Edit unit information',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'delete',
                description: 'Delete a unit',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Rent-A-Car',
        description: 'Manage vehicle rental agreements.',
        actions: [
            {
                action: 'view',
                description: 'View rental agreements',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'User'
                ]
            },
            {
                action: 'manage',
                description: 'Add/Edit/Delete rental agreements',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Car Sales',
        description: 'Manage vehicle buying and selling operations.',
        actions: [
            {
                action: 'view',
                description: 'View vehicle inventory and sales',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'User'
                ]
            },
            {
                action: 'manage',
                description: 'Add, edit, and delete vehicle records',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Lease Contracts',
        description: 'Manage lease agreements with landlords.',
        actions: [
            {
                action: 'view',
                description: 'View lease agreements',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'manage',
                description: 'Create, edit, and delete lease agreements',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Project Management',
        description: 'Manage all aspects of projects, including billing, sub-contractors, and resource allocation.',
        actions: [
            {
                action: 'view',
                description: 'View project list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'manage',
                description: 'Create, edit, and delete projects',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'manage_billing',
                description: 'Manage project progress billing and retention',
                allowedRoles: [
                    'Super Admin',
                    'Accountant'
                ]
            }
        ]
    },
    {
        feature: 'Vaults & Stores',
        description: 'Manage inventory, stock levels, and store locations.',
        actions: [
            {
                action: 'view',
                description: 'View stores and stock levels',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'User'
                ]
            },
            {
                action: 'manage',
                description: 'Add/Edit/Delete stores and manage stock transactions',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Products & Services',
        description: 'Manage the catalog of products and services offered.',
        actions: [
            {
                action: 'view',
                description: 'View products and services',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'User'
                ]
            },
            {
                action: 'manage',
                description: 'Add/Edit/Delete products and services',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'view_pricing',
                description: 'View cost and sale prices',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant'
                ]
            }
        ]
    },
    {
        feature: 'Asset Management',
        description: 'Manage company assets, depreciation, and assignments.',
        actions: [
            {
                action: 'view',
                description: 'View asset list',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant'
                ]
            },
            {
                action: 'manage',
                description: 'Add, edit, and assign assets',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'delete',
                description: 'Delete assets from the register',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Maintenance',
        description: 'Manage maintenance tickets and service contracts.',
        actions: [
            {
                action: 'view_tickets',
                description: 'View maintenance tickets',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'User'
                ]
            },
            {
                action: 'manage_tickets',
                description: 'Create, edit, and update tickets',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'view_contracts',
                description: 'View service contracts',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant'
                ]
            },
            {
                action: 'manage_contracts',
                description: 'Manage service contracts',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Workflow',
        description: 'Manage document approval workflows.',
        actions: [
            {
                action: 'view',
                description: 'View workflow queue',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'manage',
                description: 'Approve or reject transactions',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Data Processing',
        description: 'Extract data from documents using AI.',
        actions: [
            {
                action: 'access',
                description: 'Access document processing and data extraction features',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'User'
                ]
            }
        ]
    },
    {
        feature: 'Utilities',
        description: 'Manage utility accounts and bill payments.',
        actions: [
            {
                action: 'view',
                description: 'View utility accounts',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant',
                    'User'
                ]
            },
            {
                action: 'manage',
                description: 'Add, edit, and delete utility accounts',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            }
        ]
    },
    {
        feature: 'Landlords',
        description: 'Manage landlord profiles and their associated contracts.',
        actions: [
            {
                action: 'view',
                description: 'View landlord list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager',
                    'Accountant'
                ]
            },
            {
                action: 'edit',
                description: 'Edit landlord information',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'delete',
                description: 'Delete a landlord',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Vendors',
        description: 'Manage supplier and vendor profiles.',
        actions: [
            {
                action: 'view',
                description: 'View vendor list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager',
                    'Accountant',
                    'User'
                ]
            },
            {
                action: 'edit',
                description: 'Edit vendor information',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'delete',
                description: 'Delete a vendor',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Tenants',
        description: 'Manage tenant profiles and their tenancy contracts.',
        actions: [
            {
                action: 'view',
                description: 'View tenant list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager',
                    'Accountant',
                    'User'
                ]
            },
            {
                action: 'edit',
                description: 'Edit tenant information',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Property Manager'
                ]
            },
            {
                action: 'delete',
                description: 'Delete a tenant',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Customers',
        description: 'Manage general customers for non-rental services.',
        actions: [
            {
                action: 'view',
                description: 'View customer list and details',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant',
                    'User'
                ]
            },
            {
                action: 'edit',
                description: 'Edit customer information',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'delete',
                description: 'Delete a customer',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Finance',
        description: 'Access to financial modules like banking, payments, and chart of accounts.',
        actions: [
            {
                action: 'view_banking',
                description: 'View Banking and Petty Cash',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant'
                ]
            },
            {
                action: 'manage_banking',
                description: 'Add/Edit/Delete bank accounts',
                allowedRoles: [
                    'Super Admin'
                ]
            },
            {
                action: 'view_payments',
                description: 'View payment and receipt history',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant'
                ]
            },
            {
                action: 'record_payment',
                description: 'Record new payments or receipts',
                allowedRoles: [
                    'Super Admin',
                    'Admin',
                    'Accountant'
                ]
            },
            {
                action: 'delete_payment',
                description: 'Delete financial transactions',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'User Management',
        description: 'Control over user accounts and their roles.',
        actions: [
            {
                action: 'view',
                description: 'View user list',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'add_user',
                description: 'Add new users',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'edit_user',
                description: 'Edit user details and roles',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'delete_user',
                description: 'Delete a user',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    },
    {
        feature: 'Settings',
        description: 'Access to administrative settings.',
        actions: [
            {
                action: 'access_control',
                description: 'Manage user roles and permissions',
                allowedRoles: [
                    'Super Admin'
                ]
            },
            {
                action: 'communication',
                description: 'Manage communication (Email/SMS) settings',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'backup',
                description: 'Manage data backup and restore',
                allowedRoles: [
                    'Super Admin'
                ]
            },
            {
                action: 'external_storage',
                description: 'Configure external storage (e.g., Google Drive)',
                allowedRoles: [
                    'Developer'
                ]
            },
            {
                action: 'notifications',
                description: 'Send system-wide notifications',
                allowedRoles: [
                    'Super Admin',
                    'Admin'
                ]
            },
            {
                action: 'contract_continuity',
                description: 'Review and fix contract data issues',
                allowedRoles: [
                    'Super Admin'
                ]
            }
        ]
    }
];
}),
"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00484ec9aa59cb806ed9f49233b1daa442fefc4db8":"getCombinedAccessControlData","00548e0684b6c786c2055f69d71f7e4ec6cb42ac5b":"getPermissions","00ad4fe129d6cb9ee80e090605f1f4cb8ee723c6f9":"getUserOverrides","00c846692d9cd892ad596a87ed4a820ff96cab15e1":"getRoles","405659344c795f720be3ab338c24e2874d7c18b53f":"savePermissions","40cafbf7021cd18bada02967880e073e670bc1a6d1":"saveUserOverrides","781b941b43b867e86611e44017a499d2fc00cdfc95":"updatePermission"},"",""] */ __turbopack_context__.s([
    "getCombinedAccessControlData",
    ()=>getCombinedAccessControlData,
    "getPermissions",
    ()=>getPermissions,
    "getRoles",
    ()=>getRoles,
    "getUserOverrides",
    ()=>getUserOverrides,
    "savePermissions",
    ()=>savePermissions,
    "saveUserOverrides",
    ()=>saveUserOverrides,
    "updatePermission",
    ()=>updatePermission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/permissions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const permissionsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/access-control/permissions.json');
const usersFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/user-roles/users.json');
const moduleSettingsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/access-control/module-settings.json');
const userOverridesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/access-control/user-overrides.json');
async function readData(filePath) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(filePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Return a default structure that can be safely merged
            if (filePath.endsWith('permissions.json')) return [];
            if (filePath.endsWith('users.json')) return [];
            if (filePath.endsWith('module-settings.json')) return {
                modules: []
            };
            if (filePath.endsWith('user-overrides.json')) return [];
            return [];
        }
        throw error;
    }
}
async function getPermissions() {
    const savedPermissions = await readData(permissionsFilePath);
    // Merge saved permissions with the default structure to ensure all features are listed
    const allPermissions = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$permissions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["featurePermissions"].map((feature)=>{
        const savedFeature = savedPermissions.find((p)=>p.feature === feature.feature);
        const actions = feature.actions.map((action)=>{
            const savedAction = savedFeature?.actions.find((a)=>a.action === action.action);
            return {
                ...action,
                allowedRoles: savedAction ? savedAction.allowedRoles : action.allowedRoles
            };
        });
        return {
            ...feature,
            actions
        };
    });
    return allPermissions;
}
async function savePermissions(permissions) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(permissionsFilePath, JSON.stringify(permissions, null, 2), 'utf-8');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/access-control');
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save permissions:', error);
        return {
            success: false,
            error: 'Failed to save permissions.'
        };
    }
}
async function updatePermission(featureName, actionName, role, isChecked) {
    const currentPermissions = await getPermissions();
    const feature = currentPermissions.find((f)=>f.feature === featureName);
    if (feature) {
        const action = feature.actions.find((a)=>a.action === actionName);
        if (action) {
            if (isChecked) {
                if (!action.allowedRoles.includes(role)) {
                    action.allowedRoles.push(role);
                }
            } else {
                action.allowedRoles = action.allowedRoles.filter((r)=>r !== role);
            }
        }
    }
    return await savePermissions(currentPermissions);
}
async function getRoles() {
    try {
        const users = await readData(usersFilePath);
        const allRoles = users.map((u)=>u.role);
        // Add default roles that might not be in use yet
        const defaultRoles = [
            'Super Admin',
            'Admin',
            'Property Manager',
            'Accountant',
            'User',
            'Developer'
        ];
        const uniqueRoles = Array.from(new Set([
            ...allRoles,
            ...defaultRoles
        ]));
        return uniqueRoles;
    } catch (error) {
        console.error("Failed to read user roles", error);
        return [
            'Super Admin',
            'Admin',
            'Property Manager',
            'Accountant',
            'User',
            'Developer'
        ];
    }
}
async function getUserOverrides() {
    return await readData(userOverridesFilePath);
}
async function saveUserOverrides(overrides) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(userOverridesFilePath, JSON.stringify(overrides, null, 2), 'utf-8');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/', 'layout');
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save user overrides:', error);
        return {
            success: false,
            error: 'Failed to save user overrides.'
        };
    }
}
async function getCombinedAccessControlData() {
    try {
        const [permissions, moduleSettings, userOverrides] = await Promise.all([
            getPermissions(),
            readData(moduleSettingsFilePath),
            getUserOverrides()
        ]);
        return {
            success: true,
            permissions,
            moduleSettings,
            userOverrides
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPermissions,
    savePermissions,
    updatePermission,
    getRoles,
    getUserOverrides,
    saveUserOverrides,
    getCombinedAccessControlData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPermissions, "00548e0684b6c786c2055f69d71f7e4ec6cb42ac5b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(savePermissions, "405659344c795f720be3ab338c24e2874d7c18b53f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updatePermission, "781b941b43b867e86611e44017a499d2fc00cdfc95", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRoles, "00c846692d9cd892ad596a87ed4a820ff96cab15e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserOverrides, "00ad4fe129d6cb9ee80e090605f1f4cb8ee723c6f9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveUserOverrides, "40cafbf7021cd18bada02967880e073e670bc1a6d1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCombinedAccessControlData, "00484ec9aa59cb806ed9f49233b1daa442fefc4db8", null);
}),
"[project]/src/app/finance/receipt-vouchers/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "receiptVoucherSchema",
    ()=>receiptVoucherSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const receiptVoucherSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    receiptNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Receipt number is required.'),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Date is required.'),
    partyType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Tenant',
        'Customer'
    ]),
    partyName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Party name is required.'),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].coerce.number().min(0.01, 'Amount must be greater than zero.'),
    paymentMethod: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Cash',
        'Cheque',
        'Bank Transfer',
        'Card'
    ]),
    bankAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    chequeNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    chequeDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    bankName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    collectedBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Collector is required.'),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    createdBy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    invoiceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    contractId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    property: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    roomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
}),
"[project]/src/app/finance/payment/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "approvalHistorySchema",
    ()=>approvalHistorySchema,
    "billAllocationSchema",
    ()=>billAllocationSchema,
    "invoiceAllocationSchema",
    ()=>invoiceAllocationSchema,
    "paymentSchema",
    ()=>paymentSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const invoiceAllocationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    invoiceId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const billAllocationSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    billId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const approvalHistorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    action: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actorId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actorRole: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    timestamp: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    comments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const paymentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Receipt',
        'Payment'
    ]),
    date: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Date is required."),
    partyType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Tenant',
        'Landlord',
        'Vendor',
        'Customer',
        'Agent'
    ]),
    partyName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Party name is required."),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0.01, "Amount must be greater than 0."),
    paymentMethod: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Cash',
        'Cheque',
        'Bank Transfer',
        'Card'
    ]),
    paymentFrom: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Bank',
        'Petty Cash'
    ]).default('Bank'),
    bankAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    expenseAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    maintenanceTicketId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    utilityAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    property: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    floor: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    roomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    referenceType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    referenceNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    contractNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    remarks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Paid',
        'Received',
        'Cancelled'
    ]),
    agentCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    createdByUser: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    invoiceAllocations: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(invoiceAllocationSchema).optional(),
    billAllocations: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(billAllocationSchema).optional(),
    currentStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'DRAFT',
        'PENDING_ADMIN_APPROVAL',
        'PENDING_SUPER_ADMIN_APPROVAL',
        'POSTED',
        'REJECTED'
    ]).optional(),
    approvalHistory: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(approvalHistorySchema).optional()
});
}),
"[externals]/firebase-admin [external] (firebase-admin, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}),
"[project]/src/lib/firebase/admin-config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firestoreAdmin",
    ()=>firestoreAdmin
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
const projectId = ("TURBOPACK compile-time value", "studio-2-99522");
// The recommended approach is to use Application Default Credentials (ADC).
// Initialize without any arguments and it will automatically use ADC if available.
try {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"].length) {
        console.log("Attempting to initialize Firebase Admin with Application Default Credentials...");
        __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["initializeApp"]({
            projectId
        });
        console.log("Firebase Admin initialized successfully with Application Default Credentials.");
    }
} catch (e) {
    console.warn("Could not initialize with Application Default Credentials, trying service account path.", e);
    // Fallback for local development outside of a GCP environment
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_JSON_PATH;
    if (!serviceAccountPath) {
        throw new Error('Firebase initialization failed. Application Default Credentials not found. ' + 'For local development, set the SERVICE_ACCOUNT_JSON_PATH environment variable to the path of your service account JSON file in your .env.local');
    }
    if (!(0, __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"])(serviceAccountPath)) {
        throw new Error(`Firebase initialization failed. Service account file not found at path: ${serviceAccountPath}. ` + 'Please check the SERVICE_ACCOUNT_JSON_PATH in your .env.local file.');
    }
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["apps"].length) {
        console.log(`Attempting to initialize Firebase Admin with service account file: ${serviceAccountPath}`);
        __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["initializeApp"]({
            credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["credential"].cert(serviceAccountPath),
            projectId: projectId
        });
        console.log("Firebase Admin initialized successfully with service account file.");
    }
}
const firestoreAdmin = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["firestore"]();
;
}),
"[project]/src/app/tenancy/customer/invoice/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invoiceItemSchema",
    ()=>invoiceItemSchema,
    "invoiceSchema",
    ()=>invoiceSchema,
    "subscriptionInvoiceSchema",
    ()=>subscriptionInvoiceSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const invoiceItemSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Description is required.'),
    quantity: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(1, 'Quantity must be at least 1.'),
    unitPrice: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, 'Unit price must be positive.'),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number()
});
const invoiceSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    invoiceNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Invoice number is required.'),
    customerCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Customer is required.'),
    customerName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Customer name is required.'),
    property: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    roomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    invoiceDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Invoice date is required.'),
    dueDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, 'Due date is required.'),
    vatRegNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    items: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(invoiceItemSchema).min(1, 'At least one item is required.'),
    subTotal: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    taxType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'exclusive',
        'inclusive'
    ]).default('exclusive'),
    taxRate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(0),
    tax: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    total: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    amountPaid: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(0),
    remainingBalance: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Draft',
        'Sent',
        'Paid',
        'Overdue',
        'Cancelled'
    ]),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const subscriptionInvoiceSchema = invoiceSchema.extend({
    isSubscription: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional()
});
}),
"[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"002722ff09ce06e23752a07b30e008e26f6b5882d1":"getNextSubscriptionInvoiceNumber","002fd6819cf4338c9165de4328565a274185e7c549":"getNextGeneralInvoiceNumber","40b851d950a24cfbdf727f9a603d2d4afdfea189f2":"getInvoicesForCustomer","40c5fecc48d82dbe3a6e072870ec474934203e9f2b":"deleteInvoice","60182751cf7bd99f30f3ab29628a4b14b2bbeb146a":"applyPaymentToInvoices","60206d8691e53c96311f2894f79d80051ffa971b76":"saveInvoice","60213da409c92fe467dbf995967e3039ca853bc297":"saveSubscriptionInvoice","60d2fa4c965de2a19c706e2a3de247becf64d98a25":"updateInvoiceStatus"},"",""] */ __turbopack_context__.s([
    "applyPaymentToInvoices",
    ()=>applyPaymentToInvoices,
    "deleteInvoice",
    ()=>deleteInvoice,
    "getInvoicesForCustomer",
    ()=>getInvoicesForCustomer,
    "getNextGeneralInvoiceNumber",
    ()=>getNextGeneralInvoiceNumber,
    "getNextSubscriptionInvoiceNumber",
    ()=>getNextSubscriptionInvoiceNumber,
    "saveInvoice",
    ()=>saveInvoice,
    "saveSubscriptionInvoice",
    ()=>saveSubscriptionInvoice,
    "updateInvoiceStatus",
    ()=>updateInvoiceStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/admin-config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/customer/invoice/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function getNextInvoiceNumber(prefix) {
    const querySnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").where("invoiceNo", ">=", prefix).where("invoiceNo", "<", prefix + 'z').get();
    let maxNum = 0;
    querySnapshot.docs.forEach((doc)=>{
        const match = doc.data().invoiceNo.match(new RegExp(`^${prefix}-(\\d+)$`));
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `${prefix}-${(maxNum + 1).toString().padStart(4, '0')}`;
}
async function getInvoicesForCustomer(customerCode) {
    const querySnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").where("customerCode", "==", customerCode).get();
    return querySnapshot.docs.map((doc)=>{
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            remainingBalance: data.total - (data.amountPaid || 0)
        };
    });
}
async function getNextGeneralInvoiceNumber() {
    return await getNextInvoiceNumber('INV');
}
async function getNextSubscriptionInvoiceNumber() {
    return await getNextInvoiceNumber('SUB-INV');
}
async function saveInvoice(data, createdBy) {
    const { isAutoInvoiceNo, isSubscription, ...invoiceData } = data;
    const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["invoiceSchema"].omit({
        id: true,
        amountPaid: true,
        remainingBalance: true
    }).safeParse(invoiceData);
    if (!validation.success) {
        console.error("Invoice Validation Error:", validation.error.format());
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    try {
        const isNewRecord = !data.id;
        const validatedData = validation.data;
        let savedInvoice;
        if (isNewRecord) {
            let newInvoiceNo = validatedData.invoiceNo;
            if (isAutoInvoiceNo) {
                newInvoiceNo = isSubscription ? await getNextSubscriptionInvoiceNumber() : await getNextGeneralInvoiceNumber();
            } else {
                const querySnapshot = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").where("invoiceNo", "==", newInvoiceNo).get();
                if (!querySnapshot.empty) {
                    return {
                        success: false,
                        error: `An invoice with number "${newInvoiceNo}" already exists.`
                    };
                }
            }
            const newInvoice = {
                ...validatedData,
                invoiceNo: newInvoiceNo,
                amountPaid: 0,
                items: validatedData.items.map((item)=>({
                        ...item,
                        id: item.id || `item-${Date.now()}-${Math.random()}`
                    })),
                id: ''
            };
            const docRef = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").add(newInvoice);
            savedInvoice = {
                ...newInvoice,
                id: docRef.id
            };
        } else {
            const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").doc(data.id);
            await docRef.update(validatedData);
            const updatedDoc = await docRef.get();
            savedInvoice = {
                ...updatedDoc.data(),
                id: updatedDoc.id
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/customer/add?code=${data.customerCode}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/tenants/add?code=${data.customerCode}`);
        return {
            success: true,
            data: savedInvoice
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function saveSubscriptionInvoice(data, createdBy) {
    return await saveInvoice({
        ...data,
        isSubscription: true
    }, createdBy);
}
async function deleteInvoice(invoiceId) {
    try {
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").doc(invoiceId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return {
                success: false,
                error: 'Invoice not found.'
            };
        }
        const customerCode = doc.data()?.customerCode;
        await docRef.delete();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/customer/add?code=${customerCode}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/tenants/add?code=${customerCode}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function updateInvoiceStatus(invoiceId, status) {
    try {
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").doc(invoiceId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return {
                success: false,
                error: 'Invoice not found to update status.'
            };
        }
        await docRef.update({
            status
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/customer/add?code=${doc.data()?.customerCode}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/tenants/add?code=${doc.data()?.customerCode}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function applyPaymentToInvoices(invoicePayments, customerCode) {
    try {
        const batch = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].batch();
        for (const payment of invoicePayments){
            const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection("invoices").doc(payment.invoiceId);
            const doc = await docRef.get();
            if (doc.exists) {
                const invoice = doc.data();
                const newAmountPaid = (invoice.amountPaid || 0) + payment.amount;
                const remainingBalance = invoice.total - newAmountPaid;
                const newStatus = remainingBalance <= 0.001 ? 'Paid' : invoice.status;
                batch.update(docRef, {
                    amountPaid: newAmountPaid,
                    status: newStatus
                });
            }
        }
        await batch.commit();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/customer/add?code=${customerCode}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/tenants/add?code=${customerCode}`);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getInvoicesForCustomer,
    getNextGeneralInvoiceNumber,
    getNextSubscriptionInvoiceNumber,
    saveInvoice,
    saveSubscriptionInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    applyPaymentToInvoices
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getInvoicesForCustomer, "40b851d950a24cfbdf727f9a603d2d4afdfea189f2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNextGeneralInvoiceNumber, "002fd6819cf4338c9165de4328565a274185e7c549", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNextSubscriptionInvoiceNumber, "002722ff09ce06e23752a07b30e008e26f6b5882d1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveInvoice, "60206d8691e53c96311f2894f79d80051ffa971b76", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveSubscriptionInvoice, "60213da409c92fe467dbf995967e3039ca853bc297", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteInvoice, "40c5fecc48d82dbe3a6e072870ec474934203e9f2b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateInvoiceStatus, "60d2fa4c965de2a19c706e2a3de247becf64d98a25", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(applyPaymentToInvoices, "60182751cf7bd99f30f3ab29628a4b14b2bbeb146a", null);
}),
"[project]/src/app/api/cron/generate-invoices/route.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "generateInvoices",
    ()=>generateInvoices
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/endOfMonth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMonths$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/addMonths.mjs [app-rsc] (ecmascript)");
;
;
;
;
const tenantsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const invoicesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/invoice/subscription-invoices-data.json');
async function readData(filePath) {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function generateInvoices(forceRun = false) {
    try {
        // const workflowSettings = await getWorkflowSettings();
        const today = new Date();
        // if (!forceRun) {
        //     if (!workflowSettings.automaticInvoiceGenerationEnabled) {
        //       return { success: true, message: 'Automatic invoice generation is disabled. No invoices were created.' };
        //     }
        //     if (getDate(today) !== workflowSettings.invoiceGenerationDay) {
        //         return { success: true, message: `Skipping invoice generation. Today is not day ${workflowSettings.invoiceGenerationDay}.`};
        //     }
        // }
        const tenants = await readData(tenantsFilePath);
        const existingInvoices = await readData(invoicesFilePath);
        const activeSubscriptions = tenants.filter((t)=>t.tenantData.isSubscriptionActive && t.tenantData.subscriptionAmount > 0);
        const createdFor = [];
        for (const tenant of activeSubscriptions){
            // for (let i = 0; i < workflowSettings.monthsToGenerate; i++) {
            const targetMonthDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$addMonths$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addMonths"])(today, 1);
            const targetMonthKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(targetMonthDate, 'yyyy-MM');
            const hasInvoiceForTargetMonth = existingInvoices.some((inv)=>inv.customerCode === tenant.tenantData.code && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseISO"])(inv.invoiceDate), 'yyyy-MM') === targetMonthKey);
            if (!hasInvoiceForTargetMonth) {
                const tenantData = tenant.tenantData;
                const subscriptionAmount = tenantData.subscriptionAmount || 0;
                const newInvoiceData = {
                    invoiceNo: '',
                    customerCode: tenantData.code,
                    customerName: tenantData.name,
                    property: tenantData.property || '',
                    unitCode: tenantData.unitCode || '',
                    roomCode: tenantData.roomCode || '',
                    invoiceDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(targetMonthDate, 'yyyy-MM-dd'),
                    dueDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["endOfMonth"])(targetMonthDate), 'yyyy-MM-dd'),
                    items: [
                        {
                            id: `item-${Date.now()}`,
                            description: `${tenantData.subscriptionStatus} Subscription for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(targetMonthDate, 'MMMM yyyy')}`,
                            quantity: 1,
                            unitPrice: subscriptionAmount,
                            total: subscriptionAmount
                        }
                    ],
                    subTotal: subscriptionAmount,
                    tax: 0,
                    taxType: 'exclusive',
                    taxRate: 0,
                    total: subscriptionAmount,
                    notes: `Automatically generated subscription invoice for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(targetMonthDate, 'MMMM yyyy')}.`,
                    status: 'Sent'
                };
                // await saveSubscriptionInvoice({ ...newInvoiceData, isAutoInvoiceNo: true }, 'Cron Job');
                createdFor.push(`${tenantData.name} (for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(targetMonthDate, 'MMM yyyy')})`);
            }
        // }
        }
        const message = createdFor.length > 0 ? `Created ${createdFor.length} new invoices for: ${createdFor.join(', ')}.` : 'No new invoices needed at this time.';
        return {
            success: true,
            message
        };
    } catch (error) {
        console.error('Cron job for invoice generation failed:', error);
        throw new Error('Failed to generate invoices.');
    }
}
async function GET(request) {
    try {
        const result = await generateInvoices();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: e.message
        }, {
            status: 500
        });
    }
}
}),
"[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0026cbe30d3946ca5d202d147dfd3dd10c963bca8b":"getWorkflowSettings","00698a84b77221a25f617c69b2c492b0adfcf77554":"runInvoiceGeneration","405fd00783ca2c0909e1bc9ea8170dd1dcc1cb4c5f":"saveWorkflowSettings"},"",""] */ __turbopack_context__.s([
    "getWorkflowSettings",
    ()=>getWorkflowSettings,
    "runInvoiceGeneration",
    ()=>runInvoiceGeneration,
    "saveWorkflowSettings",
    ()=>saveWorkflowSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$cron$2f$generate$2d$invoices$2f$route$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/cron/generate-invoices/route.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
const settingsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/workflow-settings/settings.json');
const defaultSettings = {
    approvalProcessEnabled: true,
    automaticInvoiceGenerationEnabled: true,
    invoiceGenerationDay: 1,
    monthsToGenerate: 1
};
async function getWorkflowSettings() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(settingsFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(settingsFilePath, 'utf-8');
        return {
            ...defaultSettings,
            ...JSON.parse(data)
        };
    } catch (error) {
        if (error.code === 'ENOENT') {
            return defaultSettings;
        }
        throw error;
    }
}
async function saveWorkflowSettings(data) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(settingsFilePath, JSON.stringify(data, null, 2), 'utf-8');
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save workflow settings:', error);
        return {
            success: false,
            error: 'Failed to save settings.'
        };
    }
}
async function runInvoiceGeneration() {
    try {
        // Directly call the logic from the cron route
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$cron$2f$generate$2d$invoices$2f$route$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generateInvoices"])(true); // Pass true to force run for simulation
        return {
            success: true,
            message: result.message
        };
    } catch (error) {
        console.error('Manual invoice generation failed:', error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getWorkflowSettings,
    saveWorkflowSettings,
    runInvoiceGeneration
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getWorkflowSettings, "0026cbe30d3946ca5d202d147dfd3dd10c963bca8b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveWorkflowSettings, "405fd00783ca2c0909e1bc9ea8170dd1dcc1cb4c5f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(runInvoiceGeneration, "00698a84b77221a25f617c69b2c492b0adfcf77554", null);
}),
"[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4047f1be9f4ec23f6c3699a601835a82156d8eb5e4":"submitTransaction","408b6ef6fc8d09194066701fa2edd4ea8f9305defb":"approveTransaction","40979727ef980c7aba95e802e0d29daccf4b768563":"addCommentToTransaction","40a66ec237e98904229939f469d1841c1eb84346ba":"reverseFinancialImpact","40bf8da82d2e5d4234a62b8c165efb090a74e54a42":"applyFinancialImpact","40c95dd5b507e2eb7d80a18ecfb45b4f1808addef8":"rejectTransaction"},"",""] */ __turbopack_context__.s([
    "addCommentToTransaction",
    ()=>addCommentToTransaction,
    "applyFinancialImpact",
    ()=>applyFinancialImpact,
    "approveTransaction",
    ()=>approveTransaction,
    "rejectTransaction",
    ()=>rejectTransaction,
    "reverseFinancialImpact",
    ()=>reverseFinancialImpact,
    "submitTransaction",
    ()=>submitTransaction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
const paymentsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const bankAccountsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const pettyCashFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/banking/petty-cash.json');
const accountsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json');
const invoicesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const billsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/bill/bills-data.json');
async function readData(filePath) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(filePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writeData(filePath, data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readPayments() {
    return await readData(paymentsFilePath);
}
async function writePayments(data) {
    await writeData(paymentsFilePath, data);
}
async function readBankAccounts() {
    return await readData(bankAccountsFilePath);
}
async function writeBankAccounts(data) {
    await writeData(bankAccountsFilePath, data);
}
async function readPettyCash() {
    const data = await readData(pettyCashFilePath);
    if (!data || Array.isArray(data) && data.length === 0) {
        return {
            balance: 0
        };
    }
    return data;
}
async function writePettyCash(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(pettyCashFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function applyFinancialImpact(payment) {
    const { type, amount, bankAccountId, paymentFrom, partyType, partyName, expenseAccountId } = payment;
    const allAccounts = await readData(accountsFilePath);
    const accountsPayableIndex = allAccounts.findIndex((a)=>a.code === '2110'); // Accounts Payable
    const ownersEquityAccountIndex = allAccounts.findIndex((a)=>a.code === '3110'); // Owner's Equity
    // Update Cash/Bank balances
    if (paymentFrom === 'Petty Cash') {
        const pettyCash = await readPettyCash();
        if (type === 'Payment') {
            pettyCash.balance -= amount;
        } else {
            pettyCash.balance += amount;
        }
        await writePettyCash(pettyCash);
    } else if (bankAccountId) {
        const allBankAccounts = await readBankAccounts();
        const accountIndex = allBankAccounts.findIndex((acc)=>acc.id === bankAccountId);
        if (accountIndex !== -1) {
            if (type === 'Payment') {
                allBankAccounts[accountIndex].balance -= amount;
            } else {
                allBankAccounts[accountIndex].balance += amount;
            }
            await writeBankAccounts(allBankAccounts);
        }
    }
    // Update Chart of Accounts based on transaction type
    if (partyName === 'Owner') {
        if (ownersEquityAccountIndex !== -1) {
            if (type === 'Payment') {
                allAccounts[ownersEquityAccountIndex].balance -= amount;
            } else {
                allAccounts[ownersEquityAccountIndex].balance += amount;
            }
        }
    } else if (type === 'Payment' && expenseAccountId) {
        const expenseAccountIndex = allAccounts.findIndex((a)=>a.code === expenseAccountId);
        if (expenseAccountIndex !== -1) {
            allAccounts[expenseAccountIndex].balance += amount;
        }
    } else if (type === 'Receipt') {
        // Assuming non-equity receipts are rental income for simplicity
        const revenueAccountIndex = allAccounts.findIndex((a)=>a.code === '4110');
        if (revenueAccountIndex !== -1) {
            allAccounts[revenueAccountIndex].balance += amount;
        }
    }
    // Update Accounts Payable for vendor transactions
    if (partyType === 'Vendor') {
        if (accountsPayableIndex !== -1) {
            if (type === 'Payment') {
                allAccounts[accountsPayableIndex].balance -= amount;
            } else {
                allAccounts[accountsPayableIndex].balance -= amount;
            }
        }
    }
    await writeData(accountsFilePath, allAccounts);
}
const workflowActionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    transactionId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actorId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    actorRole: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    comment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const performStateTransition = (transaction, action, currentUserRole)=>{
    let newStatus = transaction.currentStatus || 'DRAFT';
    switch(action){
        case 'SUBMIT':
            if (transaction.currentStatus === 'DRAFT' || transaction.currentStatus === 'REJECTED') {
                newStatus = 'PENDING_ADMIN_APPROVAL';
            }
            break;
        case 'APPROVE':
            if (transaction.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'Admin') {
                newStatus = 'PENDING_SUPER_ADMIN_APPROVAL';
            } else if (transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'Super Admin') {
                newStatus = 'POSTED';
            }
            break;
        case 'REJECT':
            if (transaction.currentStatus === 'PENDING_ADMIN_APPROVAL' && currentUserRole === 'Admin') {
                newStatus = 'REJECTED';
            } else if (transaction.currentStatus === 'PENDING_SUPER_ADMIN_APPROVAL' && currentUserRole === 'Super Admin') {
                newStatus = 'REJECTED';
            }
            break;
        default:
            break;
    }
    return newStatus;
};
const getHistoryActionText = (action, newStatus, previousStatus, role)=>{
    switch(action){
        case 'SUBMIT':
            return 'Submitted for Approval';
        case 'APPROVE':
            if (newStatus === 'POSTED') return 'Final Approval & Posted';
            return `Approved by ${role}`;
        case 'REJECT':
            return `Rejected by ${role}`;
        case 'ADD_COMMENT':
            return 'Comment Added';
        default:
            return 'Action Performed';
    }
};
async function updateTransactionWorkflow(transactionId, action, actorId, actorRole, comment) {
    try {
        const allPayments = await readPayments();
        const transactionIndex = allPayments.findIndex((t)=>t.id === transactionId);
        if (transactionIndex === -1) {
            return {
                success: false,
                error: 'Transaction not found.'
            };
        }
        const transaction = allPayments[transactionIndex];
        const previousStatus = transaction.currentStatus || 'DRAFT';
        const newStatus = performStateTransition(transaction, action, actorRole);
        const historyActionText = getHistoryActionText(action, newStatus, previousStatus, actorRole);
        const newHistoryEntry = {
            action: historyActionText,
            actorId: actorId,
            actorRole: actorRole,
            timestamp: new Date().toISOString(),
            comments: comment || ''
        };
        allPayments[transactionIndex] = {
            ...transaction,
            currentStatus: newStatus,
            approvalHistory: [
                ...transaction.approvalHistory || [],
                newHistoryEntry
            ]
        };
        if (newStatus === 'POSTED' && previousStatus !== 'POSTED') {
            await applyFinancialImpact(allPayments[transactionIndex]);
        }
        await writePayments(allPayments);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/workflow');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/banking');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/chart-of-accounts');
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
async function submitTransaction(params) {
    const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return {
        success: false,
        error: "Invalid input"
    };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'SUBMIT', actorId, actorRole, comment);
}
async function approveTransaction(params) {
    const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return {
        success: false,
        error: "Invalid input"
    };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'APPROVE', actorId, actorRole, comment);
}
async function rejectTransaction(params) {
    const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return {
        success: false,
        error: "Invalid input"
    };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'REJECT', actorId, actorRole, comment);
}
async function addCommentToTransaction(params) {
    const validation = workflowActionSchema.safeParse(params);
    if (!validation.success) return {
        success: false,
        error: "Invalid input"
    };
    const { transactionId, actorId, actorRole, comment } = validation.data;
    return await updateTransactionWorkflow(transactionId, 'ADD_COMMENT', actorId, actorRole, comment);
}
async function reverseFinancialImpact(payment) {
    if (payment.currentStatus !== 'POSTED') return;
    if (payment.paymentFrom === 'Petty Cash') {
        const pettyCash = await readPettyCash();
        if (payment.type === 'Payment') {
            pettyCash.balance += payment.amount;
        } else {
            pettyCash.balance -= payment.amount;
        }
        await writePettyCash(pettyCash);
    } else if (payment.bankAccountId) {
        const allBankAccounts = await readBankAccounts();
        const accountIndex = allBankAccounts.findIndex((acc)=>acc.id === payment.bankAccountId);
        if (accountIndex !== -1) {
            if (payment.type === 'Payment') {
                allBankAccounts[accountIndex].balance += payment.amount;
            } else {
                allBankAccounts[accountIndex].balance -= payment.amount;
            }
            await writeBankAccounts(allBankAccounts);
        }
    }
    const allAccounts = await readData(accountsFilePath);
    const { type, amount, expenseAccountId, partyType, partyName } = payment;
    if (partyName === 'Owner') {
        const ownersEquityAccountIndex = allAccounts.findIndex((a)=>a.code === '3110');
        if (ownersEquityAccountIndex !== -1) {
            if (type === 'Payment') {
                allAccounts[ownersEquityAccountIndex].balance += amount;
            } else {
                allAccounts[ownersEquityAccountIndex].balance -= amount;
            }
        }
    } else if (type === 'Payment' && expenseAccountId) {
        const expenseAccountIndex = allAccounts.findIndex((a)=>a.code === expenseAccountId);
        if (expenseAccountIndex !== -1) {
            allAccounts[expenseAccountIndex].balance -= amount;
        }
    } else if (type === 'Receipt') {
        const revenueAccountIndex = allAccounts.findIndex((a)=>a.code === '4110');
        if (revenueAccountIndex !== -1) {
            allAccounts[revenueAccountIndex].balance -= amount;
        }
    }
    if (partyType === 'Vendor') {
        const accountsPayableIndex = allAccounts.findIndex((a)=>a.code === '2110');
        if (accountsPayableIndex !== -1) {
            if (type === 'Payment') {
                allAccounts[accountsPayableIndex].balance += amount;
            } else {
                allAccounts[accountsPayableIndex].balance += amount;
            }
        }
    }
    await writeData(accountsFilePath, allAccounts);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    applyFinancialImpact,
    submitTransaction,
    approveTransaction,
    rejectTransaction,
    addCommentToTransaction,
    reverseFinancialImpact
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(applyFinancialImpact, "40bf8da82d2e5d4234a62b8c165efb090a74e54a42", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitTransaction, "4047f1be9f4ec23f6c3699a601835a82156d8eb5e4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveTransaction, "408b6ef6fc8d09194066701fa2edd4ea8f9305defb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(rejectTransaction, "40c95dd5b507e2eb7d80a18ecfb45b4f1808addef8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addCommentToTransaction, "40979727ef980c7aba95e802e0d29daccf4b768563", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(reverseFinancialImpact, "40a66ec237e98904229939f469d1841c1eb84346ba", null);
}),
"[project]/src/app/finance/payment/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"000261da198188e5d9484e2e2289439448ebce43fd":"getNextPaymentVoucherNumber","005d8c10ef7dc431c39b0717c7fb71a290ea36b7b7":"getPartyNameLookups","00eef14e218e0bc4efbeaa6260de16a9ea3eabdd44":"getSummary","4016c3c006e7c892c5c0429b2af9ce120127c775a5":"restorePayment","405ed6eb80a36d6fbbbde208eaa4113ea43f4578ff":"cancelPayment","40bf7b83aadd69dd72d817b755f99ee278568979fd":"deletePayment","40c1f5a296264d9ae6886751e698393d67781cc609":"getPayments","40f63833d5b57077b24cc2382f8d23e4cdb16edf29":"addPayment","7ca7e9feb76f697a6346d34a2f43785d84a5fab496":"getReferences"},"",""] */ __turbopack_context__.s([
    "addPayment",
    ()=>addPayment,
    "cancelPayment",
    ()=>cancelPayment,
    "deletePayment",
    ()=>deletePayment,
    "getNextPaymentVoucherNumber",
    ()=>getNextPaymentVoucherNumber,
    "getPartyNameLookups",
    ()=>getPartyNameLookups,
    "getPayments",
    ()=>getPayments,
    "getReferences",
    ()=>getReferences,
    "getSummary",
    ()=>getSummary,
    "restorePayment",
    ()=>restorePayment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$payment$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/payment/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfMonth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/endOfMonth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isWithinInterval$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isWithinInterval.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
const paymentsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const invoicesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const billsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/bill/bills-data.json');
const receiptBooksFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');
const tenancyContractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
async function readData(filePath) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(filePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writeData(filePath, data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readPayments() {
    return await readData(paymentsFilePath);
}
async function writePayments(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readInvoices() {
    return await readData(invoicesFilePath);
}
async function writeInvoices(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(invoicesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readBills() {
    return await readData(billsFilePath);
}
async function writeBills(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(billsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function applyPaymentToBills(billPayments, vendorCode) {
    try {
        const allBills = await readBills();
        let utilityAccountId;
        for (const payment of billPayments){
            const index = allBills.findIndex((b)=>b.id === payment.billId);
            if (index !== -1) {
                allBills[index].amountPaid = (allBills[index].amountPaid || 0) + payment.amount;
                const remainingBalance = allBills[index].total - allBills[index].amountPaid;
                if (remainingBalance <= 0.001) {
                    allBills[index].status = 'Paid';
                } else if (allBills[index].status === 'Draft' || allBills[index].status === 'Overdue') {
                    allBills[index].status = 'Sent';
                }
                // Carry over the utilityAccountId if it exists on the bill
                if (allBills[index].utilityAccountId) {
                    utilityAccountId = allBills[index].utilityAccountId;
                }
            }
        }
        await writeBills(allBills);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/vendors/add?code=${vendorCode}`);
        return {
            success: true,
            utilityAccountId
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function getPayments(user) {
    const allPayments = await readPayments();
    // Filter out cancelled payments from the main view
    const activePayments = allPayments.filter((p)=>p.status !== 'Cancelled');
    if (user.role === 'Admin' || user.role === 'Super Admin') {
        return activePayments.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    const userPayments = activePayments.filter((p)=>p.createdByUser === user.name);
    return userPayments.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
}
async function updateReceiptBookUsage(receiptNo) {
    try {
        const books = await readData(receiptBooksFilePath);
        const [bookNo] = receiptNo.split('-');
        if (!bookNo) return;
        const bookIndex = books.findIndex((b)=>b.bookNo === bookNo);
        if (bookIndex !== -1) {
            books[bookIndex].leafsUsed = (books[bookIndex].leafsUsed || 0) + 1;
            if (books[bookIndex].leafsUsed >= books[bookIndex].noOfLeafs) {
                books[bookIndex].status = 'Finished';
            }
            await writeData(receiptBooksFilePath, books);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/book-management');
        }
    } catch (error) {
        console.error(`Failed to update receipt book for receipt #${receiptNo}`, error);
    }
}
async function addPayment(data) {
    const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$payment$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["paymentSchema"].safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    const paymentData = validation.data;
    try {
        const allPayments = await readPayments();
        if (paymentData.referenceNo && paymentData.referenceType !== 'Other') {
            const isDuplicate = allPayments.some((p)=>p.referenceNo === paymentData.referenceNo && p.status !== 'Cancelled');
            if (isDuplicate) {
                return {
                    success: false,
                    error: `A payment for reference "${paymentData.referenceNo}" already exists.`
                };
            }
        }
        const workflowSettings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkflowSettings"])();
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'DRAFT' : 'POSTED';
        const newId = paymentData.id || `PAY-${Date.now()}`;
        const newPayment = {
            ...paymentData,
            id: newId,
            currentStatus: initialStatus
        };
        if (newPayment.type === 'Receipt' && newPayment.invoiceAllocations && newPayment.invoiceAllocations.length > 0) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyPaymentToInvoices"])(newPayment.invoiceAllocations, newPayment.partyName);
        }
        if (newPayment.type === 'Payment' && newPayment.billAllocations && newPayment.billAllocations.length > 0) {
            const billResult = await applyPaymentToBills(newPayment.billAllocations, newPayment.partyName);
            if (billResult.utilityAccountId) {
                newPayment.utilityAccountId = billResult.utilityAccountId;
            }
        }
        // If it's a DRAFT, the approval history will be added upon submission.
        if (initialStatus === 'POSTED') {
            newPayment.approvalHistory = [
                {
                    action: 'Created & Auto-Posted',
                    actorId: paymentData.createdByUser || 'System',
                    actorRole: 'User',
                    timestamp: new Date().toISOString(),
                    comments: 'Directly recorded transaction.'
                }
            ];
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"])(newPayment);
        }
        if (newPayment.referenceType === 'Receipt Book' && newPayment.referenceNo) {
            await updateReceiptBookUsage(newPayment.referenceNo);
        }
        allPayments.push(newPayment);
        await writePayments(allPayments);
        revalidateAllPaths(newPayment);
        return {
            success: true,
            data: newPayment
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function cancelPayment(paymentId) {
    try {
        const allPayments = await readPayments();
        const paymentIndex = allPayments.findIndex((p)=>p.id === paymentId);
        if (paymentIndex === -1) {
            return {
                success: false,
                error: 'Payment not found.'
            };
        }
        const paymentToCancel = allPayments[paymentIndex];
        if (paymentToCancel.status === 'Cancelled') {
            return {
                success: false,
                error: 'Payment is already cancelled.'
            };
        }
        if (paymentToCancel.currentStatus === 'POSTED') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reverseFinancialImpact"])(paymentToCancel);
        }
        allPayments[paymentIndex].status = 'Cancelled';
        await writePayments(allPayments);
        revalidateAllPaths(paymentToCancel);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function restorePayment(paymentId) {
    try {
        const allPayments = await readPayments();
        const paymentIndex = allPayments.findIndex((p)=>p.id === paymentId);
        if (paymentIndex === -1) {
            return {
                success: false,
                error: 'Payment not found.'
            };
        }
        const paymentToRestore = allPayments[paymentIndex];
        if (paymentToRestore.status !== 'Cancelled') {
            return {
                success: false,
                error: 'Payment is not cancelled.'
            };
        }
        if (paymentToRestore.currentStatus === 'POSTED') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"])(paymentToRestore);
        }
        // Restore to a sensible previous state
        paymentToRestore.status = paymentToRestore.type === 'Payment' ? 'Paid' : 'Received';
        await writePayments(allPayments);
        revalidateAllPaths(paymentToRestore);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function deletePayment(paymentId) {
    try {
        const allPayments = await readPayments();
        const paymentToDelete = allPayments.find((p)=>p.id === paymentId);
        if (!paymentToDelete) {
            return {
                success: false,
                error: 'Payment not found.'
            };
        }
        if (paymentToDelete.currentStatus === 'POSTED') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reverseFinancialImpact"])(paymentToDelete);
        }
        const updatedPayments = allPayments.filter((p)=>p.id !== paymentId);
        await writePayments(updatedPayments);
        revalidateAllPaths(paymentToDelete);
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
function revalidateAllPaths(payment) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/payment');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/banking');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/chart-of-accounts');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/vendors/agents');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/workflow');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/customer/add?code=${payment.partyName}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/vendors/add?code=${payment.partyName}`);
}
async function getPartyNameLookups() {
    // This function can be moved to a central lookup file to avoid duplication
    // For now, keeping it here to fix the immediate issue.
    const tenants = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlords = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const vendors = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/vendors-data.json'));
    const agents = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/agents/agents-data.json'));
    const customers = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));
    const lookups = {};
    tenants.forEach((t)=>{
        if (t.tenantData.code) lookups[t.tenantData.code] = t.tenantData.name;
    });
    landlords.forEach((l)=>{
        if (l.landlordData.code) lookups[l.landlordData.code] = l.landlordData.name;
    });
    vendors.forEach((v)=>{
        if (v.vendorData.code) lookups[v.vendorData.code] = v.vendorData.name;
    });
    agents.forEach((a)=>{
        if (a.code) lookups[a.code] = a.name;
    });
    customers.forEach((c)=>{
        if (c.customerData.code) lookups[c.customerData.code] = c.customerData.name;
    });
    return lookups;
}
async function getSummary() {
    const payments = await readPayments();
    const now = new Date();
    const startOfThisMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfMonth"])(now);
    const endOfThisMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["endOfMonth"])(now);
    const summary = {
        totalReceivedThisMonth: 0,
        totalPaidThisMonth: 0
    };
    for (const payment of payments){
        if (payment.currentStatus !== 'POSTED') continue;
        const paymentDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseISO"])(payment.date);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isWithinInterval$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWithinInterval"])(paymentDate, {
            start: startOfThisMonth,
            end: endOfThisMonth
        })) {
            if (payment.type === 'Receipt') {
                summary.totalReceivedThisMonth += payment.amount;
            } else if (payment.type === 'Payment') {
                summary.totalPaidThisMonth += payment.amount;
            }
        }
    }
    return summary;
}
async function getNextPaymentVoucherNumber() {
    const payments = await readPayments();
    const paymentVouchers = payments.filter((p)=>p.type === 'Payment');
    if (paymentVouchers.length === 0) {
        return 'PV-00001';
    }
    const lastVoucherNo = paymentVouchers.reduce((max, p)=>{
        const currentNum = parseInt(p.voucherNo.split('-')[1], 10);
        return currentNum > max ? currentNum : max;
    }, 0);
    return `PV-${(lastVoucherNo + 1).toString().padStart(5, '0')}`;
}
async function getReferences(partyType, partyName, referenceType, paymentType, collectorName) {
    if (!partyType || !partyName || !referenceType) return [];
    const allPayments = await readPayments();
    const paidRefs = new Set(allPayments.filter((p)=>p.status !== 'Cancelled').map((p)=>p.referenceNo));
    let references = [];
    if (paymentType === 'Receipt') {
        if (referenceType === 'Tenancy Contract') {
            const contracts = await readData(tenancyContractsFilePath);
            references = contracts.filter((c)=>c.tenantCode === partyName).map((c)=>({
                    value: c.contractNo,
                    label: `Contract: ${c.contractNo} (Property: ${c.property})`,
                    amount: c.totalRent,
                    propertyCode: c.property,
                    unitCode: c.unitCode,
                    roomCode: c.roomCode
                }));
        } else if (referenceType === 'Invoice') {
            const invoices = await readData(invoicesFilePath);
            references = invoices.filter((i)=>i.customerCode === partyName && i.status !== 'Paid' && i.status !== 'Cancelled').map((i)=>({
                    value: i.invoiceNo,
                    label: `Invoice: ${i.invoiceNo} (Due: ${i.dueDate}, Bal: ${i.total - (i.amountPaid || 0)})`,
                    amount: i.total - (i.amountPaid || 0),
                    propertyCode: i.property,
                    unitCode: i.unitCode,
                    roomCode: i.roomCode
                }));
        } else if (referenceType === 'Receipt Book') {
            const books = await readData(receiptBooksFilePath);
            books.forEach((book)=>{
                if (book.status === 'Active' && (!book.assignedTo || book.assignedTo === collectorName)) {
                    for(let i = book.receiptStartNo; i <= book.receiptEndNo; i++){
                        const receiptNo = `${book.bookNo}-${i}`;
                        if (!paidRefs.has(receiptNo)) {
                            references.push({
                                value: receiptNo,
                                label: `Book: ${book.bookNo}, Receipt: ${i}`,
                                book: book
                            });
                        }
                    }
                }
            });
        }
    } else {
        if (referenceType === 'Lease Contract') {
            const contracts = await readData(leaseContractsFilePath);
            references = contracts.filter((c)=>c.landlordCode === partyName).map((c)=>({
                    value: c.contractNo,
                    label: `Lease: ${c.contractNo} (Property: ${c.property})`,
                    amount: c.totalRent,
                    propertyCode: c.property
                }));
        } else if (referenceType === 'Bill') {
            const bills = await readData(billsFilePath);
            references = bills.filter((b)=>b.vendorCode === partyName && b.status !== 'Paid' && b.status !== 'Cancelled').map((b)=>({
                    value: b.billNo,
                    label: `Bill: ${b.billNo} (Due: ${b.dueDate}, Bal: ${b.total - (b.amountPaid || 0)})`,
                    amount: b.total - (b.amountPaid || 0),
                    propertyCode: b.property,
                    unitCode: b.unitCode,
                    roomCode: b.roomCode
                }));
        }
    }
    return references;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPayments,
    addPayment,
    cancelPayment,
    restorePayment,
    deletePayment,
    getPartyNameLookups,
    getSummary,
    getNextPaymentVoucherNumber,
    getReferences
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPayments, "40c1f5a296264d9ae6886751e698393d67781cc609", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addPayment, "40f63833d5b57077b24cc2382f8d23e4cdb16edf29", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelPayment, "405ed6eb80a36d6fbbbde208eaa4113ea43f4578ff", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(restorePayment, "4016c3c006e7c892c5c0429b2af9ce120127c775a5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePayment, "40bf7b83aadd69dd72d817b755f99ee278568979fd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPartyNameLookups, "005d8c10ef7dc431c39b0717c7fb71a290ea36b7b7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSummary, "00eef14e218e0bc4efbeaa6260de16a9ea3eabdd44", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getNextPaymentVoucherNumber, "000261da198188e5d9484e2e2289439448ebce43fd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReferences, "7ca7e9feb76f697a6346d34a2f43785d84a5fab496", null);
}),
"[project]/src/app/finance/receipt-vouchers/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00132b3146beb70d86c9817f2bfd525f2e81e613e4":"getReceiptVouchers","002ede323b53f5d93882f2898e49fc6e7965a8ad24":"getReceiptVoucherLookups","40e60c2660e0213854fceb8330d0fcd34d941c25c2":"deleteReceiptVoucher","600d501d043cb653f5998289ee36696c02a986e9c4":"saveReceiptVoucherBatch","604ad8289f423857361aa9311927e6c9c32c41a7ea":"getDueAmountForParty"},"",""] */ __turbopack_context__.s([
    "deleteReceiptVoucher",
    ()=>deleteReceiptVoucher,
    "getDueAmountForParty",
    ()=>getDueAmountForParty,
    "getReceiptVoucherLookups",
    ()=>getReceiptVoucherLookups,
    "getReceiptVouchers",
    ()=>getReceiptVouchers,
    "saveReceiptVoucherBatch",
    ()=>saveReceiptVoucherBatch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/receipt-vouchers/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$payment$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/payment/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
const vouchersFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/receipt-vouchers/vouchers-data.json');
const receiptBooksFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json');
const usersFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/user-roles/users.json');
const contractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const invoicesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/customer/invoice/invoices-data.json');
const propertiesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const unitsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/units/units-data.json');
const roomsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const paymentsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/payment/payments-data.json');
async function readData(filePath, defaultValue = []) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(filePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        throw error;
    }
}
async function writeVouchers(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(vouchersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function getReceiptVouchers() {
    const vouchers = await readData(vouchersFilePath, []);
    return vouchers.sort((a, b)=>new Date(b.date).getTime() - new Date(a.date).getTime());
}
async function getReceiptVoucherLookups() {
    const books = await readData(receiptBooksFilePath);
    const users = await readData(usersFilePath);
    const allVouchers = await getReceiptVouchers();
    const usedReceiptNos = new Set(allVouchers.map((v)=>v.receiptNo));
    const properties = await readData(propertiesFilePath);
    const units = await readData(unitsFilePath);
    const rooms = await readData(roomsFilePath);
    const availableReceipts = [];
    books.filter((b)=>b.status === 'Active').forEach((book)=>{
        for(let i = book.receiptStartNo; i <= book.receiptEndNo; i++){
            const receiptNo = `${book.bookNo}-${i}`;
            if (!usedReceiptNos.has(receiptNo)) {
                availableReceipts.push({
                    value: receiptNo,
                    label: `Book: ${book.bookNo}, Receipt: ${i}`,
                    book: book
                });
            }
        }
    });
    return {
        receipts: availableReceipts,
        collectors: users.map((u)=>({
                value: u.name,
                label: u.name
            })),
        properties: properties.map((p)=>({
                value: p.propertyData.code,
                label: p.propertyData.name
            })),
        units: units.map((u)=>({
                value: u.unitCode,
                label: u.unitCode,
                propertyCode: u.propertyCode
            })),
        rooms: rooms.map((r)=>({
                value: r.roomCode,
                label: r.roomCode,
                propertyCode: r.propertyCode,
                unitCode: r.unitCode
            }))
    };
}
const batchFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    vouchers: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["receiptVoucherSchema"].omit({
        id: true,
        createdBy: true
    }))
});
async function saveReceiptVoucherBatch(data, createdBy) {
    const validation = batchFormSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: validation.error.errors.map((e)=>e.message).join(', ')
        };
    }
    try {
        const allVouchers = await getReceiptVouchers();
        const newVouchers = [];
        for (const voucherData of validation.data.vouchers){
            const voucherExists = allVouchers.some((v)=>v.receiptNo === voucherData.receiptNo);
            if (voucherExists) {
                console.warn(`Skipping duplicate receipt number: ${voucherData.receiptNo}`);
                continue;
            }
            const newVoucher = {
                ...voucherData,
                id: `RV-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                createdBy
            };
            const paymentResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$payment$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addPayment"])({
                type: 'Receipt',
                date: newVoucher.date,
                partyType: newVoucher.partyType,
                partyName: newVoucher.partyName,
                amount: newVoucher.amount,
                paymentMethod: newVoucher.paymentMethod,
                bankAccountId: newVoucher.bankAccountId,
                paymentFrom: newVoucher.bankAccountId ? 'Bank' : 'Petty Cash',
                referenceType: 'Receipt Book',
                referenceNo: newVoucher.receiptNo,
                description: `Payment received via Receipt Voucher #${newVoucher.receiptNo}. Collected by ${newVoucher.collectedBy}.`,
                createdByUser: createdBy,
                status: 'Received',
                property: newVoucher.property,
                unitCode: newVoucher.unitCode,
                roomCode: newVoucher.roomCode
            });
            if (!paymentResult.success) {
                console.error(`Failed to create financial transaction for receipt ${newVoucher.receiptNo}: ${paymentResult.error}`);
                continue;
            }
            newVouchers.push(newVoucher);
        }
        if (newVouchers.length === 0) {
            return {
                success: false,
                error: "No valid new vouchers to save. They might be duplicates."
            };
        }
        allVouchers.push(...newVouchers);
        await writeVouchers(allVouchers);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/receipt-vouchers');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/payment');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/book-management');
        return {
            success: true,
            count: newVouchers.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function reverseReceiptBookUsage(receiptNo) {
    try {
        const books = await readData(receiptBooksFilePath);
        const [bookNo] = receiptNo.split('-');
        if (!bookNo) return;
        const bookIndex = books.findIndex((b)=>b.bookNo === bookNo);
        if (bookIndex !== -1) {
            books[bookIndex].leafsUsed = Math.max(0, (books[bookIndex].leafsUsed || 0) - 1);
            if (books[bookIndex].status === 'Finished') {
                books[bookIndex].status = 'Active';
            }
            await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(receiptBooksFilePath, JSON.stringify(books, null, 2), 'utf-8');
        }
    } catch (error) {
        console.error(`Failed to reverse receipt book usage for receipt #${receiptNo}`, error);
    }
}
async function deleteReceiptVoucher(voucherId) {
    const allVouchers = await getReceiptVouchers();
    const voucherToDelete = allVouchers.find((v)=>v.id === voucherId);
    if (!voucherToDelete) {
        return {
            success: false,
            error: "Receipt voucher not found."
        };
    }
    const allPayments = await readData(paymentsFilePath);
    const associatedPayment = allPayments.find((p)=>p.referenceNo === voucherToDelete.receiptNo);
    if (associatedPayment) {
        const deleteResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$payment$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePayment"])(associatedPayment.id);
        if (!deleteResult.success) {
            return {
                success: false,
                error: `Could not delete associated payment: ${deleteResult.error}`
            };
        }
    }
    await reverseReceiptBookUsage(voucherToDelete.receiptNo);
    const updatedVouchers = allVouchers.filter((v)=>v.id !== voucherId);
    await writeVouchers(updatedVouchers);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/receipt-vouchers');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/payment');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/book-management');
    return {
        success: true
    };
}
async function getDueAmountForParty(partyType, partyCode) {
    let totalDue = 0;
    let property = '', unitCode = '', roomCode = '';
    if (partyType === 'Tenant') {
        const contracts = await readData(contractsFilePath);
        const tenantContracts = contracts.filter((c)=>c.tenantCode === partyCode && (c.status === 'New' || c.status === 'Renew'));
        if (tenantContracts.length > 0) {
            const latestContract = tenantContracts.sort((a, b)=>new Date(b.endDate).getTime() - new Date(a.endDate).getTime())[0];
            property = latestContract.property || '';
            unitCode = latestContract.unitCode || '';
            roomCode = latestContract.roomCode || '';
            latestContract.paymentSchedule.forEach((p)=>{
                if (p.status === 'unpaid') {
                    totalDue += p.amount;
                }
            });
        }
    } else if (partyType === 'Customer') {
        const invoices = await readData(invoicesFilePath);
        const customerInvoices = invoices.filter((i)=>i.customerCode === partyCode && i.status !== 'Paid' && i.status !== 'Cancelled');
        if (customerInvoices.length > 0) {
            const firstUnpaidInvoice = customerInvoices.sort((a, b)=>new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
            property = firstUnpaidInvoice.property || '';
            unitCode = firstUnpaidInvoice.unitCode || '';
            roomCode = firstUnpaidInvoice.roomCode || '';
        }
        customerInvoices.forEach((i)=>{
            totalDue += i.total - (i.amountPaid || 0);
        });
    }
    return {
        totalDue,
        property,
        unitCode,
        roomCode
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getReceiptVouchers,
    getReceiptVoucherLookups,
    saveReceiptVoucherBatch,
    deleteReceiptVoucher,
    getDueAmountForParty
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReceiptVouchers, "00132b3146beb70d86c9817f2bfd525f2e81e613e4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getReceiptVoucherLookups, "002ede323b53f5d93882f2898e49fc6e7965a8ad24", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveReceiptVoucherBatch, "600d501d043cb653f5998289ee36696c02a986e9c4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteReceiptVoucher, "40e60c2660e0213854fceb8330d0fcd34d941c25c2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDueAmountForParty, "604ad8289f423857361aa9311927e6c9c32c41a7ea", null);
}),
"[project]/.next-internal/server/app/finance/receipt-vouchers/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/finance/receipt-vouchers/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/receipt-vouchers/actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/finance/receipt-vouchers/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/finance/receipt-vouchers/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00132b3146beb70d86c9817f2bfd525f2e81e613e4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getReceiptVouchers"],
    "00484ec9aa59cb806ed9f49233b1daa442fefc4db8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCombinedAccessControlData"],
    "008a29e84bd260b304f797613c7c39c01029f96950",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkLicenseStatus"],
    "00b6be478acfdf6b7794a7b34be547b3606ebfd51c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyProfile"],
    "00bf02fbdbf2069a58be66f4c215b7083c555f2e0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrencySettings"],
    "40c9350172a0cc49767c134a7e5ed44affe0683337",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyProfile"],
    "40e60c2660e0213854fceb8330d0fcd34d941c25c2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteReceiptVoucher"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/finance/receipt-vouchers/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/license.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/app/finance/receipt-vouchers/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/receipt-vouchers/actions.ts [app-rsc] (ecmascript)");
}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/finance/receipt-vouchers/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/finance/receipt-vouchers/page.tsx <module evaluation>", "default");
}),
"[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/finance/receipt-vouchers/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/finance/receipt-vouchers/page.tsx", "default");
}),
"[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$receipt$2d$vouchers$2f$page$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/finance/receipt-vouchers/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2fec7d90._.js.map