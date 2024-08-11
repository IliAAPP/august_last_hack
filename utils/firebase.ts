import { initializeApp } from 'firebase/app'
import { getAuth, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth'
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBfDaOV44mwQDaD1VoDktUWEGybsjveNcc",
    authDomain: "electro-e2816.firebaseapp.com",
    projectId: "electro-e2816",
    storageBucket: "electro-e2816.appspot.com",
    messagingSenderId: "720920254",
    appId: "1:720920254:web:8cc3dbd79ccb63746b48ef"
}

initializeApp(firebaseConfig)

export const auth = getAuth()

export const register = (email: string, password: string) => 
    createUserWithEmailAndPassword(auth, email, password)

export const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

export const logout = () => signOut(auth)

export const db = getFirestore()