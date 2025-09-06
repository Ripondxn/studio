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
"[project]/.next-internal/server/app/property/rooms/list/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)");
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
"[project]/.next-internal/server/app/property/rooms/list/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/lib/license.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE4 => \"[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "00484ec9aa59cb806ed9f49233b1daa442fefc4db8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCombinedAccessControlData"],
    "008a29e84bd260b304f797613c7c39c01029f96950",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkLicenseStatus"],
    "00b1ebe317367791d5f70b764d08349bd9c02ef33c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"],
    "00b6be478acfdf6b7794a7b34be547b3606ebfd51c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyProfile"],
    "00bf02fbdbf2069a58be66f4c215b7083c555f2e0f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrencySettings"],
    "4023c3eb56adbb239c5560193b399ee2492bd900f0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addRoom"],
    "4044e14ab75ff70890912bfc2d3d4fafbbd833f1ca",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["importRooms"],
    "4058c67745e0064e1678711947654824be147cafc2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRoomLookups"],
    "406c1afcbb6346d0d80153380e54e1434ff763cc4c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRoomsForProperty"],
    "407c1163a0fb9226bb8e7d1e6e99f16cfc7c548e5c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRoom"],
    "40c720ba235f2c41c6f29626d6f17db1a6984f48b2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRoom"],
    "40c9350172a0cc49767c134a7e5ed44affe0683337",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyProfile"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$property$2f$rooms$2f$list$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE4__$3d3e$__$225b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/property/rooms/list/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/lib/license.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE4 => "[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$company$2d$profile$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/company-profile/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$license$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/license.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$currency$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/currency/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admin$2f$access$2d$control$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/admin/access-control/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)");
}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/property/rooms/columns.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
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
}, "[project]/src/app/property/rooms/columns.tsx <module evaluation>", "columns");
}),
"[project]/src/app/property/rooms/columns.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
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
}, "[project]/src/app/property/rooms/columns.tsx", "columns");
}),
"[project]/src/app/property/rooms/columns.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/property/rooms/columns.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/columns.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/property/rooms/data-table.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
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
}, "[project]/src/app/property/rooms/data-table.tsx <module evaluation>", "DataTable");
}),
"[project]/src/app/property/rooms/data-table.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
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
}, "[project]/src/app/property/rooms/data-table.tsx", "DataTable");
}),
"[project]/src/app/property/rooms/data-table.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/property/rooms/data-table.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/data-table.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/property/rooms/list/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RoomsListPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/columns.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/property/rooms/data-table.tsx [app-rsc] (ecmascript)");
;
;
;
;
async function RoomsListPage() {
    const rooms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold font-headline",
                            children: "Rooms"
                        }, void 0, false, {
                            fileName: "[project]/src/app/property/rooms/list/page.tsx",
                            lineNumber: 16,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-muted-foreground",
                            children: "A list of all rooms across all properties."
                        }, void 0, false, {
                            fileName: "[project]/src/app/property/rooms/list/page.tsx",
                            lineNumber: 17,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/property/rooms/list/page.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/property/rooms/list/page.tsx",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DataTable"], {
                columns: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$property$2f$rooms$2f$columns$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["columns"],
                data: rooms
            }, void 0, false, {
                fileName: "[project]/src/app/property/rooms/list/page.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/property/rooms/list/page.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/app/property/rooms/list/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/property/rooms/list/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f94d64ff._.js.map