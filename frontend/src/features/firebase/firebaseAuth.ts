import auth from '../firebase/firebaseApp'
import { signInWithEmailAndPassword } from 'firebase/auth'

export async function authenticateUser(email: string, password: string) {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
    return userCredentials;
}