
import { Account } from './schema';

export const accounts: Account[] = [
  {
    code: '1000',
    name: 'Assets',
    type: 'Header',
    status: 'Active',
    balance: 0,
    isGroup: true,
  },
  {
    code: '1100',
    name: 'Current Assets',
    type: 'Asset',
    status: 'Active',
    balance: 0,
    isGroup: true,
    parentCode: '1000'
  },
  {
    code: '1110',
    name: 'Cash and Bank',
    type: 'Asset',
    status: 'Active',
    balance: 150000,
    isGroup: false,
    parentCode: '1100'
  },
  {
    code: '1120',
    name: 'Accounts Receivable',
    type: 'Asset',
    status: 'Active',
    balance: 75000,
    isGroup: false,
    parentCode: '1100'
  },
  {
    code: '1200',
    name: 'Fixed Assets',
    type: 'Asset',
    status: 'Active',
    balance: 300000,
    isGroup: true,
    parentCode: '1000'
  },
  {
    code: '2000',
    name: 'Liabilities',
    type: 'Header',
    status: 'Active',
    balance: 0,
    isGroup: true,
  },
  {
    code: '2100',
    name: 'Current Liabilities',
    type: 'Liability',
    status: 'Active',
    balance: 50000,
    isGroup: true,
    parentCode: '2000'
  },
   {
    code: '2110',
    name: 'Accounts Payable',
    type: 'Liability',
    status: 'Active',
    balance: 50000,
    isGroup: false,
    parentCode: '2100'
  },
  {
    code: '3000',
    name: 'Equity',
    type: 'Header',
    status: 'Active',
    balance: 475000,
    isGroup: false,
  },
  {
    code: '4000',
    name: 'Revenue',
    type: 'Header',
    status: 'Active',
    balance: 0,
    isGroup: true,
  },
  {
    code: '4100',
    name: 'Rental Income',
    type: 'Revenue',
    status: 'Active',
    balance: 95000,
    isGroup: false,
    parentCode: '4000'
  },
  {
    code: '5000',
    name: 'Expenses',
    type: 'Header',
    status: 'Active',
    balance: 0,
    isGroup: true,
  },
  {
    code: '5100',
    name: 'Operating Expenses',
    type: 'Expense',
    status: 'Active',
    balance: 35000,
    isGroup: true,
    parentCode: '5000'
  },
  {
    code: '5110',
    name: 'Maintenance and Repairs',
    type: 'Expense',
    status: 'Active',
    balance: 15000,
    isGroup: false,
    parentCode: '5100'
  },
  {
    code: '5120',
    name: 'Utilities',
    type: 'Expense',
    status: 'Active',
    balance: 10000,
    isGroup: false,
    parentCode: '5100'
  },
  {
    code: '5130',
    name: 'Salaries and Wages',
    type: 'Expense',
    status: 'Active',
    balance: 10000,
    isGroup: false,
    parentCode: '5100'
  }
];
