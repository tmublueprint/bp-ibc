import auth from '../firebase/firebaseApp'
import { signInWithEmailAndPassword } from 'firebase/auth'

export async function authenticateUser (email: string, password: string) {
    try {
        const userCredentials = await signInWithEmailAndPassword (
            auth,
            email,
            password
        )
        return userCredentials;
    } catch (err) {
        console.log(err);
    }

}