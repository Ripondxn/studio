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
"[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00831fee985f82fbb15a66fe64cff566d6c6f2867b":"getAllTenants","400726e3bdf468c8f88bbdb9aaa36ab5f223b4fb88":"deleteTenantData","403c44f137a3ca19d2679727ba3eaf54e85a4e3dd6":"findTenantData","40c7c6f727d1176bc496bfd420805a4dd89df95ec4":"cancelSubscription","6036964a174b54674356664e3bee36f62e4123d1df":"saveSubscriptionSettings","70d98d48fadc7e403939dd6b646483c6ffbf3102b8":"saveTenantData"},"",""] */ __turbopack_context__.s([
    "cancelSubscription",
    ()=>cancelSubscription,
    "deleteTenantData",
    ()=>deleteTenantData,
    "findTenantData",
    ()=>findTenantData,
    "getAllTenants",
    ()=>getAllTenants,
    "saveSubscriptionSettings",
    ()=>saveSubscriptionSettings,
    "saveTenantData",
    ()=>saveTenantData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase/admin-config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getTenants() {
    const tenantsCollection = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('tenants');
    const snapshot = await tenantsCollection.get();
    return snapshot.docs.map((doc)=>doc.data());
}
async function getContracts() {
    const contractsCollection = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('contracts');
    const snapshot = await contractsCollection.get();
    return snapshot.docs.map((doc)=>doc.data());
}
async function getInvoices() {
    const invoicesCollection = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('invoices');
    const snapshot = await invoicesCollection.get();
    return snapshot.docs.map((doc)=>doc.data());
}
async function getAllTenants() {
    const tenants = await getTenants();
    const contracts = await getContracts();
    const invoices = await getInvoices();
    const contractsByTenantCode = new Map();
    for (const contract of contracts){
        if (contract.tenantCode) {
            if (!contractsByTenantCode.has(contract.tenantCode) || new Date(contract.endDate) > new Date(contractsByTenantCode.get(contract.tenantCode).endDate)) {
                contractsByTenantCode.set(contract.tenantCode, contract);
            }
        }
    }
    const invoiceStatsByCustomer = new Map();
    for (const invoice of invoices){
        if (invoice.status !== 'Cancelled') {
            if (!invoiceStatsByCustomer.has(invoice.customerCode)) {
                invoiceStatsByCustomer.set(invoice.customerCode, {
                    totalBilled: 0,
                    totalPaid: 0
                });
            }
            const stats = invoiceStatsByCustomer.get(invoice.customerCode);
            stats.totalBilled += invoice.total;
            stats.totalPaid += invoice.amountPaid || 0;
        }
    }
    return tenants.filter((l)=>l.tenantData && l.tenantData.code).map((l)=>{
        const tenantCode = l.tenantData.code;
        const contract = contractsByTenantCode.get(tenantCode);
        let dueBalance = 0;
        let contractValue = 0;
        let paidAmount = 0;
        if (l.tenantData.isSubscriptionActive) {
            const stats = invoiceStatsByCustomer.get(tenantCode) || {
                totalBilled: 0,
                totalPaid: 0
            };
            contractValue = stats.totalBilled;
            paidAmount = stats.totalPaid;
            dueBalance = contractValue - paidAmount;
        } else if (contract) {
            contractValue = contract.totalRent;
            const paidInstallments = contract.paymentSchedule.filter((p)=>p.status === 'paid');
            paidAmount = paidInstallments.reduce((sum, p)=>sum + p.amount, 0);
            dueBalance = contractValue - paidAmount;
        }
        return {
            ...l.tenantData,
            attachments: l.attachments || [],
            contractId: contract?.id || null,
            contractNo: contract?.contractNo || null,
            isSubscriptionActive: l.tenantData.isSubscriptionActive || false,
            contractValue,
            paidAmount,
            dueBalance
        };
    });
}
async function getNextTenantCode() {
    const allTenants = await getTenants();
    let maxNum = 0;
    allTenants.forEach((t)=>{
        const code = t.tenantData.code || '';
        const match = code.match(/^T(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    const nextNum = maxNum + 1;
    return `T${nextNum.toString().padStart(4, '0')}`;
}
async function saveTenantData(dataToSave, isNewRecord, isAutoCode) {
    try {
        const { attachments, ...tenantData } = dataToSave;
        let tenantCode = tenantData.code;
        if (isNewRecord && isAutoCode) {
            tenantCode = await getNextTenantCode();
            tenantData.code = tenantCode;
        }
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('tenants').doc(tenantCode);
        const dataForDb = {
            tenantData,
            attachments
        };
        if (isNewRecord) {
            await docRef.set(dataForDb);
        } else {
            await docRef.update(dataForDb);
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/tenants');
        return {
            success: true,
            data: dataForDb
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
async function findTenantData(tenantCode) {
    try {
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('tenants').doc(tenantCode);
        const doc = await docRef.get();
        if (doc.exists) {
            return {
                success: true,
                data: doc.data()
            };
        } else {
            return {
                success: false,
                error: 'Tenant not found'
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
async function deleteTenantData(tenantCode) {
    try {
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('tenants').doc(tenantCode);
        await docRef.delete();
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/tenants');
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
async function cancelSubscription(tenantCode) {
    try {
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('tenants').doc(tenantCode);
        await docRef.update({
            'tenantData.isSubscriptionActive': false
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/tenants');
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
async function saveSubscriptionSettings(tenantCode, settings) {
    try {
        const docRef = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2f$admin$2d$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["firestoreAdmin"].collection('tenants').doc(tenantCode);
        await docRef.update({
            'tenantData.subscription': settings
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/tenants');
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
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getAllTenants,
    saveTenantData,
    findTenantData,
    deleteTenantData,
    cancelSubscription,
    saveSubscriptionSettings
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllTenants, "00831fee985f82fbb15a66fe64cff566d6c6f2867b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveTenantData, "70d98d48fadc7e403939dd6b646483c6ffbf3102b8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(findTenantData, "403c44f137a3ca19d2679727ba3eaf54e85a4e3dd6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteTenantData, "400726e3bdf468c8f88bbdb9aaa36ab5f223b4fb88", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelSubscription, "40c7c6f727d1176bc496bfd420805a4dd89df95ec4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveSubscriptionSettings, "6036964a174b54674356664e3bee36f62e4123d1df", null);
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
"[project]/src/app/lookups/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"000e606f4bfa091a26b7d7183ad8692c928e388562":"getLookups","00567bca6b13ba5f6bcb69520bc60b3e32154d40c3":"getExpenseAccounts"},"",""] */ __turbopack_context__.s([
    "getExpenseAccounts",
    ()=>getExpenseAccounts,
    "getLookups",
    ()=>getLookups
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function readData(filePath, defaultValue = []) {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            try {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(filePath), {
                    recursive: true
                });
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
                return defaultValue;
            } catch (writeError) {
                console.error(`Error creating file ${filePath}:`, writeError);
                throw writeError;
            }
        }
        throw error;
    }
}
async function getLookups() {
    const tenantsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json'));
    const landlordsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/landlord/landlords-data.json'));
    const vendorsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/vendors-data.json'));
    const agentsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/agents/agents-data.json'));
    const customersData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/customer/customers-data.json'));
    const bankAccountsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/banking/accounts-data.json'));
    const usersData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/admin/user-roles/users.json'));
    const receiptBooksData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/book-management/receipt-books-data.json'));
    const propertiesData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/properties/list/properties-data.json'));
    const unitsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/units/units-data.json'));
    const roomsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/rooms/rooms-data.json'));
    const productsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/products/products-data.json'));
    const maintenanceTicketsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/maintenance/ticket-issue/tickets-data.json'));
    const expenseAccountsData = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
    return {
        tenants: tenantsData.map((t)=>({
                value: t.tenantData.code,
                label: t.tenantData.name
            })),
        landlords: landlordsData.map((l)=>({
                value: l.landlordData.code,
                label: l.landlordData.name
            })),
        vendors: vendorsData.map((v)=>({
                value: v.vendorData.code,
                label: v.vendorData.name
            })),
        agents: agentsData.map((a)=>({
                value: a.code,
                label: a.name
            })),
        customers: customersData.map((c)=>({
                value: c.customerData.code,
                label: c.customerData.name
            })),
        bankAccounts: bankAccountsData.map((b)=>({
                value: b.id,
                label: `${b.accountName} (${b.bankName})`
            })),
        users: usersData.map((u)=>({
                value: u.name,
                label: u.name
            })),
        receiptBooks: receiptBooksData,
        properties: propertiesData.map((p)=>({
                value: p.propertyData.code,
                label: p.propertyData.name
            })),
        units: unitsData.map((u)=>({
                value: u.unitCode,
                label: u.unitCode,
                propertyCode: u.propertyCode
            })),
        rooms: roomsData.map((r)=>({
                value: r.roomCode,
                label: r.roomCode,
                propertyCode: r.propertyCode,
                unitCode: r.unitCode
            })),
        products: productsData,
        maintenanceTickets: maintenanceTicketsData.filter((t)=>t.status !== 'Completed' && t.status !== 'Cancelled').map((t)=>({
                value: t.id,
                label: `${t.ticketNo} - ${t.issueType}`
            })),
        expenseAccounts: expenseAccountsData.filter((acc)=>acc.type === 'Expense' && !acc.isGroup).map((acc)=>({
                value: acc.code,
                label: `${acc.name} (${acc.code})`
            }))
    };
}
async function getExpenseAccounts() {
    const accounts = await readData(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/chart-of-accounts/accounts.json'));
    return accounts.filter((acc)=>acc.type === 'Expense' && !acc.isGroup).map((acc)=>({
            value: acc.code,
            label: `${acc.name} (${acc.code})`
        }));
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getLookups,
    getExpenseAccounts
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLookups, "000e606f4bfa091a26b7d7183ad8692c928e388562", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getExpenseAccounts, "00567bca6b13ba5f6bcb69520bc60b3e32154d40c3", null);
}),
"[project]/.next-internal/server/app/tenancy/tenants/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/src/app/lookups/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lookups$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lookups/actions.ts [app-rsc] (ecmascript)");
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
}),
"[project]/.next-internal/server/app/tenancy/tenants/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/src/app/lookups/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "000e606f4bfa091a26b7d7183ad8692c928e388562",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lookups$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLookups"],
    "002722ff09ce06e23752a07b30e008e26f6b5882d1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getNextSubscriptionInvoiceNumber"],
    "00484ec9aa59cb806ed9f49233b1daa442fefc4db8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCombinedAccessControlData"],
    "00831fee985f82fbb15a66fe64cff566d6c6f2867b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllTenants"],
    "008a29e84bd260b304f797613c7c39c01029f96950",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkLicenseStatus"],
    "00b6be478acfdf6b7794a7b34be547b3606ebfd51c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyProfile"],
    "00bf02fbdbf2069a58be66f4c215b7083c555f2e0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrencySettings"],
    "400726e3bdf468c8f88bbdb9aaa36ab5f223b4fb88",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteTenantData"],
    "403c44f137a3ca19d2679727ba3eaf54e85a4e3dd6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findTenantData"],
    "40c7c6f727d1176bc496bfd420805a4dd89df95ec4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelSubscription"],
    "40c9350172a0cc49767c134a7e5ed44affe0683337",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyProfile"],
    "60213da409c92fe467dbf995967e3039ca853bc297",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveSubscriptionInvoice"],
    "6036964a174b54674356664e3bee36f62e4123d1df",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveSubscriptionSettings"],
    "70d98d48fadc7e403939dd6b646483c6ffbf3102b8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveTenantData"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$tenancy$2f$tenants$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$src$2f$app$2f$lookups$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/tenancy/tenants/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/license.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/src/app/lookups/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$customer$2f$invoice$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/customer/invoice/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$lookups$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/lookups/actions.ts [app-rsc] (ecmascript)");
}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/utils.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-rsc] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-rsc] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground",
            destructive: "bg-destructive text-destructive-foreground",
            outline: "border border-input bg-background",
            secondary: "bg-secondary text-secondary-foreground",
            ghost: "",
            link: "text-primary underline-offset-4",
            "sidebar-accent": "bg-sidebar-accent text-sidebar-accent-foreground"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 48,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
Button.displayName = "Button";
;
}),
"[project]/src/app/tenancy/tenants/tenant-content.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "TenantContent",
    ()=>TenantContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TenantContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TenantContent() from the server but TenantContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/tenancy/tenants/tenant-content.tsx <module evaluation>", "TenantContent");
}),
"[project]/src/app/tenancy/tenants/tenant-content.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "TenantContent",
    ()=>TenantContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const TenantContent = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call TenantContent() from the server but TenantContent is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/tenancy/tenants/tenant-content.tsx", "TenantContent");
}),
"[project]/src/app/tenancy/tenants/tenant-content.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$tenant$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/tenancy/tenants/tenant-content.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$tenant$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/tenants/tenant-content.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$tenant$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/tenancy/tenants/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TenantsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-rsc] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/history.js [app-rsc] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/tenants/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$tenant$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/tenants/tenant-content.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function TenantsPage() {
    const tenants = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllTenants"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold font-headline",
                                children: "Tenants"
                            }, void 0, false, {
                                fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                lineNumber: 18,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground",
                                children: "Manage tenant profiles, properties, and contracts."
                            }, void 0, false, {
                                fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                lineNumber: 19,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                        lineNumber: 17,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                variant: "outline",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin/contract-continuity",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$history$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                            lineNumber: 24,
                                            columnNumber: 21
                                        }, this),
                                        " Movement History"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                    lineNumber: 23,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                lineNumber: 22,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/tenancy/tenants/add",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                            lineNumber: 29,
                                            columnNumber: 17
                                        }, this),
                                        " Add New Tenant"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                    lineNumber: 28,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                                lineNumber: 27,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                lineNumber: 16,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$tenants$2f$tenant$2d$content$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TenantContent"], {
                tenants: tenants
            }, void 0, false, {
                fileName: "[project]/src/app/tenancy/tenants/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tenancy/tenants/page.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/tenancy/tenants/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/tenancy/tenants/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d5326bb3._.js.map