
import { NextResponse } from 'next/server';
import archiver from 'archiver';
import { promises as fs } from 'fs';
import path from 'path';
import { PassThrough } from 'stream';

const dataDirectory = path.join(process.cwd(), 'src/app');

// List of all JSON files to be included in the backup
const JSON_FILES_TO_BACKUP = [
  'admin/profile/data.json',
  'admin/communication/settings.json',
  'admin/user-roles/users.json',
  'admin/backup/settings.json',
  'finance/banking/accounts-data.json',
  'finance/banking/petty-cash.json',
  'finance/chart-of-accounts/accounts.json',
  'finance/cheque-deposit/cheques-data.json',
  'finance/equity/transactions.json',
  'finance/payment/payments-data.json',
  'landlord/landlords-data.json',
  'lease/contract/contracts-data.json',
  'maintenance/ticket-issue/tickets-data.json',
  'property/properties/list/properties-data.json',
  'property/units/units-data.json',
  'property/floors/floors-data.json',
  'property/rooms/rooms-data.json',
  'property/partitions/partitions-data.json',
  'tenancy/tenants/tenants-data.json',
  'tenancy/customer/customers-data.json',
  'tenancy/customer/invoice/invoices-data.json',
  'tenancy/contract/contracts-data.json',
  'vendors/vendors-data.json',
  'vendors/agents/agents-data.json',
];

export async function POST() {
  try {
    const stream = new PassThrough();
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });

    archive.pipe(stream);

    for (const file of JSON_FILES_TO_BACKUP) {
        const filePath = path.join(dataDirectory, file);
        try {
            // Check if file exists before adding
            await fs.access(filePath);
            archive.file(filePath, { name: file });
        } catch (error) {
            // Log if a file doesn't exist but continue the backup process
            console.warn(`Backup warning: File not found and will be skipped: ${file}`);
        }
    }

    await archive.finalize();

    return new NextResponse(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="backup.zip"',
      },
    });
  } catch (error) {
    console.error('Backup creation failed:', error);
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 });
  }
}
