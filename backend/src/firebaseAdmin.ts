
import admin from 'firebase-admin';

const PROJECT_ID = 'demo-project';
const EMULATOR_HOST = 'firebase-emulator:3003'; 
const AUTH_EMULATOR_HOST = 'firebase-emulator:9099'

if (!admin.apps.length) {
  process.env.GOOGLE_CLOUD_PROJECT = PROJECT_ID;       
  process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST; 
  process.env.FIREBASE_AUTH_EMULATOR_HOST = AUTH_EMULATOR_HOST;

  admin.initializeApp({
    projectId: PROJECT_ID,
  } as any);
}

export const db = admin.firestore();
export default admin