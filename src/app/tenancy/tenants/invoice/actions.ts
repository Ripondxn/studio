

// This file is now a pass-through to the centralized customer invoice actions.
// This ensures that all invoice logic is in one place, reducing complexity and bugs.

export {
    getInvoicesForCustomer,
    getNextSubscriptionInvoiceNumber,
    getNextGeneralInvoiceNumber,
    saveInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    applyPaymentToInvoices
} from '@/app/tenancy/customer/invoice/actions';
