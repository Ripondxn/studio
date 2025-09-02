'use server';

import { getStorageSettings } from '@/app/admin/external-storage/actions';

/**
 * Handles file uploads. If external storage (Google Drive) is enabled and the app is in production, 
 * it sends the file to a dedicated API route for processing. Otherwise, it returns the base64 data URI
 * for local storage, which is ideal for local development.
 * @param fileDataUri The file represented as a base64 data URI.
 * @param fileName The name of the file.
 * @returns A string representing the file path (e.g., base64 data URL or a gdrive:// path).
 */
export async function handleFileUpload(fileDataUri: string, fileName: string): Promise<string> {
    const storageSettings = await getStorageSettings();
    
    // Use Google Drive only if enabled AND in a production environment
    if (storageSettings.enabled && storageSettings.provider === 'google-drive' && process.env.NODE_ENV === 'production') {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileDataUri, fileName }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload to Google Drive failed');
            }
            
            // The API route returns a path like "gdrive://<file_id>"
            return result.filePath;

        } catch (error) {
            console.error('API upload error:', error);
            // Fallback to local storage if API call fails in production
            return fileDataUri;
        }

    } else {
        // Default to local storage (base64 encoding) for local development or if GDrive is disabled
        return fileDataUri;
    }
}