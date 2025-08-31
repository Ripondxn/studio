
'use server';

import { getStorageSettings } from '@/app/admin/external-storage/actions';

/**
 * Handles file uploads. If external storage (Google Drive) is enabled, it sends the file
 * to a dedicated API route for processing. Otherwise, it returns the base64 data URI
 * for local storage.
 * @param fileDataUri The file represented as a base64 data URI.
 * @param fileName The name of the file.
 * @returns A string representing the file (base64 data URL or a gdrive:// path).
 */
export async function handleFileUpload(fileDataUri: string, fileName: string): Promise<string> {
    const storageSettings = await getStorageSettings();
    
    if (storageSettings.enabled && storageSettings.provider === 'google-drive') {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileDataUri, fileName }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }
            
            // The API route returns a path like "gdrive://<file_id>"
            return result.filePath;

        } catch (error) {
            console.error('API upload error:', error);
            // Fallback to local storage if API call fails
            return fileDataUri;
        }

    } else {
        // Fallback to local storage (base64 encoding)
        return fileDataUri;
    }
}
