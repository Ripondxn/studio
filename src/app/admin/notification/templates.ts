
export const templates = [
  {
    id: 'due-payment',
    name: 'Due Payment Reminder',
    subject: 'Friendly Reminder: Payment Due for [Property/Service]',
    body: `Dear [Recipient Name],

This is a friendly reminder that your payment of [Amount] for [Property/Service] is due on [Due Date].

Please make the payment at your earliest convenience to avoid any service interruptions or late fees.

If you have already made the payment, please disregard this notice.

Thank you,
Trust Famous Real Estate`
  },
  {
    id: 'contract-renewal',
    name: 'Tenancy Contract Renewal',
    subject: 'Your Tenancy Contract is Expiring Soon',
    body: `Dear [Recipient Name],

We hope you are enjoying your time at [Property Address].

This is to inform you that your tenancy contract is scheduled to expire on [End Date]. We would be delighted to have you continue your stay with us.

Please let us know if you wish to renew your contract. We can then prepare the renewal documents for you.

We look forward to hearing from you soon.

Best regards,
Trust Famous Real Estate`
  },
  {
    id: 'warning-letter',
    name: 'Warning Letter',
    subject: 'Official Warning Notice: [Reason for Warning]',
    body: `Dear [Recipient Name],

This letter serves as an official warning regarding [Reason for Warning, e.g., a breach of tenancy agreement terms, consistent late payments].

Specifically, we have noted the following issue:
[Describe the issue in detail here]

This is a violation of [mention specific clause or rule, e.g., clause 5 of your tenancy agreement].

Please take immediate corrective action to resolve this matter by [Date for action]. Failure to do so may result in further action, including but not limited to [mention consequences, e.g., eviction notice, legal action].

We trust that we can resolve this matter amicably.

Sincerely,
Trust Famous Real Estate Management`
  },
  {
    id: 'account-statement',
    name: 'Account Statement',
    subject: 'Your Account Statement from Trust Famous Real Estate',
    body: `Dear [Recipient Name],

Please find your attached account statement for the period [Start Date] to [End Date].

This statement includes all recent transactions and your current balance.

If you have any questions regarding this statement, please do not hesitate to contact us.

Thank you,
Trust Famous Real Estate`
  },
  {
    id: 'custom-notice',
    name: 'Custom Notice',
    subject: '',
    body: `Dear [Recipient Name],

This is to inform you that...

[Enter your message here]

Best regards,
Trust Famous Real Estate`
  }
];
