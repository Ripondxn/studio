
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs/promises';

// This forces the route to use the Node.js runtime instead of the Edge runtime.
export const runtime = 'nodejs';

// Define the required scopes for Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The ID of the folder in your Google Drive where files will be uploaded.
// You need to create a folder in your Drive and share it with your service account's email address.
const GDRIVE_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID'; // IMPORTANT: Replace with your actual folder ID

async function getAuthenticatedClient() {
    const keyFilePath = path.join(process.cwd(), 'google-credentials.json');
    try {
        await fs.access(keyFilePath);
    } catch (error) {
        throw new Error('Google credentials file not found. Please place "google-credentials.json" in the root directory.');
    }

    const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: SCOPES,
    });
    return auth.getClient();
}

export async function POST(request: Request) {
    try {
        const { fileDataUri, fileName } = await request.json();

        if (!fileDataUri || !fileName) {
            return NextResponse.json({ error: 'Missing file data or name.' }, { status: 400 });
        }
        
        const authClient = await getAuthenticatedClient();
        const drive = google.drive({ version: 'v3', auth: authClient as any });

        const fileMetadata = {
            name: fileName,
            parents: [GDRIVE_FOLDER_ID],
        };

        // Convert base64 to a readable stream
        const base64Data = fileDataUri.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const stream = Readable.from(buffer);
        const mimeType = fileDataUri.split(';')[0].split(':')[1];

        const media = {
            mimeType: mimeType,
            body: stream,
        };

        const response = await drive.files.create({
            // @ts-ignore
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });
        
        const fileId = response.data.id;
        if (!fileId) {
            throw new Error('File ID not returned from Google Drive API.');
        }

        const filePath = `gdrive://${fileId}`;
        
        return NextResponse.json({ success: true, filePath });

    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to upload file to Google Drive.' }, { status: 500 });
    }
}
