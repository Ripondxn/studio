
import * as admin from 'firebase-admin';

// IMPORTANT:
// 1. Go to your Firebase project settings -> Service accounts.
// 2. Click "Generate new private key" and download the JSON file.
// 3. DO NOT commit this file to your repository.
// 4. Encode the contents of the JSON file to a Base64 string.
//    You can use an online tool or the following command in your terminal:
//    base64 -i [path-to-your-service-account-file.json]
// 5. Create a .env.local file in the root of your project.
// 6. Add the following line to your .env.local file, replacing the placeholder:
//    FIREBASE_SERVICE_ACCOUNT_KEY_BASE64="<your-base64-encoded-key>"
// 7. You also need to add your Firebase project ID to the environment variables:
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"

const serviceAccountKeyBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!serviceAccountKeyBase64) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 environment variable is not set.');
}

if (!projectId) {
    throw new Error('The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.');
}

const serviceAccount = JSON.parse(Buffer.from(serviceAccountKeyBase64, 'base64').toString('utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: projectId,
  });
}

const firestoreAdmin = admin.firestore();

export { firestoreAdmin };
