
import * as admin from 'firebase-admin';
import { existsSync } from 'fs';

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// The recommended approach is to use Application Default Credentials (ADC).
// Initialize without any arguments and it will automatically use ADC if available.
try {
    if (!admin.apps.length) {
        console.log("Attempting to initialize Firebase Admin with Application Default Credentials...");
        admin.initializeApp({ projectId });
        console.log("Firebase Admin initialized successfully with Application Default Credentials.");
    }
} catch (e) {
    console.warn("Could not initialize with Application Default Credentials, trying service account path.", e);
    
    // Fallback for local development outside of a GCP environment
    const serviceAccountPath = process.env.SERVICE_ACCOUNT_JSON_PATH;

    if (!serviceAccountPath) {
        throw new Error(
            'Firebase initialization failed. Application Default Credentials not found. ' +
            'For local development, set the SERVICE_ACCOUNT_JSON_PATH environment variable to the path of your service account JSON file in your .env.local'
        );
    }

    if (!existsSync(serviceAccountPath)) {
        throw new Error(
            `Firebase initialization failed. Service account file not found at path: ${serviceAccountPath}. ` +
            'Please check the SERVICE_ACCOUNT_JSON_PATH in your .env.local file.'
        );
    }
    
    if (!admin.apps.length) {
        console.log(`Attempting to initialize Firebase Admin with service account file: ${serviceAccountPath}`);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            projectId: projectId,
        });
        console.log("Firebase Admin initialized successfully with service account file.");
    }
}

const firestoreAdmin = admin.firestore();

export { firestoreAdmin };
