import { onRequest } from 'firebase-functions/v2/https';
import './firebaseAdmin';
import app from './app';

export const api = onRequest({ invoker: 'public' }, app);
