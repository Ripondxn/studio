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
"[project]/src/app/tenancy/contract/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contractSchema",
    ()=>contractSchema,
    "paymentInstallmentSchema",
    ()=>paymentInstallmentSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const paymentInstallmentSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    installment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    dueDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number(),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'paid',
        'unpaid'
    ]),
    chequeNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    bankName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
const contractSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    contractNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Contract number is required."),
    contractDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Contract date is required."),
    property: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Unit code is required."),
    roomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tenantCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tenantName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Tenant name is required."),
    mobile: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    address: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    startDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Start date is required."),
    endDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "End date is required."),
    totalRent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, "Total rent must be a positive number."),
    paymentMode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'cash',
        'cheque',
        'bank-transfer'
    ]),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'New',
        'Renew',
        'Cancel'
    ]).optional(),
    renewalCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional().default(0),
    terminationDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    terminationReason: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    finalSettlementAmount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    rentBasedOn: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Monthly',
        'Daily'
    ]).optional(),
    paymentFrequency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Monthly',
        'Quarterly',
        'Half-Yearly',
        'Yearly',
        'Custom'
    ]).optional(),
    numberOfPayments: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    gracePeriod: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    paymentSchedule: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(paymentInstallmentSchema),
    terms: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tawtheeqRegistrationNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    tawtheeqStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Not Registered',
        'Under Process',
        'Registered'
    ]).optional(),
    tawtheeqRegistrationDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
}),
"[project]/src/app/finance/cheque-deposit/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chequeSchema",
    ()=>chequeSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const chequeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    chequeNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Cheque number is required."),
    chequeDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Cheque date is required."),
    amount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0.01, "Amount must be greater than 0."),
    bankName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Bank name is required."),
    status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'In Hand',
        'Deposited',
        'Cleared',
        'Bounced',
        'Cancelled',
        'Returned',
        'Returned with Cash'
    ]),
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Incoming',
        'Outgoing'
    ]),
    partyType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Tenant',
        'Landlord',
        'Customer',
        'Vendor',
        'Agent'
    ]),
    partyName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Party name is required."),
    property: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    roomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    contractNo: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    remarks: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    depositDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    clearanceDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    bankAccountId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
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
"[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001985af95bd59f2fe397be78e6c46957bf413f178":"getCheques","002c72322081bd96844e713b5cce3d64acde28bdae":"getSummary","0062ead3797ea17061497dc7d98e7c40c05ffee1cb":"getBankAccounts","007872f779c5c7a5e0d483fadb98bcdf2347de8e30":"getLookups","401b7e78972b424e8e47a64542e02a13021583ec26":"returnCheque","408cc8240d9380fb768b58fa4c21f7b2f6e90e4644":"deleteCheque","4097722b643ebcb6e67ec037f440b1523daddec4a9":"addCheque","787e70e69a011aeb9f85068a3917692d23511eadd9":"createDepositVoucher","7c7690dcb0bd227fd0bd479de6cef7719ef7ccd799":"updateChequeStatus"},"",""] */ __turbopack_context__.s([
    "addCheque",
    ()=>addCheque,
    "createDepositVoucher",
    ()=>createDepositVoucher,
    "deleteCheque",
    ()=>deleteCheque,
    "getBankAccounts",
    ()=>getBankAccounts,
    "getCheques",
    ()=>getCheques,
    "getLookups",
    ()=>getLookups,
    "getSummary",
    ()=>getSummary,
    "returnCheque",
    ()=>returnCheque,
    "updateChequeStatus",
    ()=>updateChequeStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/cheque-deposit/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfWeek$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfWeek.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfWeek$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/endOfWeek.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfMonth.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isWithinInterval$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isWithinInterval.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/parseISO.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/isBefore.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfToday$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/date-fns/startOfToday.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/date-fns/format.mjs [app-rsc] (ecmascript) <locals>");
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
const chequesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/cheque-deposit/cheques-data.json');
const tenantsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
const landlordsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/landlord/landlords-data.json');
const vendorsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/vendors-data.json');
const agentsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/vendors/agents/agents-data.json');
const customersFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/customer/customers-data.json');
const tenancyContractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const leaseContractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/lease/contract/contracts-data.json');
const bankAccountsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/banking/accounts-data.json');
const paymentsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/finance/payment/payments-data.json');
const unitsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/units/units-data.json');
const roomsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
async function readCheques() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(chequesFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(chequesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await writeCheques([]);
            return [];
        }
        throw error;
    }
}
async function writeCheques(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(chequesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function getBankAccounts() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(bankAccountsFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(bankAccountsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writeBankAccounts(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(bankAccountsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function readPayments() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(paymentsFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(paymentsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writePayments(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(paymentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function getCheques() {
    const cheques = await readCheques();
    return cheques.sort((a, b)=>new Date(b.chequeDate).getTime() - new Date(a.chequeDate).getTime());
}
async function addCheque(data) {
    const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["chequeSchema"].omit({
        id: true
    }).safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    try {
        const allCheques = await readCheques();
        const newCheque = {
            ...validation.data,
            id: `CHQ-${Date.now()}`
        };
        allCheques.push(newCheque);
        await writeCheques(allCheques);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/cheque-deposit');
        return {
            success: true,
            data: newCheque
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function updateChequeStatus(chequeId, status, date, user, bankAccountId) {
    try {
        const allCheques = await readCheques();
        const allPayments = await readPayments();
        const workflowSettings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkflowSettings"])();
        const chequeIndex = allCheques.findIndex((c)=>c.id === chequeId);
        if (chequeIndex === -1) {
            return {
                success: false,
                error: 'Cheque not found.'
            };
        }
        const originalCheque = allCheques[chequeIndex];
        const cashReturnRef = `CASH-FOR-${originalCheque.chequeNo}`;
        const hasExistingTransaction = allPayments.some((p)=>p.status !== 'Cancelled' && p.referenceNo && (p.referenceNo === originalCheque.chequeNo || p.referenceNo === cashReturnRef));
        if (hasExistingTransaction && (status === 'Cleared' || status === 'Returned with Cash')) {
            return {
                success: false,
                error: `A financial transaction for cheque #${originalCheque.chequeNo} already exists. Cannot create another.`
            };
        }
        const updatedCheque = {
            ...originalCheque,
            status,
            bankAccountId
        };
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'PENDING_ADMIN_APPROVAL' : 'POSTED';
        if (status === 'Deposited' && bankAccountId) {
            updatedCheque.depositDate = date;
        } else if (status === 'Cleared' && bankAccountId) {
            updatedCheque.clearanceDate = date;
        } else if (status === 'Bounced') {
            updatedCheque.clearanceDate = date;
        } else if (status === 'Returned with Cash') {
            updatedCheque.clearanceDate = date;
        }
        allCheques[chequeIndex] = updatedCheque;
        const basePayment = {
            type: originalCheque.type === 'Incoming' ? 'Receipt' : 'Payment',
            date: date,
            partyType: originalCheque.partyType,
            partyName: originalCheque.partyName,
            amount: originalCheque.amount,
            property: originalCheque.property,
            unitCode: originalCheque.unitCode,
            roomCode: originalCheque.roomCode,
            createdByUser: user.name,
            currentStatus: initialStatus,
            approvalHistory: [
                {
                    action: 'Created & Submitted',
                    actorId: user.email,
                    actorRole: user.role,
                    timestamp: new Date().toISOString(),
                    comments: `Status updated to ${status}`
                }
            ]
        };
        let newPayment = null;
        if (status === 'Returned with Cash') {
            newPayment = {
                ...basePayment,
                id: `PAY-${Date.now()}`,
                paymentMethod: 'Cash',
                bankAccountId: bankAccountId,
                paymentFrom: bankAccountId ? 'Bank' : 'Petty Cash',
                referenceNo: cashReturnRef,
                description: `Cash received for returned cheque #${originalCheque.chequeNo}`,
                status: 'Received'
            };
        } else if (status === 'Cleared') {
            if (!bankAccountId) {
                return {
                    success: false,
                    error: 'Bank account is required to clear a cheque.'
                };
            }
            newPayment = {
                ...basePayment,
                id: `PAY-${Date.now()}`,
                paymentMethod: 'Cheque',
                bankAccountId: bankAccountId,
                paymentFrom: 'Bank',
                referenceNo: originalCheque.chequeNo,
                remarks: `Cleared Cheque: ${originalCheque.chequeNo}`,
                status: originalCheque.type === 'Incoming' ? 'Received' : 'Paid'
            };
        }
        if (newPayment) {
            if (initialStatus === 'POSTED') {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"])(newPayment);
            }
            allPayments.push(newPayment);
            await writePayments(allPayments);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/workflow');
        }
        await writeCheques(allCheques);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/cheque-deposit');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/banking');
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
async function deleteCheque(chequeId) {
    try {
        const allCheques = await readCheques();
        const paymentToDelete = allCheques.find((p)=>p.id === chequeId);
        if (!paymentToDelete) {
            return {
                success: false,
                error: 'Cheque not found.'
            };
        }
        if (paymentToDelete.status === 'Cleared') {
            const allPayments = await readPayments();
            const linkedPaymentIndex = allPayments.findIndex((p)=>p.referenceNo === paymentToDelete.chequeNo);
            if (linkedPaymentIndex !== -1) {
                if (allPayments[linkedPaymentIndex].currentStatus === 'POSTED') {
                    return {
                        success: false,
                        error: 'Cannot delete a cheque linked to a posted payment. Please reverse the payment first.'
                    };
                }
                allPayments.splice(linkedPaymentIndex, 1);
                await writePayments(allPayments);
            }
        }
        const updatedCheques = allCheques.filter((c)=>c.id !== chequeId);
        await writeCheques(updatedCheques);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/cheque-deposit');
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
async function getLookups() {
    const tenants = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(tenantsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const landlords = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(landlordsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const vendors = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(vendorsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const agents = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(agentsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const customers = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(customersFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const tenancyContracts = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(tenancyContractsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const leaseContracts = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(leaseContractsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const bankAccounts = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(bankAccountsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const units = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(unitsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const rooms = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(roomsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
    const existingCheques = await readCheques();
    const existingChequeNumbers = new Set(existingCheques.map((c)=>c.chequeNo));
    const landlordMap = new Map();
    landlords.forEach((l)=>landlordMap.set(l.landlordData.code, l.landlordData.name));
    const filterPaymentSchedule = (schedule)=>{
        if (!schedule) return [];
        return schedule.filter((installment)=>!installment.chequeNo || !existingChequeNumbers.has(installment.chequeNo));
    };
    return {
        tenants: tenants.map((t)=>({
                value: t.tenantData.code,
                label: t.tenantData.name,
                contractNo: t.tenantData.contractNo
            })),
        landlords: landlords.map((l)=>({
                value: l.landlordData.code,
                label: l.landlordData.name
            })),
        vendors: vendors.map((v)=>({
                value: v.vendorData.code,
                label: v.vendorData.name
            })),
        agents: agents.map((a)=>({
                value: a.code,
                label: a.name
            })),
        customers: customers.map((c)=>({
                value: c.customerData.code,
                label: c.customerData.name
            })),
        tenancyContracts: tenancyContracts.map((c)=>({
                value: c.contractNo,
                label: c.contractNo,
                property: c.property,
                unitCode: c.unitCode,
                roomCode: c.roomCode,
                partyName: c.tenantName,
                paymentSchedule: filterPaymentSchedule(c.paymentSchedule)
            })),
        leaseContracts: leaseContracts.map((c)=>({
                value: c.contractNo,
                label: c.contractNo,
                property: c.property,
                partyName: c.landlordCode ? landlordMap.get(c.landlordCode) || c.landlordCode : 'Unknown',
                paymentSchedule: filterPaymentSchedule(c.paymentSchedule)
            })),
        bankAccounts: bankAccounts.map((b)=>({
                value: b.id,
                label: `${b.accountName} (${b.bankName})`
            })),
        units: units.map((u)=>({
                value: u.unitCode,
                label: u.unitCode,
                propertyCode: u.propertyCode
            })),
        rooms: rooms.map((r)=>({
                value: r.roomCode,
                label: r.roomCode,
                unitCode: r.unitCode,
                propertyCode: r.propertyCode
            }))
    };
}
async function getSummary() {
    const cheques = await readCheques();
    const now = new Date();
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfToday$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfToday"])();
    const startOfThisWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfWeek$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfWeek"])(now);
    const endOfThisWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$endOfWeek$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["endOfWeek"])(now);
    const startOfThisMonth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$startOfMonth$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["startOfMonth"])(now);
    const summary = {
        inHandCount: 0,
        inHandTotal: 0,
        dueThisWeekCount: 0,
        dueThisWeekTotal: 0,
        depositedCount: 0,
        depositedTotal: 0,
        clearedThisMonthCount: 0,
        clearedThisMonthTotal: 0,
        overdueCount: 0,
        overdueTotal: 0
    };
    for (const cheque of cheques){
        const chequeDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseISO"])(cheque.chequeDate);
        if (cheque.status === 'In Hand') {
            summary.inHandCount++;
            summary.inHandTotal += cheque.amount;
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isWithinInterval$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWithinInterval"])(chequeDate, {
                start: startOfThisWeek,
                end: endOfThisWeek
            })) {
                summary.dueThisWeekCount++;
                summary.dueThisWeekTotal += cheque.amount;
            }
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isBefore$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isBefore"])(chequeDate, today)) {
                summary.overdueCount++;
                summary.overdueTotal += cheque.amount;
            }
        } else if (cheque.status === 'Deposited') {
            summary.depositedCount++;
            summary.depositedTotal += cheque.amount;
        } else if (cheque.status === 'Cleared' && cheque.clearanceDate) {
            const clearanceDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$parseISO$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseISO"])(cheque.clearanceDate);
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$isWithinInterval$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isWithinInterval"])(clearanceDate, {
                start: startOfThisMonth,
                end: now
            })) {
                summary.clearedThisMonthCount++;
                summary.clearedThisMonthTotal += cheque.amount;
            }
        }
    }
    return summary;
}
async function createDepositVoucher(chequeIds, depositDate, bankAccountId, user) {
    try {
        const allCheques = await readCheques();
        const allPayments = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(paymentsFilePath, 'utf-8').then(JSON.parse).catch(()=>[]);
        const workflowSettings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkflowSettings"])();
        const selectedCheques = allCheques.filter((c)=>chequeIds.includes(c.id) && c.status === 'In Hand');
        if (selectedCheques.length === 0) {
            return {
                success: false,
                error: "No valid 'In Hand' cheques were selected."
            };
        }
        const totalAmount = selectedCheques.reduce((sum, c)=>sum + c.amount, 0);
        const chequeNumbers = selectedCheques.map((c)=>c.chequeNo).join(', ');
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'PENDING_ADMIN_APPROVAL' : 'POSTED';
        const newPayment = {
            id: `PAY-${Date.now()}`,
            type: 'Receipt',
            date: depositDate,
            partyType: 'Customer',
            partyName: `Cheque Deposit - ${depositDate}`,
            amount: totalAmount,
            paymentMethod: 'Cheque',
            paymentFrom: 'Bank',
            bankAccountId: bankAccountId,
            referenceNo: `DEP-${Date.now()}`,
            description: `Deposit of ${selectedCheques.length} cheques: ${chequeNumbers}`,
            remarks: `Cheque IDs: ${chequeIds.join(', ')}`,
            status: 'Received',
            createdByUser: user.name,
            currentStatus: initialStatus,
            approvalHistory: [
                {
                    action: 'Created & Submitted',
                    actorId: user.email,
                    actorRole: user.role,
                    timestamp: new Date().toISOString(),
                    comments: 'Cheque deposit voucher created.'
                }
            ]
        };
        if (initialStatus === 'POSTED') {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"])(newPayment);
        }
        allPayments.push(newPayment);
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(paymentsFilePath, JSON.stringify(allPayments, null, 2), 'utf-8');
        // Mark cheques as pending deposit
        const updatedCheques = allCheques.map((cheque)=>{
            if (chequeIds.includes(cheque.id)) {
                return {
                    ...cheque,
                    status: 'Deposited',
                    depositDate,
                    bankAccountId
                };
            }
            return cheque;
        });
        await writeCheques(updatedCheques);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/cheque-deposit');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/workflow');
        return {
            success: true,
            count: selectedCheques.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function returnCheque({ chequeIds, returnWithCash, paymentDetails }) {
    try {
        const allCheques = await readCheques();
        const allPayments = await readPayments();
        const workflowSettings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkflowSettings"])();
        let updatedCount = 0;
        const newStatus = returnWithCash ? 'Returned with Cash' : 'Returned';
        const initialStatus = workflowSettings.approvalProcessEnabled ? 'PENDING_ADMIN_APPROVAL' : 'POSTED';
        const selectedCheques = allCheques.filter((c)=>chequeIds.includes(c.id) && c.status === 'In Hand');
        if (selectedCheques.length === 0) {
            return {
                success: false,
                error: "No valid 'In Hand' cheques were selected to return."
            };
        }
        const updatedCheques = allCheques.map((cheque)=>{
            if (chequeIds.includes(cheque.id) && cheque.status === 'In Hand') {
                updatedCount++;
                return {
                    ...cheque,
                    status: newStatus
                };
            }
            return cheque;
        });
        if (returnWithCash && paymentDetails) {
            for (const cheque of selectedCheques){
                const newPayment = {
                    id: `PAY-${Date.now()}-${cheque.id}`,
                    type: 'Payment',
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), 'yyyy-MM-dd'),
                    partyType: cheque.partyType,
                    partyName: cheque.partyName,
                    amount: cheque.amount,
                    paymentMethod: 'Cash',
                    paymentFrom: paymentDetails.paymentFrom,
                    bankAccountId: paymentDetails.bankAccountId,
                    referenceNo: `RTRN-${cheque.chequeNo}`,
                    description: `Cash return for Cheque #${cheque.chequeNo}`,
                    remarks: `Cheque returned with cash settlement.`,
                    status: 'Paid',
                    createdByUser: paymentDetails.user.name,
                    currentStatus: initialStatus,
                    approvalHistory: [
                        {
                            action: 'Created & Submitted',
                            actorId: paymentDetails.user.email,
                            actorRole: paymentDetails.user.role,
                            timestamp: new Date().toISOString(),
                            comments: 'Cheque returned with cash payment.'
                        }
                    ]
                };
                if (initialStatus === 'POSTED') await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"])(newPayment);
                allPayments.push(newPayment);
            }
            await writePayments(allPayments);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/workflow');
        } else if (!returnWithCash && paymentDetails) {
            for (const cheque of selectedCheques){
                const newPayment = {
                    id: `PAY-${Date.now()}-${cheque.id}`,
                    type: 'Payment',
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(), 'yyyy-MM-dd'),
                    partyType: cheque.partyType,
                    partyName: cheque.partyName,
                    amount: cheque.amount,
                    paymentMethod: 'Cash',
                    paymentFrom: paymentDetails.paymentFrom,
                    bankAccountId: paymentDetails.bankAccountId,
                    referenceNo: `RTRN-${cheque.chequeNo}`,
                    description: `Reversal for returned Cheque #${cheque.chequeNo}`,
                    remarks: `Cheque returned.`,
                    status: 'Paid',
                    createdByUser: paymentDetails.user.name,
                    currentStatus: initialStatus,
                    approvalHistory: [
                        {
                            action: 'Created & Submitted',
                            actorId: paymentDetails.user.email,
                            actorRole: paymentDetails.user.role,
                            timestamp: new Date().toISOString(),
                            comments: 'Cheque returned.'
                        }
                    ]
                };
                if (initialStatus === 'POSTED') await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"])(newPayment);
                allPayments.push(newPayment);
            }
            await writePayments(allPayments);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/workflow');
        }
        await writeCheques(updatedCheques);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/cheque-deposit');
        return {
            success: true,
            count: updatedCount
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
    getBankAccounts,
    getCheques,
    addCheque,
    updateChequeStatus,
    deleteCheque,
    getLookups,
    getSummary,
    createDepositVoucher,
    returnCheque
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBankAccounts, "0062ead3797ea17061497dc7d98e7c40c05ffee1cb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCheques, "001985af95bd59f2fe397be78e6c46957bf413f178", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addCheque, "4097722b643ebcb6e67ec037f440b1523daddec4a9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateChequeStatus, "7c7690dcb0bd227fd0bd479de6cef7719ef7ccd799", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteCheque, "408cc8240d9380fb768b58fa4c21f7b2f6e90e4644", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLookups, "007872f779c5c7a5e0d483fadb98bcdf2347de8e30", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSummary, "002c72322081bd96844e713b5cce3d64acde28bdae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createDepositVoucher, "787e70e69a011aeb9f85068a3917692d23511eadd9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(returnCheque, "401b7e78972b424e8e47a64542e02a13021583ec26", null);
}),
"[project]/src/app/property/units/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unitSchema",
    ()=>unitSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const unitSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Unit code is required."),
    unitName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    propertyCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Property code is required."),
    unitType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Unit type is required."),
    annualRent: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().min(0, "Annual rent must be a positive number.").optional(),
    unitStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Active',
        'Inactive'
    ]),
    occupancyStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Vacant',
        'Occupied',
        'Partially Occupied'
    ]).optional()
});
}),
"[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"009d71925a0aa8baf76f29de076166c79061f05b3d":"getUnits","403cf2f178261df15005eaccdd185e49cb17f7a7c3":"deleteUnit","405dbe3934d0715511534a54c5c65d53900e0ab219":"importUnits","40691211f38c2fa8204710aa6695055a487566e9b4":"addUnit","40a5b1e77a7da64fe8593ea6641b277b69dd1945b2":"getUnitLookups","40d61b0d31509d22fea637b0fbd461b3c89f08ba48":"updateUnit"},"",""] */ __turbopack_context__.s([
    "addUnit",
    ()=>addUnit,
    "deleteUnit",
    ()=>deleteUnit,
    "getUnitLookups",
    ()=>getUnitLookups,
    "getUnits",
    ()=>getUnits,
    "importUnits",
    ()=>importUnits,
    "updateUnit",
    ()=>updateUnit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/units/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
const unitsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/units/units-data.json');
const contractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const roomsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const tenantsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
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
async function readUnits() {
    return await readData(unitsFilePath);
}
async function writeUnits(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(unitsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function getUnits() {
    const allUnits = await readUnits();
    const allContracts = await readData(contractsFilePath);
    const allRooms = await readData(roomsFilePath);
    const allTenants = await readData(tenantsFilePath);
    const activeContracts = allContracts.filter((c)=>c.status === 'New' || c.status === 'Renew');
    const activeSubscriptionTenants = allTenants.filter((t)=>t.tenantData.isSubscriptionActive);
    // 1. Consolidate all occupied spaces from both sources
    const fullyOccupiedUnitCodes = new Set();
    activeContracts.filter((c)=>!c.roomCode && c.unitCode).forEach((c)=>fullyOccupiedUnitCodes.add(c.unitCode));
    activeSubscriptionTenants.filter((t)=>t.tenantData.unitCode && !t.tenantData.roomCode).forEach((t)=>fullyOccupiedUnitCodes.add(t.tenantData.unitCode));
    const occupiedRoomCodes = new Set();
    activeContracts.filter((c)=>c.roomCode).forEach((c)=>occupiedRoomCodes.add(c.roomCode));
    activeSubscriptionTenants.filter((t)=>t.tenantData.roomCode).forEach((t)=>occupiedRoomCodes.add(t.tenantData.roomCode));
    // 2. Determine status for each unit based on the consolidated data
    return allUnits.map((unit)=>{
        let occupancyStatus = 'Vacant';
        // Case 1: The entire unit is rented under one agreement.
        if (fullyOccupiedUnitCodes.has(unit.unitCode)) {
            occupancyStatus = 'Occupied';
        } else {
            // Case 2: The unit is not rented as a whole, so check its rooms.
            const roomsInUnit = allRooms.filter((r)=>r.propertyCode === unit.propertyCode && r.unitCode === unit.unitCode);
            if (roomsInUnit.length > 0) {
                // It's a parent unit with rooms. Check how many are occupied.
                const occupiedRoomsCount = roomsInUnit.filter((r)=>occupiedRoomCodes.has(r.roomCode)).length;
                if (occupiedRoomsCount === 0) {
                    occupancyStatus = 'Vacant';
                } else if (occupiedRoomsCount < roomsInUnit.length) {
                    occupancyStatus = 'Partially Occupied';
                } else {
                    occupancyStatus = 'Occupied';
                }
            } else {
                // Case 3: It's a standalone unit with no rooms and no active contract/subscription.
                occupancyStatus = 'Vacant';
            }
        }
        return {
            ...unit,
            occupancyStatus
        };
    });
}
const addUnitFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unitSchema"].omit({
    id: true,
    occupancyStatus: true,
    unitName: true,
    annualRent: true
});
async function addUnit(data) {
    const validation = addUnitFormSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    try {
        const allUnits = await readUnits();
        const unitExists = allUnits.some((u)=>u.unitCode === data.unitCode && u.propertyCode === data.propertyCode);
        if (unitExists) {
            return {
                success: false,
                error: `Unit with code "${data.unitCode}" already exists in this property.`
            };
        }
        const newUnit = {
            ...validation.data,
            id: `UNIT-${Date.now()}`,
            floor: '',
            annualRent: 0
        };
        allUnits.push(newUnit);
        await writeUnits(allUnits);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/add`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/list`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/units/list`);
        if (data.propertyCode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${data.propertyCode}`);
        }
        return {
            success: true,
            data: newUnit
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
const updateUnitFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unitSchema"].partial();
async function updateUnit(data) {
    const validation = updateUnitFormSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    const { id, ...dataToUpdate } = validation.data;
    try {
        const allUnits = await readUnits();
        const unitIndex = allUnits.findIndex((u)=>u.id === id);
        if (unitIndex === -1) {
            return {
                success: false,
                error: 'Unit not found.'
            };
        }
        allUnits[unitIndex] = {
            ...allUnits[unitIndex],
            ...dataToUpdate
        };
        await writeUnits(allUnits);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/add`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/list`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/units/list`);
        if (allUnits[unitIndex].propertyCode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${allUnits[unitIndex].propertyCode}`);
        }
        return {
            success: true,
            data: allUnits[unitIndex]
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function deleteUnit(unitId) {
    if (!unitId) {
        return {
            success: false,
            error: "Unit ID is required."
        };
    }
    try {
        const allUnits = await readUnits();
        const unitToDelete = allUnits.find((u)=>u.id === unitId);
        if (!unitToDelete) {
            return {
                success: false,
                error: 'Unit not found.'
            };
        }
        const updatedUnits = allUnits.filter((u)=>u.id !== unitId);
        await writeUnits(updatedUnits);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/add`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/list`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/units/list`);
        if (unitToDelete.propertyCode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${unitToDelete.propertyCode}`);
        }
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
async function readProperties() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/properties/list/properties-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function getUnitLookups(propertyCode) {
    const properties = await readProperties();
    return {
        properties: properties.map((p)=>({
                value: p.propertyData.code,
                label: p.propertyData.name
            }))
    };
}
const importUnitSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["unitSchema"].omit({
    id: true,
    occupancyStatus: true
});
const importUnitsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(importUnitSchema);
async function importUnits(unitsData) {
    const validation = importUnitsSchema.safeParse(unitsData);
    if (!validation.success) {
        console.error("Import validation error:", validation.error.format());
        return {
            success: false,
            error: 'Invalid data format for one or more rows.'
        };
    }
    try {
        const allUnits = await readUnits();
        let updatedCount = 0;
        let addedCount = 0;
        let propertyCodeForRevalidation = '';
        validation.data.forEach((importedUnit)=>{
            if (importedUnit.propertyCode) {
                propertyCodeForRevalidation = importedUnit.propertyCode;
            }
            const existingUnitIndex = allUnits.findIndex((u)=>u.unitCode === importedUnit.unitCode && u.propertyCode === importedUnit.propertyCode);
            if (existingUnitIndex > -1) {
                // Update existing unit
                allUnits[existingUnitIndex] = {
                    ...allUnits[existingUnitIndex],
                    ...importedUnit
                };
                updatedCount++;
            } else {
                // Add new unit
                const newUnit = {
                    ...importedUnit,
                    id: `UNIT-${Date.now()}-${Math.random()}`.replace('.', '')
                };
                allUnits.push(newUnit);
                addedCount++;
            }
        });
        await writeUnits(allUnits);
        if (propertyCodeForRevalidation) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${propertyCodeForRevalidation}`);
        }
        return {
            success: true,
            added: addedCount,
            updated: updatedCount
        };
    } catch (error) {
        console.error("Error importing units:", error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred during import.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUnits,
    addUnit,
    updateUnit,
    deleteUnit,
    getUnitLookups,
    importUnits
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUnits, "009d71925a0aa8baf76f29de076166c79061f05b3d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addUnit, "40691211f38c2fa8204710aa6695055a487566e9b4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUnit, "40d61b0d31509d22fea637b0fbd461b3c89f08ba48", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteUnit, "403cf2f178261df15005eaccdd185e49cb17f7a7c3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUnitLookups, "40a5b1e77a7da64fe8593ea6641b277b69dd1945b2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(importUnits, "405dbe3934d0715511534a54c5c65d53900e0ab219", null);
}),
"[project]/src/app/property/rooms/schema.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "roomSchema",
    ()=>roomSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
;
const roomSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    roomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Room code is required."),
    propertyCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Property code is required."),
    unitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    roomName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    roomType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    rentAmount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    rentFrequency: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Monthly',
        'Yearly'
    ]).optional(),
    occupancyStatus: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        'Vacant',
        'Occupied'
    ]).optional()
});
}),
"[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00b1ebe317367791d5f70b764d08349bd9c02ef33c":"getRooms","4023c3eb56adbb239c5560193b399ee2492bd900f0":"addRoom","4044e14ab75ff70890912bfc2d3d4fafbbd833f1ca":"importRooms","4058c67745e0064e1678711947654824be147cafc2":"getRoomLookups","406c1afcbb6346d0d80153380e54e1434ff763cc4c":"getRoomsForProperty","407c1163a0fb9226bb8e7d1e6e99f16cfc7c548e5c":"deleteRoom","40c720ba235f2c41c6f29626d6f17db1a6984f48b2":"updateRoom"},"",""] */ __turbopack_context__.s([
    "addRoom",
    ()=>addRoom,
    "deleteRoom",
    ()=>deleteRoom,
    "getRoomLookups",
    ()=>getRoomLookups,
    "getRooms",
    ()=>getRooms,
    "getRoomsForProperty",
    ()=>getRoomsForProperty,
    "importRooms",
    ()=>importRooms,
    "updateRoom",
    ()=>updateRoom
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
const roomsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/rooms/rooms-data.json');
const contractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const tenantsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
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
async function readRooms() {
    return await readData(roomsFilePath);
}
async function writeRooms(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(roomsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function getRooms() {
    const allRooms = await readRooms();
    const contractsData = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(contractsFilePath, 'utf-8').catch(()=>'[]');
    const allContracts = JSON.parse(contractsData);
    const allTenants = await readData(tenantsFilePath);
    const activeContracts = allContracts.filter((c)=>c.status === 'New' || c.status === 'Renew');
    const occupiedRoomCodesFromContracts = new Set(activeContracts.filter((c)=>c.roomCode).map((c)=>c.roomCode));
    const subscribedRoomCodes = new Set(allTenants.filter((t)=>t.tenantData.isSubscriptionActive && t.tenantData.roomCode).map((t)=>t.tenantData.roomCode));
    const allOccupiedRoomCodes = new Set([
        ...occupiedRoomCodesFromContracts,
        ...subscribedRoomCodes
    ]);
    return allRooms.map((room)=>({
            ...room,
            occupancyStatus: allOccupiedRoomCodes.has(room.roomCode) ? 'Occupied' : 'Vacant'
        }));
}
async function getRoomsForProperty(propertyCode) {
    try {
        const allRooms = await getRooms();
        const propertyRooms = allRooms.filter((r)=>r.propertyCode === propertyCode);
        return {
            success: true,
            data: propertyRooms
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
const addRoomFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roomSchema"].omit({
    id: true,
    occupancyStatus: true
});
async function addRoom(data) {
    const validation = addRoomFormSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    try {
        const allRooms = await readRooms();
        const roomExists = allRooms.some((r)=>r.roomCode === data.roomCode && r.propertyCode === data.propertyCode);
        if (roomExists) {
            return {
                success: false,
                error: `Room with code "${data.roomCode}" already exists in this property.`
            };
        }
        const newRoom = {
            ...validation.data,
            id: `ROOM-${Date.now()}`
        };
        allRooms.push(newRoom);
        await writeRooms(allRooms);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/add`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/list`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/rooms/list`);
        if (data.propertyCode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${data.propertyCode}`);
        }
        return {
            success: true,
            data: newRoom
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
const updateRoomFormSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roomSchema"].partial();
async function updateRoom(data) {
    const validation = updateRoomFormSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data format.'
        };
    }
    const { id, ...dataToUpdate } = validation.data;
    try {
        const allRooms = await readRooms();
        const roomIndex = allRooms.findIndex((r)=>r.id === id);
        if (roomIndex === -1) {
            return {
                success: false,
                error: 'Room not found.'
            };
        }
        allRooms[roomIndex] = {
            ...allRooms[roomIndex],
            ...dataToUpdate
        };
        await writeRooms(allRooms);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/add`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/list`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/rooms/list`);
        if (allRooms[roomIndex].propertyCode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${allRooms[roomIndex].propertyCode}`);
        }
        return {
            success: true,
            data: allRooms[roomIndex]
        };
    } catch (error) {
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function deleteRoom(roomId) {
    if (!roomId) {
        return {
            success: false,
            error: "Room ID is required."
        };
    }
    try {
        const allRooms = await readRooms();
        const roomToDelete = allRooms.find((r)=>r.id === roomId);
        if (!roomToDelete) {
            return {
                success: false,
                error: 'Room not found.'
            };
        }
        const updatedRooms = allRooms.filter((r)=>r.id !== roomId);
        await writeRooms(updatedRooms);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/add`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties/list`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/rooms/list`);
        if (roomToDelete.propertyCode) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${roomToDelete.propertyCode}`);
        }
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
async function readUnits() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/units/units-data.json'), 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function getRoomLookups(propertyCode) {
    const units = await readUnits();
    return {
        units: units.filter((u)=>u.propertyCode === propertyCode).map((u)=>({
                value: u.unitCode,
                label: u.unitCode
            }))
    };
}
const importRoomSchema = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roomSchema"].omit({
    id: true,
    occupancyStatus: true
});
const importRoomsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(importRoomSchema);
async function importRooms(roomsData) {
    const validation = importRoomsSchema.safeParse(roomsData);
    if (!validation.success) {
        console.error("Import validation error:", validation.error.format());
        return {
            success: false,
            error: 'Invalid data format for one or more rows.'
        };
    }
    try {
        const allRooms = await readRooms();
        let updatedCount = 0;
        let addedCount = 0;
        let propertyCodeForRevalidation = '';
        validation.data.forEach((importedRoom)=>{
            if (importedRoom.propertyCode) {
                propertyCodeForRevalidation = importedRoom.propertyCode;
            }
            const existingRoomIndex = allRooms.findIndex((r)=>r.roomCode === importedRoom.roomCode && r.propertyCode === importedRoom.propertyCode);
            if (existingRoomIndex > -1) {
                // Update existing room
                allRooms[existingRoomIndex] = {
                    ...allRooms[existingRoomIndex],
                    ...importedRoom
                };
                updatedCount++;
            } else {
                // Add new room
                const newRoom = {
                    ...importedRoom,
                    id: `ROOM-${Date.now()}-${Math.random()}`.replace('.', '')
                };
                allRooms.push(newRoom);
                addedCount++;
            }
        });
        await writeRooms(allRooms);
        if (propertyCodeForRevalidation) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/property/properties?code=${propertyCodeForRevalidation}`);
        }
        return {
            success: true,
            added: addedCount,
            updated: updatedCount
        };
    } catch (error) {
        console.error("Error importing rooms:", error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred during import.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getRooms,
    getRoomsForProperty,
    addRoom,
    updateRoom,
    deleteRoom,
    getRoomLookups,
    importRooms
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRooms, "00b1ebe317367791d5f70b764d08349bd9c02ef33c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRoomsForProperty, "406c1afcbb6346d0d80153380e54e1434ff763cc4c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addRoom, "4023c3eb56adbb239c5560193b399ee2492bd900f0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateRoom, "40c720ba235f2c41c6f29626d6f17db1a6984f48b2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteRoom, "407c1163a0fb9226bb8e7d1e6e99f16cfc7c548e5c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRoomLookups, "4058c67745e0064e1678711947654824be147cafc2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(importRooms, "4044e14ab75ff70890912bfc2d3d4fafbbd833f1ca", null);
}),
"[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00de1d3a0c22cf56737ed21e125e399021367eac00":"getAllContracts","00f88d1e90fb6c3415b45aee1770533def22ee037a":"getContractLookups","40075856c1c2d8110aa7a4cd4e8da4ec6abe71b17b":"deleteContract","40626a77dbc21e4658f06f2792a09356cb122eb779":"findContract","407c09006f63d1bb2a514488ac13bf6b46f094d528":"getLatestContractForTenant","4092f46dc27d4da73e017e103ff56fa73bcebeac3b":"getRoomDetails","40cfa4557364dc13775cb4e0c40a69587c11a8093c":"moveTenant","40d52f21d76de530da6ade7100f9ea79263e09668f":"getUnitsForProperty","40fc6cefcb41c1ad5539e2c7450165448210af0532":"getUnitDetails","603085fc5f3519957092a1e3a5a517954f29516b70":"getRoomsForUnit","60d43db9f0f1b365784c0288cbb92f01d58fe0af94":"saveContractData","70004aebdd3fe6a41b2aa3757bb1e2b284a9ebc6a5":"getTenantForProperty"},"",""] */ __turbopack_context__.s([
    "deleteContract",
    ()=>deleteContract,
    "findContract",
    ()=>findContract,
    "getAllContracts",
    ()=>getAllContracts,
    "getContractLookups",
    ()=>getContractLookups,
    "getLatestContractForTenant",
    ()=>getLatestContractForTenant,
    "getRoomDetails",
    ()=>getRoomDetails,
    "getRoomsForUnit",
    ()=>getRoomsForUnit,
    "getTenantForProperty",
    ()=>getTenantForProperty,
    "getUnitDetails",
    ()=>getUnitDetails,
    "getUnitsForProperty",
    ()=>getUnitsForProperty,
    "moveTenant",
    ()=>moveTenant,
    "saveContractData",
    ()=>saveContractData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v3/external.js [app-rsc] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contract/schema.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)");
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
const contractsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/contract/contracts-data.json');
const propertiesFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/properties/list/properties-data.json');
const tenantsFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/tenancy/tenants/tenants-data.json');
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
async function readContracts() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].access(contractsFilePath);
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(contractsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function writeContracts(data) {
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(contractsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}
async function getAllContracts() {
    return await readContracts();
}
async function createChequesFromContract(contract) {
    if (contract.paymentMode !== 'cheque' || !contract.paymentSchedule) {
        return;
    }
    for (const installment of contract.paymentSchedule){
        if (installment.chequeNo) {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addCheque"])({
                chequeNo: installment.chequeNo,
                chequeDate: installment.dueDate,
                amount: installment.amount,
                bankName: installment.bankName || '',
                status: 'In Hand',
                type: 'Incoming',
                partyType: 'Tenant',
                partyName: contract.tenantCode,
                property: contract.property,
                unitCode: contract.unitCode,
                roomCode: contract.roomCode,
                contractNo: contract.contractNo,
                remarks: `Installment ${installment.installment}`
            });
        }
    }
}
async function saveContractData(data, isNewRecord) {
    const { isAutoContractNo, ...contractData } = data;
    const validation = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$schema$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["contractSchema"].omit({
        id: true
    }).safeParse(contractData);
    if (!validation.success) {
        const errors = validation.error.errors.map((e)=>e.message).join(', ');
        return {
            success: false,
            error: errors
        };
    }
    try {
        const allContracts = await readContracts();
        const validatedData = validation.data;
        let savedContract;
        if (isNewRecord) {
            let newContractNo = validatedData.contractNo;
            if (isAutoContractNo || !newContractNo) {
                newContractNo = await getNextContractNumber();
            } else {
                const contractExists = allContracts.some((c)=>c.contractNo === newContractNo);
                if (contractExists) {
                    return {
                        success: false,
                        error: `A contract with number "${newContractNo}" already exists.`
                    };
                }
            }
            const newContract = {
                ...validatedData,
                contractNo: newContractNo,
                id: `CON-${Date.now()}`
            };
            allContracts.push(newContract);
            savedContract = newContract;
        } else {
            const index = allContracts.findIndex((c)=>c.id === data.id);
            if (index !== -1) {
                allContracts[index] = {
                    ...allContracts[index],
                    ...validatedData
                };
                savedContract = allContracts[index];
            } else {
                return {
                    success: false,
                    error: `Contract with ID "${data.id}" not found.`
                };
            }
        }
        await writeContracts(allContracts);
        await createChequesFromContract(savedContract);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/contracts');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/finance/cheque-deposit');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/tenancy/contract?id=${data.id}`);
        return {
            success: true,
            data: savedContract
        };
    } catch (error) {
        console.error('Failed to save contract:', error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function getNextContractNumber() {
    const allContracts = await readContracts();
    let maxNum = 0;
    allContracts.forEach((c)=>{
        const match = c.contractNo.match(/^TC-(\d+)$/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxNum) {
                maxNum = num;
            }
        }
    });
    return `TC-${(maxNum + 1).toString().padStart(4, '0')}`;
}
async function findContract(query) {
    try {
        const allContracts = await readContracts();
        let foundContract;
        if (query.contractId === 'new') {
            const newContractNo = await getNextContractNumber();
            return {
                success: true,
                data: {
                    ...initialContractState,
                    contractNo: newContractNo
                }
            };
        }
        if (query.contractId) {
            foundContract = allContracts.find((c)=>c.id === query.contractId);
        } else if (query.unitCode) {
            foundContract = allContracts.find((c)=>c.unitCode === query.unitCode);
        } else if (query.tenantName) {
            foundContract = allContracts.find((c)=>c.tenantName.toLowerCase() === query.tenantName.toLowerCase());
        }
        if (foundContract) {
            return {
                success: true,
                data: foundContract
            };
        } else {
            return {
                success: false,
                error: 'Contract not found.'
            };
        }
    } catch (error) {
        console.error('Failed to find contract:', error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred'
        };
    }
}
const initialContractState = {
    id: '',
    contractNo: '',
    contractDate: '',
    unitCode: '',
    roomCode: '',
    property: '',
    tenantCode: '',
    tenantName: '',
    mobile: '',
    email: '',
    address: '',
    startDate: '',
    endDate: '',
    totalRent: 0,
    paymentMode: 'cash',
    status: 'New',
    terminationDate: '',
    rentBasedOn: 'Monthly',
    paymentFrequency: 'Monthly',
    numberOfPayments: 1,
    gracePeriod: 0,
    paymentSchedule: [],
    terms: '',
    tawtheeqRegistrationNo: '',
    tawtheeqStatus: 'Not Registered',
    tawtheeqRegistrationDate: ''
};
async function deleteContract(contractId) {
    try {
        const allContracts = await readContracts();
        const updatedContracts = allContracts.filter((c)=>c.id !== contractId);
        if (allContracts.length === updatedContracts.length) {
            return {
                success: false,
                error: 'Contract not found.'
            };
        }
        await writeContracts(updatedContracts);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/contracts');
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to delete contract:', error);
        return {
            success: false,
            error: error.message || 'An unknown error occurred.'
        };
    }
}
async function readProperties() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(propertiesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function readTenants() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(tenantsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}
async function getContractLookups() {
    const properties = await readProperties();
    const tenants = await readTenants();
    const units = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnits"])();
    const rooms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"])();
    return {
        properties: properties.map((p)=>({
                value: (p.propertyData || p).code,
                label: (p.propertyData || p).name
            })),
        tenants: tenants.map((t)=>({
                value: t.tenantData.code,
                label: t.tenantData.name,
                ...t.tenantData
            })),
        units: units.map((u)=>({
                ...u,
                value: u.unitCode,
                label: u.unitCode
            })),
        rooms: rooms.map((r)=>({
                ...r,
                value: r.roomCode,
                label: r.roomCode
            }))
    };
}
async function getUnitsForProperty(propertyCode) {
    const allUnits = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnits"])();
    return allUnits.filter((u)=>u.propertyCode === propertyCode && u.occupancyStatus !== 'Occupied').map((u)=>({
            ...u,
            value: u.unitCode,
            label: u.unitCode
        }));
}
async function getRoomsForUnit(propertyCode, unitCode) {
    const allRooms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"])();
    return allRooms.filter((r)=>r.propertyCode === propertyCode && r.unitCode === unitCode && r.occupancyStatus === 'Vacant').map((r)=>({
            ...r,
            value: r.roomCode,
            label: r.roomCode
        }));
}
async function getUnitDetails(unitCode) {
    const allUnits = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnits"])();
    const unit = allUnits.find((u)=>u.unitCode === unitCode);
    if (!unit) {
        return {
            success: false,
            error: 'Unit not found'
        };
    }
    return {
        success: true,
        data: {
            totalRent: unit.annualRent
        }
    };
}
async function getRoomDetails(roomCode) {
    const allRooms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"])();
    const room = allRooms.find((r)=>r.roomCode === roomCode);
    if (!room) {
        return {
            success: false,
            error: 'Room not found'
        };
    }
    return {
        success: true,
        data: room
    };
}
async function getTenantForProperty(propertyCode, unitCode, roomCode) {
    try {
        const contracts = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(contractsFilePath, 'utf-8').then(JSON.parse);
        const activeContract = contracts.find((c)=>c.property === propertyCode && c.unitCode === unitCode && (roomCode ? c.roomCode === roomCode : true) && // Match room if provided
            (c.status === 'New' || c.status === 'Renew'));
        if (activeContract) {
            return {
                success: true,
                tenantName: activeContract.tenantName
            };
        }
        return {
            success: false,
            error: 'No active tenant found for this location.'
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
const moveTenantSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    contractId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    newPropertyCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    newUnitCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    newRoomCode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    moveDate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
});
async function moveTenant(data) {
    const validation = moveTenantSchema.safeParse(data);
    if (!validation.success) {
        return {
            success: false,
            error: 'Invalid data provided.'
        };
    }
    const { contractId, newPropertyCode, newUnitCode, newRoomCode, moveDate } = validation.data;
    try {
        const allContracts = await readContracts();
        const contractIndex = allContracts.findIndex((c)=>c.id === contractId);
        if (contractIndex === -1) {
            return {
                success: false,
                error: 'Active contract not found for this tenant.'
            };
        }
        const contract = allContracts[contractIndex];
        const oldLocation = `${contract.property}/${contract.unitCode}${contract.roomCode ? '/' + contract.roomCode : ''}`;
        const newLocation = `${newPropertyCode}/${newUnitCode}${newRoomCode ? '/' + newRoomCode : ''}`;
        contract.property = newPropertyCode;
        contract.unitCode = newUnitCode;
        contract.roomCode = newRoomCode;
        contract.paymentSchedule.push({
            installment: 0,
            dueDate: moveDate,
            amount: 0,
            status: 'paid',
            chequeNo: 'MOVEMENT',
            bankName: `Moved from ${oldLocation} to ${newLocation}`
        });
        allContracts[contractIndex] = contract;
        await writeContracts(allContracts);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/tenancy/tenants/add');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/property/properties');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/property/units/vacant');
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
async function getLatestContractForTenant(tenantCode) {
    if (!tenantCode) {
        return {
            success: false,
            error: "Tenant code is required."
        };
    }
    try {
        const allContracts = await readContracts();
        const tenantContracts = allContracts.filter((c)=>c.tenantCode === tenantCode);
        if (tenantContracts.length === 0) {
            return {
                success: false,
                error: 'No contracts found for this tenant.'
            };
        }
        tenantContracts.sort((a, b)=>new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
        return {
            success: true,
            data: tenantContracts[0]
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
    getAllContracts,
    saveContractData,
    findContract,
    deleteContract,
    getContractLookups,
    getUnitsForProperty,
    getRoomsForUnit,
    getUnitDetails,
    getRoomDetails,
    getTenantForProperty,
    moveTenant,
    getLatestContractForTenant
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllContracts, "00de1d3a0c22cf56737ed21e125e399021367eac00", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveContractData, "60d43db9f0f1b365784c0288cbb92f01d58fe0af94", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(findContract, "40626a77dbc21e4658f06f2792a09356cb122eb779", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteContract, "40075856c1c2d8110aa7a4cd4e8da4ec6abe71b17b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getContractLookups, "00f88d1e90fb6c3415b45aee1770533def22ee037a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUnitsForProperty, "40d52f21d76de530da6ade7100f9ea79263e09668f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRoomsForUnit, "603085fc5f3519957092a1e3a5a517954f29516b70", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUnitDetails, "40fc6cefcb41c1ad5539e2c7450165448210af0532", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRoomDetails, "4092f46dc27d4da73e017e103ff56fa73bcebeac3b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getTenantForProperty, "70004aebdd3fe6a41b2aa3757bb1e2b284a9ebc6a5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(moveTenant, "40cfa4557364dc13775cb4e0c40a69587c11a8093c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLatestContractForTenant, "407c09006f63d1bb2a514488ac13bf6b46f094d528", null);
}),
"[project]/.next-internal/server/app/tenancy/contracts/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)");
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
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/tenancy/contracts/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE5 => \"[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE6 => \"[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE7 => \"[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE8 => \"[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE9 => \"[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "001985af95bd59f2fe397be78e6c46957bf413f178",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCheques"],
    "0026cbe30d3946ca5d202d147dfd3dd10c963bca8b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getWorkflowSettings"],
    "002c72322081bd96844e713b5cce3d64acde28bdae",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSummary"],
    "00484ec9aa59cb806ed9f49233b1daa442fefc4db8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCombinedAccessControlData"],
    "0062ead3797ea17061497dc7d98e7c40c05ffee1cb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBankAccounts"],
    "00698a84b77221a25f617c69b2c492b0adfcf77554",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runInvoiceGeneration"],
    "007872f779c5c7a5e0d483fadb98bcdf2347de8e30",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLookups"],
    "008a29e84bd260b304f797613c7c39c01029f96950",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkLicenseStatus"],
    "009d71925a0aa8baf76f29de076166c79061f05b3d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnits"],
    "00b1ebe317367791d5f70b764d08349bd9c02ef33c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"],
    "00b6be478acfdf6b7794a7b34be547b3606ebfd51c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyProfile"],
    "00bf02fbdbf2069a58be66f4c215b7083c555f2e0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrencySettings"],
    "00de1d3a0c22cf56737ed21e125e399021367eac00",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllContracts"],
    "00f88d1e90fb6c3415b45aee1770533def22ee037a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getContractLookups"],
    "40075856c1c2d8110aa7a4cd4e8da4ec6abe71b17b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteContract"],
    "401b7e78972b424e8e47a64542e02a13021583ec26",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["returnCheque"],
    "4023c3eb56adbb239c5560193b399ee2492bd900f0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addRoom"],
    "403cf2f178261df15005eaccdd185e49cb17f7a7c3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteUnit"],
    "4044e14ab75ff70890912bfc2d3d4fafbbd833f1ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importRooms"],
    "4047f1be9f4ec23f6c3699a601835a82156d8eb5e4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitTransaction"],
    "4058c67745e0064e1678711947654824be147cafc2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRoomLookups"],
    "405dbe3934d0715511534a54c5c65d53900e0ab219",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importUnits"],
    "405fd00783ca2c0909e1bc9ea8170dd1dcc1cb4c5f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveWorkflowSettings"],
    "40626a77dbc21e4658f06f2792a09356cb122eb779",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["findContract"],
    "40691211f38c2fa8204710aa6695055a487566e9b4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addUnit"],
    "406c1afcbb6346d0d80153380e54e1434ff763cc4c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRoomsForProperty"],
    "407c09006f63d1bb2a514488ac13bf6b46f094d528",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLatestContractForTenant"],
    "407c1163a0fb9226bb8e7d1e6e99f16cfc7c548e5c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRoom"],
    "408b6ef6fc8d09194066701fa2edd4ea8f9305defb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveTransaction"],
    "408cc8240d9380fb768b58fa4c21f7b2f6e90e4644",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteCheque"],
    "4092f46dc27d4da73e017e103ff56fa73bcebeac3b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRoomDetails"],
    "4097722b643ebcb6e67ec037f440b1523daddec4a9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addCheque"],
    "40979727ef980c7aba95e802e0d29daccf4b768563",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addCommentToTransaction"],
    "40a5b1e77a7da64fe8593ea6641b277b69dd1945b2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnitLookups"],
    "40a66ec237e98904229939f469d1841c1eb84346ba",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["reverseFinancialImpact"],
    "40bf8da82d2e5d4234a62b8c165efb090a74e54a42",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyFinancialImpact"],
    "40c720ba235f2c41c6f29626d6f17db1a6984f48b2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRoom"],
    "40c9350172a0cc49767c134a7e5ed44affe0683337",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyProfile"],
    "40c95dd5b507e2eb7d80a18ecfb45b4f1808addef8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectTransaction"],
    "40cfa4557364dc13775cb4e0c40a69587c11a8093c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["moveTenant"],
    "40d52f21d76de530da6ade7100f9ea79263e09668f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnitsForProperty"],
    "40d61b0d31509d22fea637b0fbd461b3c89f08ba48",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUnit"],
    "40fc6cefcb41c1ad5539e2c7450165448210af0532",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUnitDetails"],
    "603085fc5f3519957092a1e3a5a517954f29516b70",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRoomsForUnit"],
    "60d43db9f0f1b365784c0288cbb92f01d58fe0af94",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveContractData"],
    "70004aebdd3fe6a41b2aa3757bb1e2b284a9ebc6a5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getTenantForProperty"],
    "787e70e69a011aeb9f85068a3917692d23511eadd9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createDepositVoucher"],
    "7c7690dcb0bd227fd0bd479de6cef7719ef7ccd799",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateChequeStatus"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$tenancy$2f$contracts$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE5__$3d3e$__$225b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE6__$3d3e$__$225b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE7__$3d3e$__$225b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE8__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE9__$3d3e$__$225b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/tenancy/contracts/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/license.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE5 => "[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE6 => "[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE7 => "[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE8 => "[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE9 => "[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$finance$2f$cheque$2d$deposit$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/finance/cheque-deposit/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$units$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/units/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$workflow$2d$settings$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/workflow-settings/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$workflow$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/workflow/actions.ts [app-rsc] (ecmascript)");
}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/tenancy/contracts/columns.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "columns",
    ()=>columns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call columns() from the server but columns is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/tenancy/contracts/columns.tsx <module evaluation>", "columns");
}),
"[project]/src/app/tenancy/contracts/columns.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "columns",
    ()=>columns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const columns = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call columns() from the server but columns is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/tenancy/contracts/columns.tsx", "columns");
}),
"[project]/src/app/tenancy/contracts/columns.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/tenancy/contracts/columns.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contracts/columns.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/tenancy/contracts/data-table.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DataTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DataTable() from the server but DataTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/tenancy/contracts/data-table.tsx <module evaluation>", "DataTable");
}),
"[project]/src/app/tenancy/contracts/data-table.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "DataTable",
    ()=>DataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const DataTable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call DataTable() from the server but DataTable is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/tenancy/contracts/data-table.tsx", "DataTable");
}),
"[project]/src/app/tenancy/contracts/data-table.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/tenancy/contracts/data-table.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contracts/data-table.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
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
"[project]/src/app/tenancy/contracts/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContractsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contracts/columns.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contracts/data-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-rsc] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/tenancy/contract/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
;
;
;
;
;
async function getProperties() {
    try {
        const data = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'src/app/property/properties/list/properties-data.json'));
        return JSON.parse(data.toString());
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
async function ContractsPage() {
    const contracts = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contract$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllContracts"])();
    const properties = await getProperties();
    const propertyLookups = properties.map((p)=>({
            value: (p.propertyData || p).code,
            label: (p.propertyData || p).name
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold font-headline",
                        children: "Tenancy Contracts"
                    }, void 0, false, {
                        fileName: "[project]/src/app/tenancy/contracts/page.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                            href: "/tenancy/contract",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/tenancy/contracts/page.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, this),
                                " Add New Contract"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/tenancy/contracts/page.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/tenancy/contracts/page.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/tenancy/contracts/page.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                columns: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$tenancy$2f$contracts$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["columns"],
                data: contracts,
                properties: propertyLookups
            }, void 0, false, {
                fileName: "[project]/src/app/tenancy/contracts/page.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/tenancy/contracts/page.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/tenancy/contracts/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/tenancy/contracts/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e97af1c8._.js.map