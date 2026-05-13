import admin from 'firebase-admin';

if (!admin.apps.length) {
  if (process.env.USE_FIRESTORE_EMULATOR === 'true') {
    // Docker compose already sets FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST.
    // firebase-admin reads those env vars automatically.
    admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'demo-project' } as any);
  } else {
    admin.initializeApp(); // uses Application Default Credentials in Cloud Functions
  }
}

export const db = admin.firestore();
export default admin;