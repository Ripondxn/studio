
import { NextResponse, NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import formidable from 'formidable';
import AdmZip from 'adm-zip';

const dataDirectory = path.join(process.cwd(), 'src/app');

// Promisify formidable
const parseForm = (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = formidable({});
        // @ts-ignore
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
};


export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const backupFile = formData.get('backupFile') as File | null;
        
        if (!backupFile) {
            return NextResponse.json({ error: 'No backup file uploaded.' }, { status: 400 });
        }

        // Convert the uploaded file to a buffer
        const fileBuffer = Buffer.from(await backupFile.arrayBuffer());

        const zip = new AdmZip(fileBuffer);
        const zipEntries = zip.getEntries();

        // Optional: Create a backup of the current state before restoring
        // This would involve calling the backup route logic here.

        for (const zipEntry of zipEntries) {
            // Basic security check: ensure files are not trying to traverse up the directory tree
            if (zipEntry.entryName.includes('..')) {
                console.warn(`Skipping potentially malicious file path: ${zipEntry.entryName}`);
                continue;
            }
            
            const targetPath = path.join(dataDirectory, zipEntry.entryName);
            const targetDir = path.dirname(targetPath);

            // Ensure the directory exists
            await fs.mkdir(targetDir, { recursive: true });

            // Write the file
            await fs.writeFile(targetPath, zipEntry.getData());
        }

        return NextResponse.json({ success: true, message: 'Restore completed successfully.' });

    } catch (error) {
        console.error('Restore failed:', error);
        return NextResponse.json({ error: 'Failed to restore from backup.' }, { status: 500 });
    }
}
