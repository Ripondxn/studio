

import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { Readable } from 'stream';

// This forces the route to use the Node.js runtime instead of the Edge runtime.
export const runtime = 'nodejs';

// Define the required scopes for Google Drive
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// The ID of the folder in your Google Drive where files will be uploaded.
const GDRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID;

// Function to get authenticated Google API client from environment variables
async function getAuthenticatedClient() {
    const privateKey = process.env.GDRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GDRIVE_CLIENT_EMAIL;
    
    if (!privateKey || !clientEmail || !GDRIVE_FOLDER_ID) {
        throw new Error('Google Drive environment variables (GDRIVE_PRIVATE_KEY, GDRIVE_CLIENT_EMAIL, GDRIVE_FOLDER_ID) are not properly set.');
    }

    const auth = new google.auth.GoogleAuth({
        credentials: {
            private_key: privateKey,
            client_email: clientEmail,
        },
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
            parents: [GDRIVE_FOLDER_ID!], // The exclamation mark asserts that it's defined (checked above)
        };

        // Convert base64 data URI to a readable stream
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
        return NextResponse.json({ error: error.message || 'Failed to upload file to Google Drive.' },